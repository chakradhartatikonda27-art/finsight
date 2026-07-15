'use client'
import Layout from '../../../components/Layout'

const BVA = [
  { head:'Revenue',           budget:'61,00,00,000', actual:'56,87,43,200', var:'(4,12,56,800)', pct:'-6.8', flag:true,  tot:true },
  { head:'  Sale of Service', budget:'52,00,00,000', actual:'51,19,95,365', var:'(80,04,635)',   pct:'-1.5', flag:false },
  { head:'  Unbilled Revenue',budget:'9,00,00,000',  actual:'5,67,47,835',  var:'(3,32,52,165)',pct:'-36.9', flag:true },
  { head:'Material Cost',     budget:'40,00,00,000', actual:'45,35,18,400', var:'(5,35,18,400)',pct:'-13.4', flag:true,  tot:true, over:true },
  { head:'Employee Cost',     budget:'4,50,00,000',  actual:'4,72,41,800',  var:'(22,41,800)',  pct:'-4.9',  flag:false },
  { head:'Admin Cost',        budget:'1,20,00,000',  actual:'1,16,70,500',  var:'3,29,500',     pct:'+2.7',  good:true },
  { head:'EBITDA',            budget:'5,20,00,000',  actual:'4,63,12,500',  var:'(56,87,500)',  pct:'-10.9', flag:true,  tot:true },
  { head:'Finance Cost',      budget:'2,80,00,000',  actual:'3,70,48,200',  var:'(90,48,200)',  pct:'-32.3', flag:true,  over:true },
  { head:'Net Profit/(Loss)', budget:'(50,00,000)',  actual:'(87,91,400)',   var:'(37,91,400)',  pct:'-75.8', flag:true,  tot:true },
]

export default function BvAPage() {
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Budget vs Actual</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>Line-by-line variance · FY 2025-26</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ background:'#fff', color:'#1F3864', border:'1px solid #1F3864', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer' }}>↑ Upload Budget</button>
          <button style={{ background:'#fff', color:'#1F3864', border:'1px solid #1F3864', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer' }}>↓ Excel</button>
        </div>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { l:'Revenue Variance', v:'(₹4.13 Cr)', s:'-6.8% below budget', c:'#DC2626' },
            { l:'Cost Overrun',     v:'₹5.24 Cr',   s:'+12.5% over budget', c:'#DC2626' },
            { l:'EBITDA Variance',  v:'(₹56.88 L)', s:'-10.9% below budget',c:'#D97706' },
            { l:'Lines Flagged',    v:'6',           s:'of 9 P&L lines',     c:'#DC2626' },
          ].map(k => (
            <div key={k.l} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.c}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.l}</div>
              <div style={{ fontSize:20, fontWeight:800, color:k.c }}>{k.v}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{k.s}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 20px', color:'#fff', fontWeight:700, fontSize:13 }}>Budget vs Actual — P&L · FY 2025-26</div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:'#F8FAFC' }}>
              {['Particulars','Budget FY26 (₹)','Actual FY26 (₹)','Variance (₹)','Var %','Status'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign: h==='Particulars'?'left':'right', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {BVA.map((r,i) => (
                <tr key={i} style={{ background: r.tot?(r.good?'#F0FFF4':r.flag?'#FEF2F2':'#F9FAFB'):'#fff', fontWeight:r.tot?700:400, borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px', paddingLeft: r.head.startsWith('  ')?28:16, color:r.tot?'#1F3864':'#374151' }}>{r.head.trim()}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace' }}>{r.budget}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', fontWeight:600 }}>{r.actual}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', color:r.good?'#059669':'#DC2626' }}>{r.var}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontWeight:700, color:r.good?'#059669':'#DC2626' }}>{r.pct}%</td>
                  <td style={{ padding:'10px 16px', textAlign:'right' }}>
                    {r.flag && <span style={{ fontSize:9, background:'#FEF2F2', color:'#DC2626', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>⚠ Over</span>}
                    {r.good && <span style={{ fontSize:9, background:'#ECFDF5', color:'#059669', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>✓ OK</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
