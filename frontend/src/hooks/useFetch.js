import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function useFetch(url){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    api.get(url).then(res=>{
      if(mounted){ setData(res.data) }
    }).catch(err=>{
      if(mounted) setError(err)
    }).finally(()=>{ if(mounted) setLoading(false) })
    return ()=>{ mounted = false }
  },[url])

  return { data, loading, error }
}
