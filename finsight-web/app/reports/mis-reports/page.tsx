'use client'
import Layout from '../../../components/Layout'

const REPORTS = [
  { name:'Full MIS Pack — Board PPT', desc:'P&L + BS + CF + Site P&L + Ratios · 24 slides', formats:['PPT','PDF','Excel'] },
  { name:'P&L Statement', desc:'Revenue → GP → EBITDA → PAT with quarterly columns', formats:['Excel','PDF'] },
  { name:'Balance Sheet', desc:'Schedule III format · BS001 verified', formats:['Excel','PDF'] },
  { name:'Cash Flow Statement', desc:'Indirect method · CF001 reconciled', formats:['Excel','PDF'] },
  { name:'Site P&L Summary', desc:'6 NIT cost centres · GP margin comparison', formats:['Excel','PDF','PPT'] },
  { name:'Trial Balance', desc:'1,406 ledgers · DR=CR=₹560.51 Cr', formats:['Excel'] },
  { name:'Vendor Aging Report', desc:'₹36.70 Cr · 0-30 / 31-60 / 60+ buckets', formats:['Excel'] },
  { name:'GST Reconciliation', desc:'CGST+SGST+IGST+TDS · TX001 TX002 PASS', formats:['Excel','PDF'] },
  { name:'Day Book', desc:'30,490 vouchers · full audit trail', formats:['Excel'] },
  { name:'Validation Report', desc:'30/30 checks · PASS/FAIL detail', formats:['PDF'] },
]
const FC: Record<string,string> = { PPT:'#D97706', PDF:'#DC2626', Excel:'#059669' }

export default function MISReportsPage() {
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>MIS Reports</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>Download · Excel · PDF · Board PPT with letterhead</span>
        </div>
        <button style={{ background:'#1F3864', color:'#fff', border:'none', borderRadius:8, padding:'7px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>↓ Download Full MIS Pack</button>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:12, color:'#1D4ED8' }}>
          All reports generated from validated data — 30/30 checks passed. No report is generated on unvalidated data. Audit trail permanently logged.
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 20px', color:'#fff', fontWeight:700, fontSize:13 }}>Available Reports — Mudduluru Infratech (KA) · FY 2025-26</div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:'#F8FAFC' }}>
              {['Report Name','Description','Formats','Download'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {REPORTS.map(r => (
                <tr key={r.name} style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'11px 16px', fontWeight:600, color:'#1F3864' }}>{r.name}</td>
                  <td style={{ padding:'11px 16px', fontSize:11, color:'#6B7280' }}>{r.desc}</td>
                  <td style={{ padding:'11px 16px' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      {r.formats.map(f => (
                        <span key={f} style={{ fontSize:9, background:FC[f]+'22', color:FC[f], padding:'2px 8px', borderRadius:10, fontWeight:700 }}>{f}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding:'11px 16px' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      {r.formats.map(f => (
                        <button key={f} style={{ fontSize:10, padding:'3px 10px', background:'#1F3864', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:600 }}>↓ {f}</button>
                      ))}
                    </div>
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
