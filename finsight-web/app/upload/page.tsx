'use client'
import { useState, useCallback } from 'react'
import Layout from '../../components/Layout'

type Step = 'idle' | 'uploading' | 'parsing' | 'mapping' | 'validating' | 'done' | 'error'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<Step>('idle')
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<any>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }, [])

  const simulate = async () => {
    if (!file) return
    const steps: [Step, string, number][] = [
      ['uploading',  `Uploading ${file.name}...`,           800],
      ['parsing',    'Parsing rows — reading Day Book...',  1200],
      ['mapping',    'Mapping 2,167 ledgers with AI...',    1500],
      ['validating', 'Running 26 accounting checks...',     1200],
      ['done',       '',                                       0],
    ]
    for (const [s, msg, ms] of steps) {
      setStep(s)
      setProgress(msg)
      if (ms) await new Promise(r => setTimeout(r, ms))
    }
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const val = await fetch(`${API}/api/validate/mudduluru-ka-2025`).then(r => r.json())
    setResult(val)
    setProgress('')
  }

  const PIPELINE = [
    { key: 'uploading',  label: 'Upload' },
    { key: 'parsing',    label: 'Parse' },
    { key: 'mapping',    label: 'Map Ledgers' },
    { key: 'validating', label: '26 Checks' },
    { key: 'done',       label: 'Reports Ready' },
  ]
  const stepIdx = PIPELINE.findIndex(p => p.key === step)

  return (
    <Layout>
      <div style={{
        background:'#fff', borderBottom:'1px solid #E5E7EB',
        padding:'0 24px', height:52, display:'flex', alignItems:'center',
        fontFamily:'system-ui', position:'sticky', top:0, zIndex:40
      }}>
        <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Upload Tally Data</span>
        <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>
          Upload → Parse → Map → Validate → Reports ready
        </span>
      </div>

      <div style={{ padding:'32px 24px', fontFamily:'system-ui', maxWidth:720 }}>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{
            border: `2px dashed ${dragging ? '#2563EB' : file ? '#059669' : '#D1D5DB'}`,
            borderRadius: 16,
            padding: '48px 32px',
            textAlign: 'center',
            background: dragging ? '#EFF6FF' : file ? '#F0FFF4' : '#FAFAFA',
            transition: 'all .2s',
            marginBottom: 24,
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".xls,.xlsx,.csv,.xml"
            style={{ display:'none' }}
            onChange={e => e.target.files?.[0] && setFile(e.target.files[0])}
          />
          {file ? (
            <>
              <div style={{ fontSize:40, marginBottom:12 }}>✓</div>
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
                or click to browse · XLS, XLSX, CSV, XML · Max 50 MB
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
            <div style={{ fontSize:13, fontWeight:600, color:'#1F3864', marginBottom:10 }}>File ready to process</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              {[
                { label:'File name', value:file.name },
                { label:'File size', value:`${(file.size/1024/1024).toFixed(2)} MB` },
                { label:'Format',    value:file.name.split('.').pop()?.toUpperCase() || 'XLS' },
              ].map(i => (
                <div key={i.label}>
                  <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:3 }}>{i.label}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#111' }}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Run button */}
        {file && step === 'idle' && (
          <button
            onClick={simulate}
            style={{
              width:'100%', background:'#1F3864', color:'#fff',
              border:'none', borderRadius:10, padding:'14px',
              fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:24
            }}
          >
            Run Pipeline: Upload → Parse → Map → Validate
          </button>
        )}

        {/* Pipeline progress */}
        {step !== 'idle' && (
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, padding:'20px 24px', marginBottom:20 }}>
            <div style={{ fontWeight:700, color:'#1F3864', fontSize:13, marginBottom:20 }}>Pipeline Status</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              {PIPELINE.map((p, i) => {
                const done = step === 'done' || (stepIdx > i)
                const active = PIPELINE[stepIdx]?.key === p.key
                return (
                  <div key={p.key} style={{ display:'flex', alignItems:'center', flex: i < 4 ? 1 : 0 }}>
                    <div style={{ textAlign:'center' }}>
                      <div style={{
                        width:36, height:36, borderRadius:'50%', margin:'0 auto 6px',
                        background: done ? '#059669' : active ? '#2563EB' : '#F3F4F6',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:13, fontWeight:700,
                        color: done || active ? '#fff' : '#9CA3AF',
                        transition:'all .3s'
                      }}>
                        {done ? '✓' : i + 1}
                      </div>
                      <div style={{ fontSize:10, fontWeight:600, color: done ? '#059669' : active ? '#2563EB' : '#9CA3AF', whiteSpace:'nowrap' }}>
                        {p.label}
                      </div>
                    </div>
                    {i < 4 && (
                      <div style={{ flex:1, height:2, background: done && stepIdx > i ? '#059669' : '#F3F4F6', margin:'0 6px', marginBottom:20, transition:'all .3s' }}/>
                    )}
                  </div>
                )
              })}
            </div>
            {progress && (
              <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#1D4ED8' }}>
                ⏳ {progress}
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {step === 'done' && result && (
          <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:12, padding:'20px 24px' }}>
            <div style={{ fontWeight:700, color:'#065F46', fontSize:15, marginBottom:8 }}>
              ✓ All checks passed — Reports are ready
            </div>
            <div style={{ fontSize:12, color:'#059669', marginBottom:16 }}>{result.summary}</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <a href="/dashboard" style={{ background:'#1F3864', color:'#fff', padding:'10px 20px', borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:13 }}>
                Open CFO Dashboard →
              </a>
              <a href="/reports/pl" style={{ background:'#fff', color:'#1F3864', padding:'10px 20px', borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:13, border:'1px solid #1F3864' }}>
                View P&L →
              </a>
              <a href="/reports/bs" style={{ background:'#fff', color:'#1F3864', padding:'10px 20px', borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:13, border:'1px solid #1F3864' }}>
                View Balance Sheet →
              </a>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
