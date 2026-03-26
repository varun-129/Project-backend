import { useState, useRef } from 'react'
import { FiCamera, FiLock, FiUser } from 'react-icons/fi'
import { authService } from '../services'
import useAuthStore from '../store/authStore'
import { getApiError } from '../utils/helpers'
import toast from 'react-hot-toast'
import './Settings.css'

export default function Settings() {
  const { user, updateUser } = useAuthStore()
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const avatarRef = useRef()
  const coverRef = useRef()

  const setProfile = (k) => (e) => setProfileForm((f) => ({ ...f, [k]: e.target.value }))
  const setPw = (k) => (e) => setPwForm((f) => ({ ...f, [k]: e.target.value }))

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      const { data } = await authService.updateAvatar(fd)
      updateUser({ avatar: data.data.avatar })
      toast.success('Avatar updated!')
    } catch (err) { toast.error(getApiError(err)) }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('coverImage', file)
    try {
      const { data } = await authService.updateCoverImage(fd)
      updateUser({ coverImage: data.data.coverImage })
      toast.success('Cover image updated!')
    } catch (err) { toast.error(getApiError(err)) }
  }

  const handleProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const { data } = await authService.updateProfile(profileForm)
      updateUser(data.data)
      toast.success('Profile updated!')
    } catch (err) { toast.error(getApiError(err)) }
    finally { setSavingProfile(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    setSavingPw(true)
    try {
      await authService.changePassword(pwForm)
      setPwForm({ currentPassword: '', newPassword: '' })
      toast.success('Password changed!')
    } catch (err) { toast.error(getApiError(err)) }
    finally { setSavingPw(false) }
  }

  return (
    <div className="settings-page">
      <div className="section-header">
        <h1 className="section-title">SETTINGS</h1>
      </div>

      <div className="settings-grid">
        {/* Profile images */}
        <div className="settings-card card">
          <h2 className="settings-card-title display">PROFILE IMAGES</h2>

          <div className="cover-settings-wrap" onClick={() => coverRef.current.click()}>
            {user?.coverImage
              ? <img src={user.coverImage} alt="" className="settings-cover-preview" />
              : <div className="settings-cover-placeholder"><FiCamera size={24} className="text-dim" /><span className="text-dim" style={{ fontSize: 13 }}>Click to update cover image</span></div>
            }
            <div className="settings-cover-overlay"><FiCamera size={20} /> Update Cover</div>
            <input ref={coverRef} type="file" accept="image/*" hidden onChange={handleCoverChange} />
          </div>

          <div className="settings-avatar-row">
            <div className="settings-avatar-wrap" onClick={() => avatarRef.current.click()}>
              <img src={user?.avatar} alt="" className="avatar avatar-2xl settings-avatar" />
              <div className="settings-avatar-overlay"><FiCamera size={16} /></div>
              <input ref={avatarRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{user?.fullName}</div>
              <div className="text-dim" style={{ fontSize: 13 }}>@{user?.username}</div>
              <div className="text-dim" style={{ fontSize: 12, marginTop: 6 }}>Click avatar or cover to update</div>
            </div>
          </div>
        </div>

        {/* Profile info */}
        <div className="settings-card card">
          <h2 className="settings-card-title display">
            <FiUser size={18} /> PROFILE INFO
          </h2>
          <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={profileForm.fullName} onChange={setProfile('fullName')} placeholder="Your full name" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={profileForm.email} onChange={setProfile('email')} placeholder="your@email.com" required />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingProfile} style={{ alignSelf: 'flex-start' }}>
              {savingProfile ? <><span className="spinner spinner-sm" /> Saving…</> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="settings-card card">
          <h2 className="settings-card-title display"><FiLock size={18} /> SECURITY</h2>
          <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="label">Current Password</label>
              <input className="input" type="password" value={pwForm.currentPassword} onChange={setPw('currentPassword')} placeholder="••••••••" required />
            </div>
            <div>
              <label className="label">New Password</label>
              <input className="input" type="password" value={pwForm.newPassword} onChange={setPw('newPassword')} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingPw} style={{ alignSelf: 'flex-start' }}>
              {savingPw ? <><span className="spinner spinner-sm" /> Updating…</> : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
