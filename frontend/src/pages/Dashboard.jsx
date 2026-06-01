import React, {useEffect, useState} from 'react'
import api from '../api/axios'

export default function Dashboard(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    Promise.all([api.get('/products'), api.get('/customers'), api.get('/orders')])
      .then(([pRes, cRes, oRes])=>{
        if(!mounted) return
        setProducts(pRes.data || [])
        setCustomers(cRes.data || [])
        setOrders(oRes.data || [])
        setError(null)
      }).catch(err=>{
        if(!mounted) return
        setError(err)
      }).finally(()=>{ if(mounted) setLoading(false) })
    return ()=>{ mounted = false }
  },[])

  const lowStock = products.filter(p=>Number(p.quantity) < 10)

  return (
    <div className="page">
      <h2>Dashboard</h2>

      {loading ? (
        <div className="spinner" aria-hidden></div>
      ) : error ? (
        <div className="text-error">Failed to load dashboard data.</div>
      ) : (
        <div>
          <div className="card-grid">
            <div className="card">
              <div className="card-title">Products</div>
              <div className="card-value">{products.length}</div>
            </div>
            <div className="card">
              <div className="card-title">Customers</div>
              <div className="card-value">{customers.length}</div>
            </div>
            <div className="card">
              <div className="card-title">Orders</div>
              <div className="card-value">{orders.length}</div>
            </div>
            <div className="card">
              <div className="card-title">Low stock (&lt;10)</div>
              <div className="card-value">{lowStock.length}</div>
            </div>
          </div>

          <div style={{marginTop:16}}>
            <h3>Low stock products</h3>
            {lowStock.length === 0 ? (
              <p>No low stock products.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>SKU</th><th>Quantity</th></tr></thead>
                <tbody>
                  {lowStock.map(p=> (
                    <tr key={p.id}><td>{p.name}</td><td>{p.sku}</td><td>{p.quantity}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
