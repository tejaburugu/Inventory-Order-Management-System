import React, {useState, useEffect, useMemo} from 'react'
import api from '../api/axios'

export default function OrderForm({initial, onSubmit, onCancel}){
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({customer_id: '', items: []})
  const [errors, setErrors] = useState('')

  useEffect(()=>{
    const load = async ()=>{
      try{
        const [cusRes, prodRes] = await Promise.all([api.get('/customers'), api.get('/products')])
        setCustomers(cusRes.data)
        setProducts(prodRes.data)
      }catch(err){
        console.error(err)
      }finally{setLoading(false)}
    }
    load()
  },[])

  useEffect(()=>{
    if(initial){
      setForm({customer_id: initial.customer_id, items: initial.items.map(i=>({product_id:i.product_id, quantity:i.quantity}))})
    }
  },[initial])

  const addItem = ()=>{
    setForm(f=>({...f, items:[...f.items, {product_id:'', quantity:1}]}))
  }
  const removeItem = (idx)=>{
    setForm(f=>({...f, items:f.items.filter((_,i)=>i!==idx)}))
  }
  const updateItem = (idx, key, value)=>{
    setForm(f=>{
      const items = f.items.map((it,i)=> i===idx ? {...it, [key]: value} : it)
      return {...f, items}
    })
  }

  const productMap = useMemo(()=>{
    const m = {}
    products.forEach(p=>{ m[p.id] = p })
    return m
  },[products])

  const total = form.items.reduce((acc,it)=>{
    const p = productMap[it.product_id]
    const price = p ? Number(p.price) : 0
    const qty = Number(it.quantity) || 0
    return acc + price * qty
  },0)

  const validate = ()=>{
    if(!form.customer_id){ setErrors('Select a customer'); return false }
    if(!form.items || form.items.length===0){ setErrors('Add at least one item'); return false }
    for(const it of form.items){
      if(!it.product_id) { setErrors('Select a product for each item'); return false }
      if(!it.quantity || Number(it.quantity) <= 0){ setErrors('Quantity must be > 0 for each item'); return false }
    }
    setErrors('')
    return true
  }

  const submit = async (e)=>{
    e.preventDefault()
    if(!validate()) return
    try{
      // build payload
      const payload = { customer_id: Number(form.customer_id), items: form.items.map(it=>({product_id: Number(it.product_id), quantity: Number(it.quantity)})) }
      await onSubmit(payload)
    }catch(err){
      setErrors(err?.response?.data?.detail || err.message || 'Error')
    }
  }

  return (
    <form onSubmit={submit} className="product-form">
      <div className="form-row">
        <label>Customer</label>
        <select value={form.customer_id} onChange={e=>setForm({...form, customer_id: e.target.value})}>
          <option value="">-- select customer --</option>
          {customers.map(c=> <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
        </select>
      </div>

      <div style={{marginTop:8}}>
        <label>Items</label>
        {form.items.map((it, idx)=> (
          <div key={idx} style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
            <select value={it.product_id} onChange={e=>updateItem(idx,'product_id', e.target.value)} style={{flex:2}}>
              <option value="">-- select product --</option>
              {products.map(p=> <option key={p.id} value={p.id}>{p.name} — ${Number(p.price).toFixed(2)} (stock: {p.quantity})</option>)}
            </select>
            <input type="number" min="1" value={it.quantity} onChange={e=>updateItem(idx,'quantity', e.target.value)} style={{width:100}} />
            <button type="button" className="btn btn-secondary" onClick={()=>removeItem(idx)}>Remove</button>
          </div>
        ))}
        <div style={{marginTop:8}}>
          <button type="button" className="btn btn-primary" onClick={addItem}>Add Item</button>
        </div>
      </div>

      <div style={{marginTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><strong>Total: </strong>${total.toFixed(2)}</div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">Submit Order</button>
        </div>
      </div>

      {errors && <div className="form-error" style={{marginTop:8}}>{errors}</div>}
    </form>
  )
}
