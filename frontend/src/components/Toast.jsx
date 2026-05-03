// Toast.jsx - Notification popup component

import { useEffect } from 'react'

/**
 * Toast notification that auto-dismisses after 3 seconds
 * @param {string} message - Text to display
 * @param {string} type - 'success' or 'error'
 * @param {function} onClose - Called when toast should be removed
 */
export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast ${type}`}>
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  )
}