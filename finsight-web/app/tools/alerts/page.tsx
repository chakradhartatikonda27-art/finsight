'use client'
import { useState } from 'react'
import Layout from '../../../components/Layout'

const LOG = [
  { date:'15 Jul 2026', time:'08:00 AM', recipient:'MD', status:'Delivered', preview:'Revenue ₹56.87 Cr · GP 20.3% · OD 79.2% · NIT-15 AT RISK · GST Due 12 days' },
  { date:'14 Jul 2026', time:'08:00 AM', recipient:'MD', status:'Delivered', preview:'Revenue ₹55.42 Cr · GP 19.8% · OD 81.4% · NIT-15 AT RISK' },
  { date:'13 Jul 2026', time:'08:00 AM', recipient:'MD + CA', status:'Delivered', preview:'Revenue ₹53.84 Cr · GP 18.2% · OD 84.1% · 2 Sites AT RISK' },
]

export default function AlertsPage() {
  const [sent, setSent] = useState(false)
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>WhatsApp Alerts</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>Daily 8 AM summary to MD · GST alerts · Site at risk notifications</span>
        </div>
        <button onClick={() => setSent(true)} style={{ background:'#059669', color:'#fff', border:'none', borderRadius:8, padding:'7px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>▶ Send Now</button>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        {sent && (
          <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:10, padding:'12px 20px', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:12, color:'#065F46', fontWeight:600 }}>✓ WhatsApp message sent to 2 active recipients</div>
            <button onClick={() => setSent(false)} style={{ background:'none', border:'none', color:'#6B7280', cursor:'pointer', fontSize:18 }}>×</button>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>Today&apos;s Message Preview</div>
            <div style={{ padding:16 }}>
              <div style={{ background:'#DCF8C6', borderRadius:12, padding:16, fontSize:12, lineHeight:2, maxWidth:300, border:'1px solid #b2dfdb' }}>
                <div style={{ fontWeight:700, marginBottom:4 }}>📊 FinSight MIS · Daily Report</div>
                <div style={{ color:'#6B7280', fontSize:11 }}>Mudduluru Infratech KA · 15 Jul 2026, 08:00 AM</div>
                <div style={{ marginTop:10 }}>
                  💰 Revenue YTD: <strong>₹56.87 Cr</strong><br/>
                  ✅ GP Margin: <strong>20.3%</strong><br/>
                  ⚠️ OD Utilisation: <strong>79.2%</strong><br/>
                  📍 NIT-15 Tayalur: <strong>0.9% — At Risk</strong><br/>
                  📅 GST Due in: <strong>12 days</strong>
                </div>
                <div style={{ marginTop:10, color:'#2563EB', fontWeight:600 }}>Full MIS Report →</div>
              </div>
            </div>
          </div>
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>Recipients</span><button style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'none', borderRadius:6, padding:'3px 10px', fontSize:11, cursor:'pointer' }}>+ Add</button>
            </div>
            <div style={{ padding:'8px 0' }}>
              {[
                { name:'M Sanjeeva Raju', role:'Managing Director', active:true },
                { name:'CA (Name)', role:'Chartered Accountant', active:true },
                { name:'CFO / Finance Head', role:'CFO', active:false },
              ].map(r => (
                <div key={r.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 16px', borderBottom:'1px solid #F3F4F6' }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600 }}>{r.name}</div>
                    <div style={{ fontSize:10, color:'#6B7280' }}>{r.role}</div>
                  </div>
                  <span style={{ fontSize:9, background:r.active?'#ECFDF5':'#FFFBEB', color:r.active?'#059669':'#D97706', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>{r.active?'Active':'Paused'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>Delivery Log</div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:'#F8FAFC' }}>
              {['Date','Time','Recipient','Status','Message Preview'].map(h => (
                <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {LOG.map((l,i) => (
                <tr key={i} style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'9px 16px', fontSize:11 }}>{l.date}</td>
                  <td style={{ padding:'9px 16px', fontSize:11 }}>{l.time}</td>
                  <td style={{ padding:'9px 16px', fontWeight:600 }}>{l.recipient}</td>
                  <td style={{ padding:'9px 16px' }}><span style={{ fontSize:9, background:'#ECFDF5', color:'#059669', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>{l.status}</span></td>
                  <td style={{ padding:'9px 16px', fontSize:11, color:'#6B7280', maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.preview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
