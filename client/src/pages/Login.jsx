import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Package, Lock, Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password)
        toast.success('Account created!')
      } else {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-circle c1"></div>
        <div className="login-bg-circle c2"></div>
        <div className="login-bg-circle c3"></div>
      </div>
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon"><Package size={28} /></div>
          <h1>InventoryPro</h1>
          <p>Inventory Management System</p>
        </div>
        <h2 className="login-title">{isRegister ? 'Create Account' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          )}
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <p className="login-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Sign In' : 'Register'}</button>
        </p>
        {!isRegister && (
          <div className="login-hint">
            <p>Demo credentials: <strong>admin@inventory.com</strong> / <strong>admin123</strong></p>
          </div>
        )}
      </div>
    </div>
  )
}