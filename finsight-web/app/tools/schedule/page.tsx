'use client'
import Layout from '../../../components/Layout'

const SCHEDULES = [
  { name:'Monthly MIS Pack — Board PPT', freq:'1st of every month', time:'06:00 AM', format:'PPT + Excel + PDF', recipients:'MD, CFO, CA', next:'1 Aug 2026' },
  { name:'Weekly Cash Position', freq:'Every Monday', time:'07:00 AM', format:'Excel', recipients:'CFO, CA', next:'21 Jul 2026' },
  { name:'GST Due Date Alert', freq:'7 days before due date', time:'09:00 AM', format:'WhatsApp', recipients:'MD, CA', next:'13 Jul 2026' },
  { name:'Daily OD Utilisation', freq:'Every day', time:'08:00 AM', format:'WhatsApp', recipients:'MD', next:'Tomorrow 08:00 AM' },
]

export default function SchedulePage() {
  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Scheduled Reports</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>Auto-generate and deliver on schedule · No manual work</span>
        </div>
        <button style={{ background:'#1F3864', color:'#fff', border:'none', borderRadius:8, padding:'7px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>+ Add Schedule</button>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          {[
            { l:'Active Schedules', v:'4', c:'#059669' },
            { l:'Reports Sent (Jul)', v:'18', c:'#2563EB' },
            { l:'Next Run', v:'Tomorrow 06:00', c:'#D97706' },
          ].map(k => (
            <div key={k.l} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', borderTop:`3px solid ${k.c}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.l}</div>
              <div style={{ fontSize:22, fontWeight:800, color:k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>Active Schedules</div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:'#F8FAFC' }}>
              {['Report Name','Frequency','Time','Format','Recipients','Next Run','Status'].map(h => (
                <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {SCHEDULES.map((s,i) => (
                <tr key={i} style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px', fontWeight:600, color:'#1F3864' }}>{s.name}</td>
                  <td style={{ padding:'10px 16px', fontSize:11 }}>{s.freq}</td>
                  <td style={{ padding:'10px 16px', fontSize:11 }}>{s.time}</td>
                  <td style={{ padding:'10px 16px' }}><span style={{ fontSize:10, background:'#EFF6FF', color:'#2563EB', padding:'2px 8px', borderRadius:10, fontWeight:600 }}>{s.format}</span></td>
                  <td style={{ padding:'10px 16px', fontSize:11, color:'#6B7280' }}>{s.recipients}</td>
                  <td style={{ padding:'10px 16px', fontSize:11, fontWeight:600, color:'#059669' }}>{s.next}</td>
                  <td style={{ padding:'10px 16px' }}><span style={{ fontSize:9, background:'#ECFDF5', color:'#059669', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
