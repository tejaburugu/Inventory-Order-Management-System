import React from 'react'
import './Toast.css'

export default function Toast({message, type='info', onClose}){
  if(!message) return null
  return (
    <div className={`toast ${type}`} onClick={onClose}>
      <div className="toast-message">{message}</div>
      <button className="toast-close">✕</button>
    </div>
  )
}
