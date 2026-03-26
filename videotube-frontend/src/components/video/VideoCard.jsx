import { Link } from 'react-router-dom'
import { FiEye, FiClock } from 'react-icons/fi'
import { timeAgo, formatViews, formatDuration } from '../../utils/helpers'
import './VideoCard.css'

export default function VideoCard({ video, style }) {
  if (!video) return null

  return (
    <div className="video-card fade-up card" style={style}>
      <Link to={`/watch/${video._id}`} className="video-thumbnail-wrap">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="video-thumbnail"
          loading="lazy"
        />
        <span className="video-duration mono">
          <FiClock size={11} />
          {formatDuration(video.duration)}
        </span>
        <div className="thumbnail-overlay" />
      </Link>

      <div className="video-info">
        <Link to={`/channel/${video.owner?.username}`} className="video-owner">
          <img src={video.owner?.avatar} alt="" className="avatar avatar-xs" />
          <span className="text-dim" style={{ fontSize: 12 }}>@{video.owner?.username}</span>
        </Link>

        <Link to={`/watch/${video._id}`} className="video-title line-clamp-2">
          {video.title}
        </Link>

        <div className="video-meta flex gap-2 items-center">
          <span className="flex items-center gap-1 text-dim" style={{ fontSize: 12 }}>
            <FiEye size={12} /> {formatViews(video.views)}
          </span>
          <span className="text-dim" style={{ fontSize: 12 }}>·</span>
          <span className="text-dim" style={{ fontSize: 12 }}>{timeAgo(video.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
