'use client'
import Layout from '../../../components/Layout'

const YOY = [
  { l:'Revenue',           py:'50,64,21,000', cy:'56,87,43,200', chg:'+12.3%', up:true,  tot:true },
  { l:'Total COGS',        py:'41,22,18,000', cy:'47,24,07,341', chg:'-14.6%', up:false, tot:true },
  { l:'Gross Profit',      py:'9,42,03,000',  cy:'11,52,24,800', chg:'+22.3%', up:true,  tot:true },
  { l:'GP Margin',         py:'18.7%',        cy:'20.3%',         chg:'+1.6pp', up:true },
  { l:'Employee Cost',     py:'4,18,42,000',  cy:'4,72,41,800',  chg:'-12.9%', up:false },
  { l:'Admin Cost',        py:'1,08,42,000',  cy:'1,16,70,500',  chg:'-7.4%',  up:false },
  { l:'EBITDA',            py:'4,27,42,000',  cy:'4,63,12,500',  chg:'+8.4%',  up:true,  tot:true },
  { l:'EBITDA Margin',     py:'8.4%',         cy:'8.1%',          chg:'-0.3pp', up:false },
  { l:'Finance Cost',      py:'3,13,42,000',  cy:'3,70,48,200',  chg:'-18.2%', up:false },
  { l:'Net Profit/(Loss)', py:'(42,18,000)',   cy:'(87,91,400)',   chg:'-108.4%',up:false, tot:true },
]

export default function YoYPage() {
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Year-on-Year</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>FY 2025-26 vs FY 2024-25 · Board-ready</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ background:'#fff', color:'#1F3864', border:'1px solid #1F3864', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer' }}>↑ Upload FY 2024-25</button>
          <button style={{ background:'#fff', color:'#1F3864', border:'1px solid #1F3864', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer' }}>↓ PPT</button>
        </div>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { l:'Revenue Growth', v:'+12.3%', s:'₹50.64 → ₹56.87 Cr', c:'#2563EB' },
            { l:'GP Margin',      v:'20.3%',  s:'vs 18.7% last year ↑', c:'#059669' },
            { l:'EBITDA Growth',  v:'+8.4%',  s:'₹4.27 → ₹4.63 Cr',   c:'#0891B2' },
            { l:'Finance Cost',   v:'+18.2%', s:'₹3.13 → ₹3.70 Cr ↑', c:'#DC2626' },
          ].map(k => (
            <div key={k.l} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.c}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.l}</div>
              <div style={{ fontSize:20, fontWeight:800, color:k.c }}>{k.v}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{k.s}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 20px', color:'#fff', fontWeight:700, fontSize:13 }}>P&L Year-on-Year — FY 2024-25 vs FY 2025-26</div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:'#F8FAFC' }}>
              {['Particulars','FY 2024-25 (₹)','FY 2025-26 (₹)','YoY Change'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:h==='Particulars'?'left':'right', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {YOY.map((r,i) => (
                <tr key={i} style={{ background:r.tot?'#F9FAFB':'#fff', fontWeight:r.tot?700:400, borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px', color:r.tot?'#1F3864':'#374151' }}>{r.l}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', color:'#6B7280' }}>{r.py}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', fontWeight:600 }}>{r.cy}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontWeight:700, color:r.up?'#059669':'#DC2626' }}>{r.chg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
