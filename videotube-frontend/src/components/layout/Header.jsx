import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiUpload, FiBell, FiX } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import UploadModal from '../video/UploadModal'
import './Header.css'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [query, setQuery] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
    setDropOpen(false)
  }

  return (
    <>
      <header className="header">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="logo-icon">▶</span>
          <span className="display logo-text">VIDEOTUBE</span>
        </Link>

        {/* Search */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-wrap input-icon-left">
            <FiSearch className="icon" size={16} />
            <input
              ref={inputRef}
              className="input search-input"
              placeholder="Search videos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => { setQuery(''); inputRef.current.focus() }}
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => setShowUpload(true)}>
                <FiUpload size={14} /> Upload
              </button>
              <button className="btn btn-ghost btn-icon" title="Notifications">
                <FiBell size={18} />
              </button>
              <div className="avatar-menu">
                <img
                  src={user?.avatar}
                  alt={user?.username}
                  className="avatar avatar-sm"
                  onClick={() => setDropOpen((p) => !p)}
                />
                {dropOpen && (
                  <div className="avatar-dropdown fade-in">
                    <div className="dropdown-user">
                      <img src={user?.avatar} alt="" className="avatar avatar-md" />
                      <div>
                        <div className="dropdown-name">{user?.fullName}</div>
                        <div className="dropdown-username text-dim">@{user?.username}</div>
                      </div>
                    </div>
                    <div className="divider" />
                    <Link to={`/channel/${user?.username}`} className="dropdown-item" onClick={() => setDropOpen(false)}>My Channel</Link>
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setDropOpen(false)}>Dashboard</Link>
                    <Link to="/liked" className="dropdown-item" onClick={() => setDropOpen(false)}>Liked Videos</Link>
                    <Link to="/history" className="dropdown-item" onClick={() => setDropOpen(false)}>Watch History</Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setDropOpen(false)}>Settings</Link>
                    <div className="divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join</Link>
            </>
          )}
        </div>
      </header>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  )
}
