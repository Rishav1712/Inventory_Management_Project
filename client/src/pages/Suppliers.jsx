import { useState, useEffect } from 'react'
import { api } from '../api'
import { Plus, Edit2, Trash2, Mail, Phone, MapPin, User, X } from 'lucide-react'
import toast from 'react-hot-toast'

const emptySupplier = { name: '', email: '', phone: '', address: '', contact: '' }

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptySupplier })

  const loadSuppliers = async () => {
    setLoading(true)
    try {
      const data = await api('/suppliers')
      setSuppliers(data)
    } catch (err) {
      toast.error('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSuppliers() }, [])

  const openAdd = () => { setForm({ ...emptySupplier }); setEditing(null); setShowModal(true) }
  const openEdit = (s) => { setForm({ ...s }); setEditing(s); setShowModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api(`/suppliers/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
        toast.success('Supplier updated')
      } else {
        await api('/suppliers', { method: 'POST', body: JSON.stringify(form) })
        toast.success('Supplier created')
      }
      setShowModal(false)
      loadSuppliers()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this supplier?')) return
    try {
      await api(`/suppliers/${id}`, { method: 'DELETE' })
      toast.success('Supplier deleted')
      loadSuppliers()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="page-subtitle">{suppliers.length} suppliers total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Supplier</button>
      </div>
      {loading ? (
        <div className="page-loading"><div className="spinner"></div></div>
      ) : (
        <div className="card-grid">
          {suppliers.map((sup) => (
            <div key={sup.id} className="supplier-card">
              <div className="supplier-card-header">
                <div className="supplier-avatar">{sup.name.charAt(0)}</div>
                <div className="supplier-actions">
                  <button className="action-btn edit" onClick={() => openEdit(sup)}><Edit2 size={15} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(sup.id)}><Trash2 size={15} /></button>
                </div>
              </div>
              <h3 className="supplier-name">{sup.name}</h3>
              {sup.contact && <p className="supplier-contact"><User size={14} /> {sup.contact}</p>}
              {sup.email && <p className="supplier-detail"><Mail size={14} /> {sup.email}</p>}
              {sup.phone && <p className="supplier-detail"><Phone size={14} /> {sup.phone}</p>}
              {sup.address && <p className="supplier-detail"><MapPin size={14} /> {sup.address}</p>}
              <div className="supplier-footer">
                <span className="supplier-products">{sup._count.products} products</span>
              </div>
            </div>
          ))}
          {suppliers.length === 0 && <p className="empty-state full">No suppliers yet. Add one to get started!</p>}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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