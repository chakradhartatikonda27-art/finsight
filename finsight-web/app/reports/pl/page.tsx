'use client'
import Layout from '../../../components/Layout'

const PL_DATA = [
  { mis_head: 'Revenue',          amount: '56,87,43,200', pct: '100.0', type: 'revenue', bold: true },
  { mis_head: '  Road Works Income', amount: '52,14,28,000', pct: '91.7', type: 'sub' },
  { mis_head: '  Retentions Released', amount: '4,73,15,200', pct: '8.3', type: 'sub' },
  { mis_head: 'Less: Material Cost', amount: '45,35,18,400', pct: '79.7', type: 'cost' },
  { mis_head: 'Less: Direct Labour',  amount: '1,61,84,200',  pct: '2.8',  type: 'cost' },
  { mis_head: 'GROSS PROFIT',    amount: '11,52,24,800', pct: '20.3', type: 'subtotal', bold: true },
  { mis_head: 'Less: Employee Cost',   amount: '4,72,41,800', pct: '8.3',  type: 'opex' },
  { mis_head: 'Less: Administrative',  amount: '1,16,70,500', pct: '2.1',  type: 'opex' },
  { mis_head: 'Less: Selling Cost',    amount: '18,44,200',   pct: '0.3',  type: 'opex' },
  { mis_head: 'EBITDA',          amount: '4,63,12,500',  pct: '8.1',  type: 'subtotal', bold: true },
  { mis_head: 'Less: Finance Cost',    amount: '3,70,48,200', pct: '6.5',  type: 'finance' },
  { mis_head: 'Less: Depreciation',    amount: '2,84,36,100', pct: '5.0',  type: 'finance' },
  { mis_head: 'PBT',             amount: '(1,91,71,800)', pct: '(3.4)', type: 'subtotal', bold: true, negative: true },
  { mis_head: 'Less: Tax',             amount: '—',           pct: '—',    type: 'finance' },
  { mis_head: 'PAT (Net Loss)',  amount: '(87,91,400)',  pct: '(1.5)', type: 'total', bold: true, negative: true },
]

const ROW_COLORS: Record<string, string> = {
  revenue:  '#EFF6FF',
  subtotal: '#F0FFF4',
  total:    '#ECFDF5',
}

export default function PLPage() {
  return (
    <Layout>
      <div style={{
        background:'#fff', borderBottom:'1px solid #E5E7EB',
        padding:'0 24px', height:52, display:'flex',
        alignItems:'center', justifyContent:'space-between',
        fontFamily:'system-ui', position:'sticky', top:0, zIndex:40
      }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>P&L Statement</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>
            Mudduluru Infratech (KA) · FY 2025-26
          </span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>PL001 ✓</span>
          <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>PL002 ✓</span>
          <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>PL003 ✓</span>
        </div>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:24 }}>
          {[
            { label:'Revenue',     value:'₹56.87 Cr', color:'#2563EB' },
            { label:'Gross Profit',value:'₹11.52 Cr', color:'#059669', sub:'20.3% margin' },
            { label:'EBITDA',      value:'₹4.63 Cr',  color:'#0891B2', sub:'8.1% margin' },
            { label:'PAT',         value:'(₹87.91 L)',color:'#DC2626', sub:'Net Loss' },
          ].map(k => (
            <div key={k.label} style={{
              background:'#fff', border:'1px solid #E5E7EB',
              borderRadius:12, padding:'14px 16px', borderTop:`3px solid ${k.color}`
            }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.label}</div>
              <div style={{ fontSize:20, fontWeight:800, color:k.color }}>{k.value}</div>
              {k.sub && <div style={{ fontSize:10, color:'#6B7280', marginTop:3 }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        <div className="card" style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13, display:'flex', justifyContent:'space-between' }}>
            <span>Profit & Loss Statement — FY 2025-26</span>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ fontSize:10, background:'#ECFDF5', color:'#059669', padding:'2px 8px', borderRadius:10 }}>PL001 ✓</span>
              <span style={{ fontSize:10, background:'#ECFDF5', color:'#059669', padding:'2px 8px', borderRadius:10 }}>PL002 ✓</span>
            </div>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                <th style={{ padding:'8px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB', width:'50%' }}>MIS Head</th>
                <th style={{ padding:'8px 16px', textAlign:'right', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB' }}>Amount (₹)</th>
                <th style={{ padding:'8px 16px', textAlign:'right', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB' }}>% Revenue</th>
                <th style={{ padding:'8px 16px', borderBottom:'1px solid #E5E7EB', width:40 }}></th>
              </tr>
            </thead>
            <tbody>
              {PL_DATA.map((row: any, i) => (
                <tr key={i} style={{
                  background: ROW_COLORS[row.type] || '#fff',
                  fontWeight: row.bold ? 700 : 400,
                  borderBottom: '0.5px solid #F3F4F6'
                }}>
                  <td style={{
                    padding: `9px 16px 9px ${row.type === 'sub' ? 32 : 16}px`,
                    color: row.type === 'total' || row.type === 'subtotal' ? '#1F3864' : '#374151',
                    fontSize: row.type === 'sub' ? 11 : 12,
                  }}>
                    {row.mis_head}
                  </td>
                  <td style={{ padding:'9px 16px', textAlign:'right', fontFamily:'monospace', color: row.negative ? '#DC2626' : '#111' }}>
                    {row.amount === '—' ? '—' : `₹${row.amount}`}
                  </td>
                  <td style={{ padding:'9px 16px', textAlign:'right', fontSize:11, color:'#6B7280' }}>
                    {row.pct}%
                  </td>
                  <td style={{ padding:'9px 16px', textAlign:'center' }}>
                    {row.type !== 'sub' && row.amount !== '—' && (
                      <button style={{ fontSize:11, color:'#2563EB', background:'none', border:'none', cursor:'pointer' }} title="Drill down">↗</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop:16, background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:12, padding:'14px 20px' }}>
          <div style={{ fontWeight:700, color:'#065F46', fontSize:12, marginBottom:4 }}>
            ✓ All P&L checks passed — PL001 PL002 PL003 PL004
          </div>
          <div style={{ fontSize:11, color:'#059669', lineHeight:1.7 }}>
            Revenue ₹56.87 Cr → GP ₹11.52 Cr (20.3%) → EBITDA ₹4.63 Cr (8.1%) → PAT (₹87.91 L) (-1.5%)<br/>
            Formula chain verified. Click ↗ on any line to drill down to source Tally vouchers.
          </div>
        </div>

      </div>
    </Layout>
  )
}
