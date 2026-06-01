import React, {useState, useEffect} from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'
import ProductForm from '../components/ProductForm'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'

export default function Products(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAdd, setShowAdd] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const [toast, setToast] = useState({message:'', type:'info'})

  const fetchProducts = async ()=>{
    setLoading(true)
    try{
      const res = await api.get('/products')
      setProducts(res.data)
    }catch(err){
      setError(err)
    }finally{setLoading(false)}
  }

  useEffect(()=>{ fetchProducts() },[])

  const handleAdd = async (payload)=>{
    try{
      const res = await api.post('/products', payload)
      setProducts(prev=>[res.data, ...prev])
      setShowAdd(false)
      setToast({message:'Product created', type:'success'})
    }catch(err){
      const msg = err?.response?.data?.detail || err.message
      setToast({message:`Create failed: ${msg}`, type:'error'})
    }
  }

  const handleUpdate = async (payload)=>{
    try{
      const res = await api.put(`/products/${editProduct.id}`, payload)
      setProducts(prev=>prev.map(p=>p.id===res.data.id?res.data:p))
      setEditProduct(null)
      setToast({message:'Product updated', type:'success'})
    }catch(err){
      const msg = err?.response?.data?.detail || err.message
      setToast({message:`Update failed: ${msg}`, type:'error'})
    }
  }

  const handleDelete = async ()=>{
    try{
      await api.delete(`/products/${deleting.id}`)
      setProducts(prev=>prev.filter(p=>p.id!==deleting.id))
      setDeleting(null)
      setToast({message:'Product deleted', type:'success'})
    }catch(err){
      setToast({message:'Delete failed', type:'error'})
    }
  }

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Products</h2>
        <div>
          <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>Add Product</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-error">Error loading products</p>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr><th>Name</th><th>SKU</th><th>Price</th><th>Quantity</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p=> (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.price.toFixed(2)}</td>
                <td>{p.quantity}</td>
                <td>
                  <button className="btn btn-ghost" onClick={()=>setEditProduct(p)}>Edit</button>
                  <button className="btn btn-danger" onClick={()=>setDeleting(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAdd && (
        <Modal title="Add Product" onClose={()=>setShowAdd(false)}>
          <ProductForm onSubmit={handleAdd} onCancel={()=>setShowAdd(false)} />
        </Modal>
      )}

      {editProduct && (
        <Modal title="Edit Product" onClose={()=>setEditProduct(null)}>
          <ProductForm initial={editProduct} onSubmit={handleUpdate} onCancel={()=>setEditProduct(null)} />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete product" message={`Delete ${deleting.name}?`} onConfirm={handleDelete} onCancel={()=>setDeleting(null)} />
      )}

      <div style={{position:'fixed',right:20,bottom:20}}>
        <Toast message={toast.message} type={toast.type} onClose={()=>setToast({message:'',type:'info'})} />
      </div>
    </div>
  )
}
