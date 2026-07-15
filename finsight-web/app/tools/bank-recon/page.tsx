'use client'
import Layout from '../../../components/Layout'
export default function BankReconPage() {
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Bank Reconciliation</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>BR001 + BR002 · HDFC OD + KVB OD</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ background:'#fff', color:'#1F3864', border:'1px solid #1F3864', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer' }}>↑ Upload HDFC Statement</button>
          <button style={{ background:'#fff', color:'#1F3864', border:'1px solid #1F3864', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer' }}>↑ Upload KVB Statement</button>
        </div>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          {[
            { l:'BR001 Status', v:'PASS', s:'Both accounts matched', c:'#059669' },
            { l:'Unreconciled Items', v:'3', s:'₹86,680 total', c:'#D97706' },
            { l:'Accounts Checked', v:'2', s:'HDFC + KVB', c:'#2563EB' },
          ].map(k => (
            <div key={k.l} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.c}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.l}</div>
              <div style={{ fontSize:22, fontWeight:800, color:k.c }}>{k.v}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{k.s}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>BR001 — Closing Balance Reconciliation</span>
            <span style={{ fontSize:9, background:'#ECFDF5', color:'#059669', padding:'2px 10px', borderRadius:10, fontWeight:700 }}>PASS</span>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:'#F8FAFC' }}>
              {['Account','Tally Closing (₹)','Bank Statement (₹)','Difference','Status'].map(h => (
                <th key={h} style={{ padding:'9px 16px', textAlign:h.includes('₹')||h==='Difference'?'right':'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                { acc:'HDFC Bank OD (KA-2341001)', t:'15,00,00,000.00', b:'15,00,00,000.00' },
                { acc:'KVB Bank OD (KA-2341002)', t:'10,83,42,100.00', b:'10,83,42,100.00' },
              ].map(r => (
                <tr key={r.acc} style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px', fontWeight:600 }}>{r.acc}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace' }}>{r.t}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace' }}>{r.b}</td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', color:'#059669', fontWeight:700 }}>0.00</td>
                  <td style={{ padding:'10px 16px' }}><span style={{ fontSize:9, background:'#ECFDF5', color:'#059669', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>PASS</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>BR002 — Unreconciled Items</span>
            <span style={{ fontSize:9, background:'#FFFBEB', color:'#D97706', padding:'2px 10px', borderRadius:10, fontWeight:700 }}>WARNING — 3 Items ₹86,680</span>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:'#F8FAFC' }}>
              {['Item','Type','Amount (₹)','Resolution'].map(h => (
                <th key={h} style={{ padding:'9px 16px', textAlign:h==='Amount (₹)'?'right':'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                { item:'Cheque #384921 to SVP Enterprises', type:'Uncleared Cheque', amt:'9,440.00', res:'Expected to clear in 2 days' },
                { item:'HDFC Bank Charges Jun 2026', type:'Bank Charge not in Tally', amt:'2,360.00', res:'Pass as Bank Charges voucher in Tally' },
                { item:'KVB OD Interest Jun 2026', type:'OD Interest not in Tally', amt:'84,320.00', res:'Dr. Interest on OD / Cr. KVB OD ₹84,320' },
              ].map(r => (
                <tr key={r.item} style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px', fontWeight:600 }}>{r.item}</td>
                  <td style={{ padding:'10px 16px' }}><span style={{ fontSize:10, background:'#FFFBEB', color:'#D97706', padding:'2px 8px', borderRadius:10, fontWeight:600 }}>{r.type}</span></td>
                  <td style={{ padding:'10px 16px', textAlign:'right', fontFamily:'monospace', color:'#D97706', fontWeight:700 }}>{r.amt}</td>
                  <td style={{ padding:'10px 16px', fontSize:11, color:'#6B7280' }}>{r.res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
