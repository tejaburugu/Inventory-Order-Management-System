import React, {useState, useEffect} from 'react'

export default function CustomerForm({initial, onSubmit, onCancel}){
  const [form, setForm] = useState({full_name:'', email:'', phone:''})
  const [errors, setErrors] = useState({})

  useEffect(()=>{
    if(initial){
      setForm({
        full_name: initial.full_name || '',
        email: initial.email || '',
        phone: initial.phone || ''
      })
    }
  },[initial])

  const validateEmail = (email) => {
    // simple email regex
    return /^\S+@\S+\.\S+$/.test(email)
  }

  const validate = ()=>{
    const e = {}
    if(!form.full_name.trim()) e.full_name = 'Full name is required'
    if(!form.email.trim()) e.email = 'Email is required'
    else if(!validateEmail(form.email)) e.email = 'Enter a valid email'
    if(!form.phone.trim()) e.phone = 'Phone is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev)=>{
    ev.preventDefault()
    if(!validate()) return
    onSubmit({full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim()})
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <label>Full name</label>
        <input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} />
        {errors.full_name && <div className="form-error">{errors.full_name}</div>}
      </div>
      <div className="form-row">
        <label>Email</label>
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>
      <div className="form-row">
        <label>Phone</label>
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
        {errors.phone && <div className="form-error">{errors.phone}</div>}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  )
}
