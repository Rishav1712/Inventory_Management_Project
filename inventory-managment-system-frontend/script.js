document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const productList = document.getElementById('product-list');
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const closeModalBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelBtn');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modal-title');
    const productIdInput = document.getElementById('productId');
    const loadingMessage = document.getElementById('loading-message');
    const themeToggle = document.getElementById('theme-toggle');

    // --- API Configuration ---
    const API_URL = 'http://localhost:3001/api/products';

    // --- Theme Management ---
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.checked = theme === 'dark';
    };

    const toggleTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    };

    themeToggle.addEventListener('change', toggleTheme);

    // Initialize theme on page load
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);


    // --- Modal Handling ---
    const openModal = (mode = 'add', product = null) => {
        productForm.reset();
        if (mode === 'edit' && product) {
            modalTitle.textContent = 'Edit Product';
            productIdInput.value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description || '';
            document.getElementById('quantity').value = product.quantity;
            document.getElementById('price').value = product.price;
        } else {
            modalTitle.textContent = 'Add New Product';
            productIdInput.value = '';
        }
        productModal.style.display = 'block';
    };

    const closeModal = () => {
        productModal.style.display = 'none';
    };

    addProductBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            closeModal();
        }
    });

    // --- API Functions (CRUD) ---
    const fetchProducts = async () => {
        loadingMessage.style.display = 'block';
        productList.innerHTML = '';
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            productList.innerHTML = `<tr><td colspan="5">Error loading products. Please try again later.</td></tr>`;
        } finally {
            loadingMessage.style.display = 'none';
        }
    };

    const displayProducts = (products) => {
        if (products.length === 0) {
            productList.innerHTML = `<tr><td colspan="5">No products found. Add one!</td></tr>`;
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description || 'N/A'}</td>
                <td>${product.quantity}</td>
                <td>$${Number(product.price).toFixed(2)}</td>
                <td class="actions">
                    <button class="btn btn-primary edit-btn" data-id="${product.id}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            productList.appendChild(row);

            // Add event listeners for edit and delete buttons
            row.querySelector('.edit-btn').addEventListener('click', () => openModal('edit', product));
            row.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(product.id));
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const id = productIdInput.value;
        const productData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            quantity: parseInt(document.getElementById('quantity').value),
            price: parseFloat(document.getElementById('price').value),
        };

        const isEditing = !!id;
        const url = isEditing ? `${API_URL}/${id}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);

            closeModal();
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Form submission error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete product');
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error('Delete error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    // --- Initial Load ---
    productForm.addEventListener('submit', handleFormSubmit);
    fetchProducts();
});