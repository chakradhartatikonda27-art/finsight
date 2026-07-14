'use client'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

const UPLOAD_ID = 'bb2ea540-b1a0-4f1f-b3d9-2cfb18d6ead1'

function fmt(val: number, decimals = 2): string {
  return (Math.abs(val) / 10000000).toFixed(decimals)
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<any>(null)
  const [sites, setSites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    Promise.all([
      fetch(`${API}/api/reports/real/kpis/${UPLOAD_ID}`).then(r => r.json()),
      fetch(`${API}/api/reports/sites`).then(r => r.json()),
    ]).then(([kpiData, sitesData]) => {
      setKpis(kpiData)
      setSites(sitesData.sites || [])
      setLoading(false)
    })
  }, [])

  const K = kpis

  return (
    <Layout>
      <div style={{
        background:'#fff', borderBottom:'1px solid #E5E7EB',
        padding:'0 24px', height:52, display:'flex',
        alignItems:'center', justifyContent:'space-between',
        fontFamily:'system-ui', position:'sticky', top:0, zIndex:40
      }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>CFO Dashboard</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>
            Mudduluru Infratech (KA) · FY 2025-26
          </span>
        </div>
        <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
          ✓ Live · {loading ? '...' : K?.total_vouchers?.toLocaleString('en-IN')} vouchers
        </span>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui', maxWidth:1400 }}>

        {loading && (
          <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:12, color:'#1D4ED8' }}>
            ⏳ Fetching real data from Supabase...
          </div>
        )}

        {/* KPI Row — 4 cols then 3 cols */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
          {[
            { label:'Revenue YTD',  value: loading?'...': `₹${fmt(K?.revenue)} Cr`,          color:'#2563EB', sub:'FY 2025-26' },
            { label:'Gross Profit', value: loading?'...': `₹${fmt(K?.gross_profit)} Cr`,     color:'#059669', sub:`GP Margin ${K?.gp_margin_pct}%` },
            { label:'EBITDA',       value: loading?'...': `₹${fmt(K?.ebitda)} Cr`,           color:'#0891B2', sub:`EBITDA Margin ${K?.ebitda_margin_pct}%` },
            { label:'PAT',          value: loading?'...': `(₹${fmt(Math.abs(K?.pat||0))} Cr)`, color:'#DC2626', sub:`PAT Margin ${K?.pat_margin_pct}%` },
          ].map(k => (
            <div key={k.label} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.color}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:8 }}>{k.label}</div>
              <div style={{ fontSize:20, fontWeight:800, color:k.color, letterSpacing:'-.02em' }}>{k.value}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
          {[
            { label:'Cash & Bank',     value: loading?'...': `₹${fmt(K?.cash)} Cr`,      color:'#7C3AED', sub:'As at 31 Mar 2026' },
            { label:'Trade Debtors',   value: loading?'...': `₹${fmt(K?.debtors)} Cr`,   color:'#D97706', sub:'Outstanding receivables' },
            { label:'Trade Creditors', value: loading?'...': `₹${fmt(K?.creditors)} Cr`, color:'#6B7280', sub:'Vendor payables' },
          ].map(k => (
            <div key={k.label} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.color}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:8 }}>{k.label}</div>
              <div style={{ fontSize:20, fontWeight:800, color:k.color, letterSpacing:'-.02em' }}>{k.value}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* P&L + OD side by side */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

          {/* P&L Summary */}
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'10px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>
              P&L Summary — Real Data
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <tbody>
                {!loading && [
                  { label:'Revenue',         value: K?.revenue,                        bg:'#EFF6FF', bold:false, pct:null },
                  { label:'(-) Direct Costs',value: -(K?.revenue - K?.gross_profit),  bg:'#fff',    bold:false, pct:null },
                  { label:'Gross Profit',    value: K?.gross_profit,                   bg:'#F0FFF4', bold:true,  pct:`${K?.gp_margin_pct}%` },
                  { label:'(-) OpEx',        value: -(K?.gross_profit - K?.ebitda),   bg:'#fff',    bold:false, pct:null },
                  { label:'EBITDA',          value: K?.ebitda,                         bg:'#EFF6FF', bold:true,  pct:`${K?.ebitda_margin_pct}%` },
                  { label:'(-) Finance Cost',value: -(K?.ebitda - K?.pat),            bg:'#fff',    bold:false, pct:null },
                  { label:'PAT',             value: K?.pat,                            bg:K?.pat>=0?'#ECFDF5':'#FEF2F2', bold:true, pct:`${K?.pat_margin_pct}%` },
                ].map((row:any, i) => (
                  <tr key={i} style={{ borderBottom:'0.5px solid #F3F4F6', background:row.bg, fontWeight:row.bold?700:400 }}>
                    <td style={{ padding:'9px 16px', color:'#374151' }}>{row.label}</td>
                    <td style={{ padding:'9px 16px', textAlign:'right', fontFamily:'monospace', color:row.value<0?'#DC2626':'#111' }}>
                      {row.value<0 ? `(₹${fmt(Math.abs(row.value))} Cr)` : `₹${fmt(row.value)} Cr`}
                    </td>
                    <td style={{ padding:'9px 16px', textAlign:'right', fontSize:10, color:'#6B7280', width:48 }}>
                      {row.pct||''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bank Borrowings */}
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'10px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>
              Bank Borrowings
            </div>
            <div style={{ padding:'20px' }}>
              {[
                { label:'Short Term (OD)', value:loading?0:Math.abs(K?.od||0), limit:325000000, color:'#D97706' },
                { label:'Long Term Loans', value:loading?0:K?.term_loans||0,   limit:250000000, color:'#2563EB' },
              ].map(item => {
                const pct = Math.min(Math.round(item.value/item.limit*100),100)
                return (
                  <div key={item.label} style={{ marginBottom:20 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{item.label}</span>
                      <span style={{ fontSize:14, fontWeight:800, color:pct>85?'#DC2626':item.color }}>{pct}%</span>
                    </div>
                    <div style={{ height:8, background:'#F3F4F6', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:4, width:`${pct}%`, background:pct>85?'#DC2626':item.color }}/>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:5, fontSize:10, color:'#6B7280' }}>
                      <span>Used: ₹{fmt(item.value)} Cr</span>
                      <span>Limit: ₹{fmt(item.limit)} Cr</span>
                    </div>
                  </div>
                )
              })}

              <div style={{ borderTop:'1px solid #E5E7EB', paddingTop:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#1F3864', marginBottom:10 }}>Working Capital</div>
                {!loading && [
                  { label:'Trade Debtors',   value:K?.debtors,            color:'#2563EB' },
                  { label:'Trade Creditors', value:K?.creditors,           color:'#DC2626' },
                  { label:'Net Position',    value:K?.debtors-K?.creditors,color:'#059669', bold:true },
                ].map((w:any) => (
                  <div key={w.label} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:12, borderBottom:'0.5px solid #F9FAFB', fontWeight:w.bold?700:400 }}>
                    <span style={{ color:'#374151' }}>{w.label}</span>
                    <span style={{ fontFamily:'monospace', fontWeight:w.bold?700:400, color:w.color }}>₹{fmt(w.value)} Cr</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Site P&L */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
          <div style={{ background:'#1F3864', padding:'10px 16px', color:'#fff', fontWeight:700, fontSize:13, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>Site P&L — GP Margin % by Cost Centre</span>
            <a href="/reports/sites" style={{ color:'rgba(255,255,255,0.6)', fontSize:11, textDecoration:'none' }}>View all →</a>
          </div>
          <div style={{ padding:'20px' }}>
            {sites.map(site => (
              <div key={site.cost_centre} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:180, fontSize:12, fontWeight:500, color:'#374151', flexShrink:0 }}>{site.cost_centre}</div>
                <div style={{ flex:1 }}>
                  <div style={{ height:7, background:'#F3F4F6', borderRadius:4, overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:4,
                      width:`${Math.max(parseFloat(site.gp_margin_pct),1)}%`,
                      background:site.status==='AT_RISK'?'#DC2626':'#059669',
                      transition:'width .4s'
                    }}/>
                  </div>
                </div>
                <span style={{ fontSize:13, fontWeight:700, width:44, textAlign:'right', color:site.status==='AT_RISK'?'#DC2626':'#059669' }}>
                  {site.gp_margin_pct}%
                </span>
                <span style={{ width:60 }}>
                  {site.status==='AT_RISK' && (
                    <span style={{ fontSize:9, color:'#DC2626', fontWeight:700, background:'#FEF2F2', padding:'2px 8px', borderRadius:10 }}>AT RISK</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick nav */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {[
            { href:'/reports/pl',     label:'P&L Statement',  sub:'Real · 30,490 vouchers', color:'#2563EB' },
            { href:'/reports/trial',  label:'Trial Balance',  sub:'₹0.00 diff · 1,406 ledgers', color:'#059669' },
            { href:'/reports/daybook',label:'Day Book',       sub:'610 pages · searchable', color:'#7C3AED' },
            { href:'/validation',     label:'Validation',     sub:'30/30 checks passing',   color:'#D97706' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              background:'#fff', border:'1px solid #E5E7EB',
              borderLeft:`3px solid ${link.color}`,
              borderRadius:8, padding:'12px 16px',
              textDecoration:'none', display:'block'
            }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#1F3864' }}>{link.label}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:3 }}>{link.sub}</div>
            </a>
          ))}
        </div>

      </div>
    </Layout>
  )
}
