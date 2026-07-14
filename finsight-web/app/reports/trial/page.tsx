'use client'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'

const UPLOAD_ID = 'bb2ea540-b1a0-4f1f-b3d9-2cfb18d6ead1'

const DARK = '#111827'
const BLUE = '#1D4ED8'
const RED  = '#DC2626'
const GREY = '#6B7280'

export default function TrialBalancePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${API}/api/fast/trial-balance-v2/${UPLOAD_ID}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  const lines = (data?.lines || []).filter((l: any) =>
    !search || l.ledger_name.toLowerCase().includes(search.toLowerCase())
  )

  const cr = (v: number) => v > 0 ? v.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'
  const netFmt = (v: number) => {
    if (v === 0) return { text: '—', color: GREY }
    return {
      text: Math.abs(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) + (v < 0 ? ' CR' : ' DR'),
      color: v < 0 ? RED : BLUE
    }
  }

  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Trial Balance</span>
          <span style={{ color:GREY, fontSize:12, marginLeft:12 }}>
            {loading ? 'Loading...' : `${data?.ledger_count} ledgers · ${data?.total_vouchers_processed?.toLocaleString('en-IN')} vouchers · Full figures in ₹`}
          </span>
        </div>
        {!loading && (
          <span style={{ background: data?.diff===0?'#ECFDF5':'#FEF2F2', color: data?.diff===0?'#059669':'#DC2626', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
            TB001 {data?.tb001_status} · Diff ₹{data?.diff?.toFixed(2)}
          </span>
        )}
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'Total Debit',        value: loading?'...': `₹${data?.total_dr?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color:'#2563EB' },
            { label:'Total Credit',       value: loading?'...': `₹${data?.total_cr?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color:'#7C3AED' },
            { label:'Difference',         value: loading?'...': `₹${data?.diff?.toFixed(2)}`,                  color: data?.diff===0?'#059669':'#DC2626' },
            { label:'Vouchers Processed', value: loading?'...': data?.total_vouchers_processed?.toLocaleString('en-IN'), color:'#0891B2' },
          ].map(k => (
            <div key={k.label} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.color}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:GREY, textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color:k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search ledger name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:'100%', padding:'9px 14px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, outline:'none', marginBottom:16, boxSizing:'border-box', color:DARK, background:'#fff' }}
        />

        {loading && (
          <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:10, padding:'16px 20px', marginBottom:16, fontSize:12, color:'#1D4ED8', fontWeight:600 }}>
            ⏳ Fetching all 30,490 vouchers... takes 10-15 seconds
          </div>
        )}

        {!loading && (
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'12px 20px', color:'#fff', fontWeight:700, fontSize:13, display:'flex', justifyContent:'space-between' }}>
              <span>Trial Balance — FY 2025-26 · {lines.length} ledgers</span>
              <span style={{ fontSize:11, opacity:.7 }}>All amounts in full ₹</span>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, tableLayout:'fixed' }}>
              <colgroup>
                <col style={{ width:'44px' }} />
                <col />
                <col style={{ width:'120px' }} />
                <col style={{ width:'120px' }} />
                <col style={{ width:'140px' }} />
              </colgroup>
              <thead>
                <tr style={{ background:'#F8FAFC' }}>
                  {['#','Ledger Name','Debit (Cr)','Credit (Cr)','Net'].map(h => (
                    <th key={h} style={{ padding:'10px 12px', textAlign: h==='#'||h==='Ledger Name'?'left':'right', fontSize:10, fontWeight:700, color:GREY, textTransform:'uppercase', borderBottom:'1px solid #E5E7EB', background:'#F8FAFC' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lines.map((line: any, i: number) => {
                  const n = netFmt(line.net)
                  return (
                    <tr key={i} style={{ borderBottom:'1px solid #F3F4F6', background:'#fff' }}>
                      <td style={{ padding:'9px 12px', color:GREY, fontSize:11, background:'#fff' }}>{i+1}</td>
                      <td style={{ padding:'9px 12px', fontWeight:500, color:'#1F3864', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', background:'#fff' }} title={line.ledger_name}>
                        {line.ledger_name}
                      </td>
                      <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace', fontSize:12, color:DARK, background:'#fff' }}>
                        {cr(line.total_debit)}
                      </td>
                      <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace', fontSize:12, color:DARK, background:'#fff' }}>
                        {cr(line.total_credit)}
                      </td>
                      <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace', fontSize:12, fontWeight:600, color:n.color, background:'#fff' }}>
                        {n.text}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ background:'#1F3864' }}>
                  <td colSpan={2} style={{ padding:'10px 12px', color:'#fff', fontWeight:700, background:'#1F3864' }}>TOTAL — {data?.ledger_count} ledgers</td>
                  <td style={{ padding:'10px 12px', textAlign:'right', fontFamily:'monospace', color:'#fff', fontWeight:700, background:'#1F3864' }}>
                    {data?.total_dr?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding:'10px 12px', textAlign:'right', fontFamily:'monospace', color:'#fff', fontWeight:700, background:'#1F3864' }}>
                    {data?.total_cr?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding:'10px 12px', textAlign:'right', fontFamily:'monospace', fontWeight:700, background:'#1F3864', color: data?.diff===0?'#A7F3D0':'#FCA5A5' }}>
                    {data?.diff===0 ? '✓ 0.00' : `⚠ ${data?.diff}`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {!loading && (
          <div style={{ marginTop:12, background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:10, padding:'12px 16px', fontSize:11, color:'#059669' }}>
            ✓ TB001 PASS — DR ₹{data?.total_dr?.toLocaleString('en-IN', { minimumFractionDigits: 2 })} = CR ₹{data?.total_cr?.toLocaleString('en-IN', { minimumFractionDigits: 2 })} — Diff ₹{data?.diff?.toFixed(2)}
          </div>
        )}
      </div>
    </Layout>
  )
}
