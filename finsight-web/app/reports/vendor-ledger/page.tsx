'use client'
import { useState } from 'react'
import Layout from '../../../components/Layout'

const VENDORS = [
  { name:'Aishwarya M Sand',          code:'KA-2351008', total:'1,95,42,000', d0:'—',         d30:'42,18,000',  d60:'1,52,24,000', high:true },
  { name:'Mahaveer Distributors',     code:'KA-2351183', total:'1,62,84,000', d0:'18,42,000', d30:'1,04,18,000',d60:'38,94,000',   high:true },
  { name:'JAI BALAJI CERAMICS',       code:'KA-2351477', total:'60,36,000',   d0:'42,18,000', d30:'18,18,000',  d60:'—',           high:false },
  { name:'Aforce Guarding Services',  code:'KA-2351006', total:'42,84,000',   d0:'14,28,000', d30:'14,28,000',  d60:'14,28,000',   high:false },
  { name:'SVP Enterprises',           code:'KA-2351483', total:'38,42,000',   d0:'38,42,000', d30:'—',          d60:'—',           high:false },
  { name:'AF Industrial Stores',      code:'KA-2351542', total:'34,18,000',   d0:'—',         d30:'18,42,000',  d60:'15,76,000',   high:false },
  { name:'Orange Scaffoldings',       code:'KA-2351444', total:'24,84,000',   d0:'24,84,000', d30:'—',          d60:'—',           high:false },
  { name:'Dheera Constructions',      code:'KA-2351284', total:'16,84,000',   d0:'—',         d30:'16,84,000',  d60:'—',           high:false },
]

export default function VendorLedgerPage() {
  const [search, setSearch] = useState('')
  const filtered = VENDORS.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Vendor Ledger</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>794 vendors · ₹36.70 Cr outstanding · Aging 0-30 · 31-60 · 60+ days</span>
        </div>
        <span style={{ background:'#FEF2F2', color:'#DC2626', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>60+ days: ₹19.12 Cr</span>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          {[
            { l:'Total Payable', v:'₹36.70 Cr', c:'#DC2626' },
            { l:'60+ Days Overdue', v:'₹19.12 Cr', c:'#D97706', s:'52.1% of total' },
            { l:'Active Vendors', v:'794', c:'#2563EB' },
          ].map(k => (
            <div key={k.l} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.c}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.l}</div>
              <div style={{ fontSize:22, fontWeight:800, color:k.c }}>{k.v}</div>
              {(k as any).s && <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{(k as any).s}</div>}
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>Vendor Payables & Aging</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vendor..." style={{ padding:'5px 12px', border:'none', borderRadius:7, fontSize:12, outline:'none', width:200 }}/>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Vendor Name','Total Due (₹)','0–30 Days','31–60 Days','60+ Days'].map(h => (
                  <th key={h} style={{ padding:'10px 16px', textAlign: h==='Vendor Name'?'left':'right', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.code} style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px' }}>
                    <div style={{ fontWeight:700, color:v.high?'#DC2626':'#111827' }}>{v.name}</div>
                    <div style={{ fontSize:10, color:'#6B7280', fontFamily:'monospace', marginTop:2 }}>{v.code}</div>
                  </td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', fontWeight:700, color:v.high?'#DC2626':'#374151' }}>{v.total}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace' }}>{v.d0}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace' }}>{v.d30}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', color:v.d60!=='—'?'#DC2626':'#6B7280', fontWeight:v.d60!=='—'?700:400 }}>{v.d60}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
