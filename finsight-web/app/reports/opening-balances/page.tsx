'use client'
import Layout from '../../../components/Layout'

const LIAB = [
  { cat:"OWNER'S EQUITY", sub:'₹57,49,300', lines:[
    { l:'Equity Share Capital', v:'₹1,00,00,000' },
    { l:'Reserves & Surplus', v:'(₹42,50,700)', neg:true },
  ]},
  { cat:'NON-CURRENT LIABILITIES', sub:'₹8,26,39,400', lines:[
    { l:'Term Loans', v:'₹5,42,18,400' },
    { l:'Unsecured Loans (Directors)', v:'₹2,84,21,000' },
  ]},
  { cat:'CURRENT LIABILITIES', sub:'₹47,04,70,100', lines:[
    { l:'Working Capital OD', v:'₹21,42,18,400' },
    { l:'Sundry Creditors', v:'₹24,84,21,000' },
    { l:'Statutory Dues', v:'₹72,18,400' },
    { l:'Short Term Provisions', v:'₹12,300' },
  ]},
]
const ASSETS = [
  { cat:'NON-CURRENT ASSETS', sub:'₹19,26,39,300', lines:[
    { l:'Property, Plant & Equipment (WDV)', v:'₹18,84,21,300' },
    { l:'Other Long Term Assets', v:'₹42,18,000' },
  ]},
  { cat:'CURRENT ASSETS', sub:'₹38,62,19,500', lines:[
    { l:'Inventory (Opening Stock)', v:'₹8,46,00,000' },
    { l:'Sundry Debtors', v:'₹14,84,21,000' },
    { l:'Cash in Hand', v:'₹12,84,000' },
    { l:'Balance with Banks', v:'₹1,02,84,200' },
    { l:'GST Input Credit', v:'₹42,18,400' },
    { l:'Advances & Loans', v:'₹12,84,21,900' },
  ]},
]

export default function OBPage() {
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Opening Balances</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>As at 1 April 2025 · Auto-detected · OB001 PASS</span>
        </div>
        <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>✓ Balanced · Diff ₹0.00</span>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
          {[
            { l:'Opening Assets', v:'₹57,88,58,800', c:'#2563EB' },
            { l:'Opening L&E', v:'₹57,88,58,800', c:'#059669', s:'OB001 PASS' },
          ].map(k => (
            <div key={k.l} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.c}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.l}</div>
              <div style={{ fontSize:22, fontWeight:800, color:k.c }}>{k.v}</div>
              {(k as any).s && <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{(k as any).s}</div>}
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {[{ title:'EQUITY & LIABILITIES', sections:LIAB, color:'#1F3864' }, { title:'ASSETS', sections:ASSETS, color:'#1D4ED8' }].map(side => (
            <div key={side.title}>
              <div style={{ fontSize:10, fontWeight:800, color:side.color, textTransform:'uppercase', letterSpacing:'.09em', marginBottom:8, paddingBottom:8, borderBottom:`3px solid ${side.color}` }}>{side.title}</div>
              <div style={{ border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
                {side.sections.map((sec:any) => (
                  <div key={sec.cat}>
                    <div style={{ background:'#1F3864', padding:'8px 16px', display:'flex', justifyContent:'space-between', color:'#fff', fontSize:10, fontWeight:700, textTransform:'uppercase' }}>
                      <span>{sec.cat}</span><span style={{ color:'#93C5FD' }}>{sec.sub}</span>
                    </div>
                    {sec.lines.map((l:any) => (
                      <div key={l.l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 16px', borderBottom:'1px solid #F3F4F6', fontSize:12 }}>
                        <span style={{ color:'#374151', paddingLeft:12 }}>{l.l}</span>
                        <span style={{ fontFamily:'monospace', color:l.neg?'#DC2626':'#111' }}>{l.v}</span>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', background:side.color, fontWeight:800, fontSize:13, color:'#fff' }}>
                  <span>TOTAL</span><span>₹57,88,58,800</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
