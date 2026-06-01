import React, {useState, useEffect} from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'
import OrderForm from '../components/OrderForm'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showCreate, setShowCreate] = useState(false)
  const [viewOrder, setViewOrder] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  const [toast, setToast] = useState({message:'', type:'info'})

  const fetchOrders = async ()=>{
    setLoading(true)
    try{
      const res = await api.get('/orders')
      setOrders(res.data)
    }catch(err){
      setError(err)
    }finally{setLoading(false)}
  }

  useEffect(()=>{ fetchOrders() },[])

  const handleCreate = async (payload)=>{
    try{
      const res = await api.post('/orders', payload)
      setOrders(prev=>[res.data, ...prev])
      setShowCreate(false)
      setToast({message:'Order created', type:'success'})
    }catch(err){
      const detail = err?.response?.data?.detail || err.message
      setToast({message:`Create order failed: ${detail}`, type:'error'})
    }
  }

  const handleCancel = async ()=>{
    try{
      await api.delete(`/orders/${cancelling.id}`)
      setOrders(prev=>prev.filter(o=>o.id!==cancelling.id))
      setCancelling(null)
      setToast({message:'Order cancelled', type:'success'})
    }catch(err){
      const detail = err?.response?.data?.detail || err.message
      setToast({message:`Cancel failed: ${detail}`, type:'error'})
    }
  }

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Orders</h2>
        <div>
          <button className="btn btn-primary" onClick={()=>setShowCreate(true)}>Create Order</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-error">Error loading orders</p>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(o=> (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer?.full_name || o.customer_id}</td>
                <td>${Number(o.total_amount).toFixed(2)}</td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn btn-ghost" onClick={()=>setViewOrder(o)}>View</button>
                  <button className="btn btn-danger" onClick={()=>setCancelling(o)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreate && (
        <Modal title="Create Order" onClose={()=>setShowCreate(false)}>
          <OrderForm onSubmit={handleCreate} onCancel={()=>setShowCreate(false)} />
        </Modal>
      )}

      {viewOrder && (
        <Modal title={`Order ${viewOrder.id}`} onClose={()=>setViewOrder(null)}>
          <div>
            <p><strong>Customer:</strong> {viewOrder.customer?.full_name || viewOrder.customer_id}</p>
            <p><strong>Total:</strong> ${Number(viewOrder.total_amount).toFixed(2)}</p>
            <h4>Items</h4>
            <table className="table">
              <thead><tr><th>Product</th><th>Qty</th><th>Unit</th><th>Subtotal</th></tr></thead>
              <tbody>
                {viewOrder.items.map(it=> (
                  <tr key={it.id}>
                    <td>{it.product_name || it.product_id}</td>
                    <td>{it.quantity}</td>
                    <td>${Number(it.unit_price).toFixed(2)}</td>
                    <td>${(Number(it.unit_price)*Number(it.quantity)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {cancelling && (
        <ConfirmDialog title="Cancel order" message={`Cancel order ${cancelling.id}?`} onConfirm={handleCancel} onCancel={()=>setCancelling(null)} />
      )}

      <div style={{position:'fixed',right:20,bottom:20}}>
        <Toast message={toast.message} type={toast.type} onClose={()=>setToast({message:'',type:'info'})} />
      </div>
    </div>
  )
}
