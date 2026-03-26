import { NavLink } from 'react-router-dom'
import {
  FiHome, FiCompass, FiClock, FiThumbsUp, FiList,
  FiTwitter, FiBarChart2, FiSettings, FiUser
} from 'react-icons/fi'
import useAuthStore from '../../store/authStore'
import './Sidebar.css'

const NAV = [
  { to: '/',         icon: FiHome,     label: 'Home',      end: true },
  { to: '/explore',  icon: FiCompass,  label: 'Explore' },
]

const USER_NAV = [
  { to: '/history',   icon: FiClock,    label: 'History' },
  { to: '/liked',     icon: FiThumbsUp, label: 'Liked' },
  { to: '/playlists', icon: FiList,     label: 'Playlists' },
  { to: '/tweets',    icon: FiTwitter,  label: 'Tweets' },
  { to: '/dashboard', icon: FiBarChart2,label: 'Dashboard' },
  { to: '/settings',  icon: FiSettings, label: 'Settings' },
]

export default function Sidebar() {
  const { user, isAuthenticated } = useAuthStore()

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {isAuthenticated && (
          <>
            <div className="divider sidebar-divider" />
            <div className="nav-label">Library</div>
            <div className="nav-section">
              {USER_NAV.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>

      {isAuthenticated && (
        <NavLink
          to={`/channel/${user?.username}`}
          className="sidebar-profile"
        >
          <img src={user?.avatar} alt="" className="avatar avatar-sm" />
          <div className="sidebar-profile-info">
            <div className="truncate" style={{ fontSize: 13, fontWeight: 600 }}>{user?.fullName}</div>
            <div className="text-dim truncate" style={{ fontSize: 12 }}>@{user?.username}</div>
          </div>
          <FiUser size={14} className="text-dim" style={{ flexShrink: 0 }} />
        </NavLink>
      )}
    </aside>
  )
}
