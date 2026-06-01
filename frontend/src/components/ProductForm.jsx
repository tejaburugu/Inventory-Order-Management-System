import React, {useState, useEffect} from 'react'

export default function ProductForm({initial, onSubmit, onCancel}){
  const [form, setForm] = useState({name:'', sku:'', price:'', quantity:''})
  const [errors, setErrors] = useState({})

  useEffect(()=>{ if(initial) setForm({
    name: initial.name || '', sku: initial.sku || '', price: initial.price != null ? String(initial.price) : '', quantity: initial.quantity != null ? String(initial.quantity) : ''
  }) },[initial])

  const validate = ()=>{
    const e = {}
    if(!form.name.trim()) e.name = 'Name is required'
    if(!form.sku.trim()) e.sku = 'SKU is required'
    const price = Number(form.price)
    if(!form.price || isNaN(price) || price <= 0) e.price = 'Price must be > 0'
    const qty = Number(form.quantity)
    if(form.quantity === '' || isNaN(qty) || qty < 0) e.quantity = 'Quantity must be >= 0'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    if(!validate()) return
    onSubmit({name: form.name.trim(), sku: form.sku.trim(), price: parseFloat(form.price), quantity: parseInt(form.quantity,10)})
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>
      <div className="form-row">
        <label>SKU</label>
        <input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} />
        {errors.sku && <div className="form-error">{errors.sku}</div>}
      </div>
      <div className="form-row">
        <label>Price</label>
        <input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        {errors.price && <div className="form-error">{errors.price}</div>}
      </div>
      <div className="form-row">
        <label>Quantity</label>
        <input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
        {errors.quantity && <div className="form-error">{errors.quantity}</div>}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  )
}
