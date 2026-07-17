import { useState, useEffect } from 'react'
import { api } from '../api'
import { Package, Tag, Truck, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/dashboard').then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>
  if (!data) return <div className="page-error">Failed to load dashboard</div>

  const kpis = [
    { label: 'Total Products', value: data.totalProducts, icon: <Package size={24} />, color: '#4f46e5', bg: '#eef2ff' },
    { label: 'Total Value', value: `₹${Number(data.totalValue).toLocaleString()}`, icon: <DollarSign size={24} />, color: '#059669', bg: '#ecfdf5' },
    { label: 'Categories', value: data.totalCategories, icon: <Tag size={24} />, color: '#d97706', bg: '#fffbeb' },
    { label: 'Suppliers', value: data.totalSuppliers, icon: <Truck size={24} />, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Low Stock', value: data.lowStockCount, icon: <AlertTriangle size={24} />, color: '#dc2626', bg: '#fef2f2' },
    { label: 'Profit Margin', value: `${data.profitMargin}%`, icon: <TrendingUp size={24} />, color: '#0891b2', bg: '#ecfeff' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your inventory</p>
      </div>
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
            <div className="kpi-info">
              <span className="kpi-label">{kpi.label}</span>
              <span className="kpi-value">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">Recent Stock Movements</h3>
          {data.recentMovements.length === 0 ? (
            <p className="empty-text">No recent movements</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Product</th><th>Type</th><th>Qty</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {data.recentMovements.map((m) => (
                    <tr key={m.id}>
                      <td>{m.product.name}</td>
                      <td><span className={`badge badge-${m.type}`}>{m.type}</span></td>
                      <td>{m.quantity}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card">
          <h3 className="card-title">Category Breakdown</h3>
          {data.categoryBreakdown.map((cat) => (
            <div key={cat.id} className="category-bar">
              <div className="category-bar-header">
                <span className="category-dot" style={{ background: cat.color }}></span>
                <span>{cat.name}</span>
                <span className="category-count">{cat._count.products}</span>
              </div>
              <div className="category-bar-track">
                <div className="category-bar-fill" style={{ width: `${(cat._count.products / Math.max(data.totalProducts, 1)) * 100}%`, background: cat.color }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="card-title">Top Products by Stock</h3>
          {data.topProducts.map((p, i) => (
            <div key={i} className="top-product">
              <span className="top-product-rank">#{i + 1}</span>
              <div className="top-product-info">
                <span className="top-product-name">{p.name}</span>
                <span className="top-product-sku">{p.sku}</span>
              </div>
              <span className="top-product-qty">{p.quantity} pcs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}