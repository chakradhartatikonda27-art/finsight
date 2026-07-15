'use client'
import Layout from '../../../components/Layout'
const MP001 = [
  { line:'Cash in Hand',       prior:'₹12,84,000',    current:'₹12,84,000',    diff:'₹0.00' },
  { line:'Bank Balance',       prior:'₹1,02,84,200',  current:'₹1,02,84,200',  diff:'₹0.00' },
  { line:'Sundry Debtors',     prior:'₹13,43,18,400', current:'₹13,43,18,400', diff:'₹0.00' },
  { line:'Sundry Creditors',   prior:'₹36,70,84,200', current:'₹36,70,84,200', diff:'₹0.00' },
  { line:'Share Capital',      prior:'₹1,00,00,000',  current:'₹1,00,00,000',  diff:'₹0.00' },
  { line:'Reserves & Surplus', prior:'(₹1,58,42,300)',current:'(₹1,58,42,300)',diff:'₹0.00' },
  { line:'Term Loans',         prior:'₹5,42,18,400',  current:'₹5,42,18,400',  diff:'₹0.00' },
]
export default function MultiPeriodPage() {
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Multi-Period Consistency</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>MP001 ✓ · MP002 MP003 awaiting FY 2024-25</span>
        </div>
        <button style={{ background:'#fff', color:'#1F3864', border:'1px solid #1F3864', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer' }}>↑ Upload FY 2024-25 Day Book</button>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          {[
            { l:'MP001 — Intra-Year', v:'PASS', s:'All 7 BS lines ₹0.00', c:'#059669' },
            { l:'MP002 — Prior Year Close', v:'PENDING', s:'Upload FY 2024-25', c:'#D97706' },
            { l:'MP003 — Prior TB Balanced', v:'PENDING', s:'Upload FY 2024-25', c:'#D97706' },
          ].map(k => (
            <div key={k.l} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.c}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.l}</div>
              <div style={{ fontSize:20, fontWeight:800, color:k.c }}>{k.v}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{k.s}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>MP001 — Prior Month Closing = Current Month Opening</span>
            <span style={{ fontSize:9, background:'#ECFDF5', color:'#059669', padding:'2px 10px', borderRadius:10, fontWeight:700 }}>PASS — All 7 Lines ₹0.00</span>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:'#F8FAFC' }}>
              {['Balance Sheet Line','Prior Month Closing','Current Month Opening','Difference','Status'].map(h => (
                <th key={h} style={{ padding:'9px 16px', textAlign:h==='Difference'||h==='Status'?'right':'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {MP001.map(r => (
                <tr key={r.line} style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px', fontWeight:600 }}>{r.line}</td>
                  <td style={{ padding:'10px 16px', fontFamily:'monospace' }}>{r.prior}</td>
                  <td style={{ padding:'10px 16px', fontFamily:'monospace' }}>{r.current}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', color:'#059669', fontWeight:700 }}>{r.diff}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right' }}><span style={{ fontSize:9, background:'#ECFDF5', color:'#059669', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>✓ PASS</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:10, padding:'12px 16px', fontSize:12, color:'#1D4ED8' }}>
          <strong>MP002 and MP003 activate when you upload FY 2024-25 Day Book</strong><br/>
          MP002: FY 2024-25 closing = FY 2025-26 opening (7 BS lines, ₹0.50 tolerance)<br/>
          MP003: FY 2024-25 Trial Balance itself must be balanced before trusting as source
        </div>
      </div>
    </Layout>
  )
}
