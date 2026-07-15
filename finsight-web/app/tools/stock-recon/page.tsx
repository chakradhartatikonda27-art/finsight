'use client'
import Layout from '../../../components/Layout'
const STOCK = [
  { item:'M-Sand',              unit:'MT',   oq:1420,  inq:18200, outq:16800, cq:2820,  ov:'3,24,000',    iv:'42,18,000',    cv:'23,12,040' },
  { item:'TMT Steel 500D 12mm', unit:'MT',   oq:82,    inq:2840,  outq:2675,  cq:247,   ov:'28,40,000',   iv:'1,51,84,800',  cv:'1,58,67,000' },
  { item:'TMT Steel 500D 16mm', unit:'MT',   oq:41,    inq:1420,  outq:1338,  cq:123,   ov:'14,20,000',   iv:'75,60,000',    cv:'81,28,980' },
  { item:'Cement OPC 53',       unit:'Bags', oq:2840,  inq:48200, outq:45760, cq:5280,  ov:'5,68,000',    iv:'97,24,400',    cv:'20,06,400' },
  { item:'Diesel (HSD)',         unit:'Ltr',  oq:4820,  inq:142000,outq:135980,cq:10840, ov:'4,24,160',    iv:'1,24,96,000',  cv:'9,95,000' },
  { item:'Bitumen VG-30',       unit:'MT',   oq:42,    inq:1684,  outq:1508,  cq:218,   ov:'21,84,000',   iv:'8,77,28,000',  cv:'1,49,28,000' },
  { item:'Coarse Aggregate',    unit:'MT',   oq:820,   inq:12400, outq:11020, cq:2200,  ov:'8,20,000',    iv:'1,24,00,000',  cv:'27,28,000' },
]
export default function StockReconPage() {
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Stock Reconciliation</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>INV001 INV002 INV003 · 7 materials · Closing stock verified</span>
        </div>
        <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>INV001 ✓ INV002 ✓ INV003 ✓</span>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          {[
            { l:'INV001 — Stock vs BS', v:'₹19.06 Cr = ₹19.06 Cr', c:'#059669' },
            { l:'INV002 — Material Formula', v:'₹45.35 Cr = P&L', c:'#059669' },
            { l:'INV003 — Negative Stock', v:'0 Items', c:'#059669' },
          ].map(k => (
            <div key={k.l} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.c}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.l}</div>
              <div style={{ fontSize:16, fontWeight:800, color:k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:12, color:'#065F46', fontWeight:600 }}>
          ✓ INV002: Opening ₹8.46 Cr + Purchases ₹55.95 Cr − Closing ₹19.06 Cr = ₹45.35 Cr = P&L Material Cost
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>Stock Register — 7 Construction Materials · FY 2025-26</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:750 }}>
              <thead><tr style={{ background:'#F8FAFC' }}>
                {['Item','Unit','Open Qty','Inward','Outward','Close Qty','Open Val (₹)','Inward Val (₹)','Close Val (₹)'].map(h => (
                  <th key={h} style={{ padding:'9px 12px', textAlign: h==='Item'||h==='Unit'?'left':'right', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {STOCK.map(s => (
                  <tr key={s.item} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'9px 12px', fontWeight:600, color:'#1F3864' }}>{s.item}</td>
                    <td style={{ padding:'9px 12px', fontSize:10, color:'#6B7280' }}>{s.unit}</td>
                    <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace' }}>{s.oq.toLocaleString('en-IN')}</td>
                    <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace' }}>{s.inq.toLocaleString('en-IN')}</td>
                    <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace' }}>{s.outq.toLocaleString('en-IN')}</td>
                    <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace', fontWeight:700, color:'#059669' }}>{s.cq.toLocaleString('en-IN')}</td>
                    <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace' }}>{s.ov}</td>
                    <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace' }}>{s.iv}</td>
                    <td style={{ padding:'9px 12px', textAlign:'right', fontFamily:'monospace', fontWeight:700 }}>{s.cv}</td>
                  </tr>
                ))}
                <tr style={{ background:'#F0FFF4', fontWeight:700 }}>
                  <td colSpan={6} style={{ padding:'10px 12px', color:'#065F46' }}>TOTAL CLOSING STOCK</td>
                  <td style={{ padding:'10px 12px', textAlign:'right', fontFamily:'monospace', color:'#065F46' }}>84,80,160</td>
                  <td style={{ padding:'10px 12px', textAlign:'right', fontFamily:'monospace', color:'#065F46' }}>14,92,11,200</td>
                  <td style={{ padding:'10px 12px', textAlign:'right', fontFamily:'monospace', fontSize:13, color:'#065F46' }}>19,06,42,100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
