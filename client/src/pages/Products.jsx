import { useState, useEffect } from 'react'
import { api } from '../api'
import { Plus, Search, Edit2, Trash2, ArrowDownToLine, ArrowUpFromLine, Settings2, Package, X } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyProduct = { name: '', description: '', sku: '', quantity: 0, minStock: 5, price: '', costPrice: '', unit: 'pcs', location: '', categoryId: '', supplierId: '' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyProduct })
  const [stockForm, setStockForm] = useState({ type: 'in', quantity: '', reason: '' })
  const [stockProduct, setStockProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterCat) params.set('categoryId', filterCat)
    try {
      const [prods, cats, sups] = await Promise.all([
        api(`/products?${params}`),
        api('/categories'),
        api('/suppliers'),
      ])
      setProducts(prods)
      setCategories(cats)
      setSuppliers(sups)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [search, filterCat])

  const openAdd = () => { setForm({ ...emptyProduct }); setEditing(null); setShowModal(true) }
  const openEdit = (p) => { setForm({ ...p, categoryId: p.categoryId || '', supplierId: p.supplierId || '' }); setEditing(p); setShowModal(true) }
  const openStock = (p, type) => { setStockProduct(p); setStockForm({ type, quantity: '', reason: '' }); setShowStockModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api(`/products/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
        toast.success('Product updated')
      } else {
        await api('/products', { method: 'POST', body: JSON.stringify(form) })
        toast.success('Product created')
      }
      setShowModal(false)
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api(`/products/${id}`, { method: 'DELETE' })
      toast.success('Product deleted')
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleStock = async (e) => {
    e.preventDefault()
    try {
      await api(`/products/${stockProduct.id}/stock`, { method: 'POST', body: JSON.stringify(stockForm) })
      toast.success('Stock updated')
      setShowStockModal(false)
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const isLowStock = (p) => p.quantity <= p.minStock

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} products total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Product</button>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search by name, SKU..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="page-loading"><div className="spinner"></div></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th><th>SKU</th><th>Category</th><th>Stock</th><th>Price</th><th>Location</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className={isLowStock(p) ? 'low-stock-row' : ''}>
                    <td>
                      <div className="product-cell">
                        <span className="product-name">{p.name}</span>
                        {isLowStock(p) && <span className="low-stock-badge">Low</span>}
                      </div>
                    </td>
                    <td><code>{p.sku}</code></td>
                    <td>{p.category ? <span className="cat-badge" style={{ background: p.category.color + '20', color: p.category.color }}>{p.category.name}</span> : '-'}</td>
                    <td>
                      <div className="stock-actions">
                        <span className={`stock-value ${isLowStock(p) ? 'stock-low' : ''}`}>{p.quantity} {p.unit}</span>
                        <div className="stock-btns">
                          <button className="stock-btn in" onClick={() => openStock(p, 'in')} title="Stock In"><ArrowDownToLine size={14} /></button>
                          <button className="stock-btn out" onClick={() => openStock(p, 'out')} title="Stock Out"><ArrowUpFromLine size={14} /></button>
                        </div>
                      </div>
                    </td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td>{p.location || '-'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={() => openEdit(p)}><Edit2 size={15} /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(p.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={7} className="empty-state">No products found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              <div className="form-grid">
                <div className="form-group full">
                  <label>Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>SKU *</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required disabled={!!editing} />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                    <option value="pcs">Pcs</option><option value="kg">Kg</option><option value="box">Box</option><option value="pack">Pack</option><option value="ream">Ream</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Cost Price (₹)</label>
                  <input type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>Min Stock</label>
                  <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: parseInt(e.target.value) || 5 })} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">None</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}>
                    <option value="">None</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Shelf A1" />
                </div>
                <div className="form-group full">
                  <label>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showStockModal && stockProduct && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Stock {stockForm.type === 'in' ? 'In' : 'Out'} — {stockProduct.name}</h3>
              <button className="modal-close" onClick={() => setShowStockModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleStock} className="modal-body">
              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" min="1" value={stockForm.quantity} onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <input type="text" value={stockForm.reason} onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })} placeholder="e.g. Restocking" />
              </div>
              <p className="stock-info">Current stock: <strong>{stockProduct.quantity} {stockProduct.unit}</strong></p>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStockModal(false)}>Cancel</button>
                <button type="submit" className={`btn ${stockForm.type === 'in' ? 'btn-success' : 'btn-warning'}`}>
                  {stockForm.type === 'in' ? 'Add Stock' : 'Remove Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}