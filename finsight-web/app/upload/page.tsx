'use client'
import { useState, useCallback } from 'react'
import Layout from '../../components/Layout'

type Step = 'idle' | 'uploading' | 'done' | 'error'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<Step>('idle')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }, [])

  const runUpload = async () => {
    if (!file) return
    setStep('uploading')
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setStep('error')
      } else {
        setResult(data)
        setStep('done')
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setStep('error')
    }
  }

  return (
    <Layout>
      <div style={{
        background:'#fff', borderBottom:'1px solid #E5E7EB',
        padding:'0 24px', height:52, display:'flex', alignItems:'center',
        fontFamily:'system-ui', position:'sticky', top:0, zIndex:40
      }}>
        <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Upload Tally Data</span>
        <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>
          Upload XLS → Parse → Save to Supabase → Reports ready
        </span>
      </div>

      <div style={{ padding:'32px 24px', fontFamily:'system-ui', maxWidth:680 }}>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => document.getElementById('file-input')?.click()}
          style={{
            border: `2px dashed ${dragging ? '#2563EB' : file ? '#059669' : '#D1D5DB'}`,
            borderRadius: 16, padding: '48px 32px', textAlign: 'center',
            background: dragging ? '#EFF6FF' : file ? '#F0FFF4' : '#FAFAFA',
            transition: 'all .2s', marginBottom: 24, cursor: 'pointer',
          }}
        >
          <input
            id="file-input" type="file" accept=".xls,.xlsx,.csv"
            style={{ display:'none' }}
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) { setFile(f); setStep('idle'); setResult(null); setError('') }
            }}
          />
          {file ? (
            <>
              <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#059669', marginBottom:4 }}>{file.name}</div>
              <div style={{ fontSize:12, color:'#6B7280' }}>{(file.size/1024/1024).toFixed(2)} MB · Click to change</div>
            </>
          ) : (
            <>
              <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
              <div style={{ fontSize:16, fontWeight:600, color:'#374151', marginBottom:8 }}>
                Drop your Tally Day Book here
              </div>
              <div style={{ fontSize:12, color:'#6B7280', marginBottom:16 }}>
                XLS · XLSX · CSV · Max 50 MB
              </div>
              <div style={{ display:'inline-block', background:'#1F3864', color:'#fff', padding:'8px 20px', borderRadius:8, fontSize:13, fontWeight:600 }}>
                Browse File
              </div>
            </>
          )}
        </div>

        {/* File info */}
        {file && step === 'idle' && (
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, padding:'16px 20px', marginBottom:20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              {[
                { label:'File name', value: file.name },
                { label:'Size',      value: `${(file.size/1024/1024).toFixed(2)} MB` },
                { label:'Format',    value: file.name.split('.').pop()?.toUpperCase() || 'XLS' },
              ].map(i => (
                <div key={i.label}>
                  <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:3 }}>{i.label}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#111' }}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload button */}
        {file && step === 'idle' && (
          <button onClick={runUpload} style={{
            width:'100%', background:'#1F3864', color:'#fff',
            border:'none', borderRadius:10, padding:'14px',
            fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:24
          }}>
            Upload & Parse → Save to Supabase
          </button>
        )}

        {/* Uploading state */}
        {step === 'uploading' && (
          <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:'24px', textAlign:'center', marginBottom:16 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
            <div style={{ fontSize:14, fontWeight:700, color:'#1D4ED8', marginBottom:8 }}>
              Uploading and parsing {file?.name}...
            </div>
            <div style={{ fontSize:12, color:'#6B7280' }}>
              This may take 30-60 seconds for large files (2-3 MB)<br/>
              Parsing {file?.name} → extracting vouchers → saving to Supabase
            </div>
            <div style={{ marginTop:16, height:4, background:'#BFDBFE', borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', width:'60%', background:'#2563EB', borderRadius:2, animation:'none' }}/>
            </div>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
            <div style={{ fontWeight:700, color:'#DC2626', marginBottom:4 }}>Upload failed</div>
            <div style={{ fontSize:12, color:'#DC2626' }}>{error}</div>
            <button onClick={() => { setStep('idle'); setError('') }} style={{
              marginTop:10, background:'#DC2626', color:'#fff', border:'none',
              borderRadius:7, padding:'6px 16px', fontSize:12, fontWeight:600, cursor:'pointer'
            }}>Try again</button>
          </div>
        )}

        {/* Success */}
        {step === 'done' && result && (
          <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:12, padding:'20px 24px' }}>
            <div style={{ fontWeight:700, color:'#065F46', fontSize:15, marginBottom:12 }}>
              ✓ {result.message}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:16 }}>
              {[
                { label:'Total Rows',        value: result.total_rows?.toLocaleString('en-IN') },
                { label:'Vouchers Parsed',   value: result.voucher_count?.toLocaleString('en-IN') },
                { label:'Ledgers Found',     value: result.ledger_count?.toLocaleString('en-IN') },
                { label:'Saved to Supabase', value: result.vouchers_inserted?.toLocaleString('en-IN') },
              ].map(k => (
                <div key={k.label} style={{ background:'#fff', borderRadius:8, padding:'10px 12px', textAlign:'center' }}>
                  <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>{k.label}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:'#059669' }}>{k.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, color:'#059669', marginBottom:16 }}>
              Upload ID: <code style={{ background:'#fff', padding:'1px 6px', borderRadius:4, color:'#111' }}>{result.upload_id}</code>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <a href="/dashboard" style={{ background:'#1F3864', color:'#fff', padding:'10px 20px', borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:13 }}>
                Open CFO Dashboard →
              </a>
              <a href="/reports/pl" style={{ background:'#fff', color:'#1F3864', padding:'10px 20px', borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:13, border:'1px solid #1F3864' }}>
                View P&L →
              </a>
              <button
                onClick={() => { setFile(null); setStep('idle'); setResult(null) }}
                style={{ background:'#fff', color:'#6B7280', padding:'10px 20px', borderRadius:8, border:'1px solid #E5E7EB', fontWeight:600, fontSize:13, cursor:'pointer' }}
              >
                Upload Another File
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
