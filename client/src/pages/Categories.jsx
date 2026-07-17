import { useState, useEffect } from 'react'
import { api } from '../api'
import { Plus, Edit2, Trash2, X, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#be185d', '#4338ca', '#15803d', '#c2410c']

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', color: COLORS[0] })

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await api('/categories')
      setCategories(data)
    } catch (err) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCategories() }, [])

  const openAdd = () => { setForm({ name: '', description: '', color: COLORS[0] }); setEditing(null); setShowModal(true) }
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '', color: c.color }); setEditing(c); setShowModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api(`/categories/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
        toast.success('Category updated')
      } else {
        await api('/categories', { method: 'POST', body: JSON.stringify(form) })
        toast.success('Category created')
      }
      setShowModal(false)
      loadCategories()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products will be unlinked.')) return
    try {
      await api(`/categories/${id}`, { method: 'DELETE' })
      toast.success('Category deleted')
      loadCategories()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} categories total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Category</button>
      </div>
      {loading ? (
        <div className="page-loading"><div className="spinner"></div></div>
      ) : (
        <div className="card-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="category-card-header">
                <div className="category-icon" style={{ background: cat.color + '20', color: cat.color }}>
                  <Palette size={22} />
                </div>
                <div className="category-actions">
                  <button className="action-btn edit" onClick={() => openEdit(cat)}><Edit2 size={15} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(cat.id)}><Trash2 size={15} /></button>
                </div>
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-desc">{cat.description || 'No description'}</p>
              <div className="category-footer">
                <span className="category-products">{cat._count.products} products</span>
                <span className="category-color" style={{ background: cat.color }}></span>
              </div>
            </div>
          ))}
          {categories.length === 0 && <p className="empty-state full">No categories yet. Create one to get started!</p>}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {COLORS.map((c) => (
                    <button key={c} type="button" className={`color-swatch ${form.color === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />
                  ))}
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
    </div>
  )
}