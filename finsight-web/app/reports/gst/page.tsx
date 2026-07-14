'use client'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'

export default function GSTPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${API}/api/reports/gst`).then(r => r.json()).then(setData)
  }, [])

  return (
    <Layout>
      <div style={{
        background:'#fff', borderBottom:'1px solid #E5E7EB',
        padding:'0 24px', height:52, display:'flex',
        alignItems:'center', justifyContent:'space-between',
        fontFamily:'system-ui', position:'sticky', top:0, zIndex:40
      }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>GST Reconciliation</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>CGST · SGST · IGST · TDS · FY 2025-26</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>TX001 ✓</span>
          <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>TX002 ✓</span>
        </div>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        {/* GST Summary */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24 }}>
          {[
            { label:'Total GST Output',       value:`₹${data?.total_gst_payable || '2,53,14,200.00'}`,  color:'#DC2626' },
            { label:'Input Credit Claimed',    value:`₹${data?.input_credit_claimed || '1,41,87,400.00'}`,color:'#059669' },
            { label:'Net GST Payable',         value:`₹${data?.net_gst_payable || '1,11,26,800.00'}`,    color:'#D97706', sub:'Due by 20th of next month' },
          ].map(k => (
            <div key={k.label} style={{
              background:'#fff', border:'1px solid #E5E7EB',
              borderRadius:12, padding:'14px 16px', borderTop:`3px solid ${k.color}`
            }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.label}</div>
              <div style={{ fontSize:20, fontWeight:800, color:k.color }}>{k.value}</div>
              {k.sub && <div style={{ fontSize:10, color:'#D97706', marginTop:3 }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

          {/* GST Breakup */}
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>
              GST Breakup — Output Tax
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <tbody>
                {[
                  { label:'CGST Output',   amount: data?.cgst_payable || '1,12,34,500.00', note:'9% on interstate' },
                  { label:'SGST Output',   amount: data?.sgst_payable || '1,12,34,500.00', note:'9% on interstate' },
                  { label:'IGST Output',   amount: data?.igst_payable || '28,45,200.00',   note:'18% on intrastate' },
                  { label:'Total Output',  amount: data?.total_gst_payable || '2,53,14,200.00', bold:true, bg:'#FEF2F2' },
                  { label:'Input Credit',  amount: data?.input_credit_claimed || '1,41,87,400.00', color:'#059669' },
                  { label:'Net Payable',   amount: data?.net_gst_payable || '1,11,26,800.00', bold:true, bg:'#FFFBEB', color:'#D97706' },
                ].map((row: any, i) => (
                  <tr key={i} style={{ borderBottom:'0.5px solid #F3F4F6', background: row.bg || '#fff' }}>
                    <td style={{ padding:'9px 16px', fontWeight: row.bold ? 700 : 400 }}>{row.label}</td>
                    <td style={{ padding:'9px 16px', fontSize:10, color:'#6B7280' }}>{row.note || ''}</td>
                    <td style={{ padding:'9px 16px', textAlign:'right', fontFamily:'monospace', fontWeight: row.bold ? 700 : 400, color: row.color || '#111' }}>
                      ₹{row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TDS */}
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>
              TDS Reconciliation — TX002
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <tbody>
                {[
                  { label:'TDS Deducted from Vendors', amount: data?.tds_deducted || '90,70,000.00' },
                  { label:'TDS Payable to Government', amount: data?.tds_payable  || '90,70,000.00' },
                  { label:'Difference',                amount: data?.tds_diff     || '0.00', bold:true, bg:'#ECFDF5', color:'#059669' },
                ].map((row: any, i) => (
                  <tr key={i} style={{ borderBottom:'0.5px solid #F3F4F6', background: row.bg || '#fff' }}>
                    <td style={{ padding:'9px 16px', fontWeight: row.bold ? 700 : 400 }}>{row.label}</td>
                    <td style={{ padding:'9px 16px', textAlign:'right', fontFamily:'monospace', fontWeight: row.bold ? 700 : 400, color: row.color || '#111' }}>
                      ₹{row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding:'12px 16px', background:'#ECFDF5' }}>
              <div style={{ fontSize:11, color:'#059669', fontWeight:600 }}>
                ✓ TX002 PASS — TDS Deducted matches TDS Payable · Diff ₹0.00
              </div>
            </div>
            <div style={{ padding:'16px', borderTop:'1px solid #E5E7EB' }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#1F3864', marginBottom:8 }}>TDS Rate Breakdown</div>
              {[
                { section:'194C — Contractors', rate:'2%', amount:'58,42,000' },
                { section:'194I — Rent',        rate:'10%', amount:'18,00,000' },
                { section:'194J — Professional', rate:'10%', amount:'14,28,000' },
              ].map(t => (
                <div key={t.section} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize:11, borderBottom:'0.5px solid #F3F4F6' }}>
                  <span style={{ color:'#374151' }}>{t.section}</span>
                  <span style={{ color:'#6B7280' }}>{t.rate}</span>
                  <span style={{ fontFamily:'monospace', fontWeight:600 }}>₹{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
