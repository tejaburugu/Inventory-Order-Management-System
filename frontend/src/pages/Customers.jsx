import React, {useState, useEffect} from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'
import CustomerForm from '../components/CustomerForm'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'

export default function Customers(){
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAdd, setShowAdd] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const [toast, setToast] = useState({message:'', type:'info'})

  const fetchCustomers = async ()=>{
    setLoading(true)
    try{
      const res = await api.get('/customers')
      setCustomers(res.data)
    }catch(err){
      setError(err)
    }finally{setLoading(false)}
  }

  useEffect(()=>{ fetchCustomers() },[])

  const handleAdd = async (payload)=>{
    try{
      const res = await api.post('/customers', payload)
      setCustomers(prev=>[res.data, ...prev])
      setShowAdd(false)
      setToast({message:'Customer created', type:'success'})
    }catch(err){
      const status = err?.response?.status
      const detail = err?.response?.data?.detail || err.message
      if(status === 409){
        setToast({message:'Email already exists', type:'error'})
      }else{
        setToast({message:`Create failed: ${detail}`, type:'error'})
      }
    }
  }

  const handleDelete = async ()=>{
    try{
      await api.delete(`/customers/${deleting.id}`)
      setCustomers(prev=>prev.filter(c=>c.id!==deleting.id))
      setDeleting(null)
      setToast({message:'Customer deleted', type:'success'})
    }catch(err){
      setToast({message:'Delete failed', type:'error'})
    }
  }

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Customers</h2>
        <div>
          <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>Add Customer</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-error">Error loading customers</p>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr><th>Full name</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {customers.map(c=> (
              <tr key={c.id}>
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <button className="btn btn-ghost" onClick={()=>setDeleting(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAdd && (
        <Modal title="Add Customer" onClose={()=>setShowAdd(false)}>
          <CustomerForm onSubmit={handleAdd} onCancel={()=>setShowAdd(false)} />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete customer" message={`Delete ${deleting.full_name}?`} onConfirm={handleDelete} onCancel={()=>setDeleting(null)} />
      )}

      <div style={{position:'fixed',right:20,bottom:20}}>
        <Toast message={toast.message} type={toast.type} onClose={()=>setToast({message:'',type:'info'})} />
      </div>
    </div>
  )
}
