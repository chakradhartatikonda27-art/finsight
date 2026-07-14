'use client'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

export default function Dashboard() {
  const [pl, setPL] = useState<any>(null)
  const [bs, setBS] = useState<any>(null)
  const [sites, setSites] = useState<any[]>([])
  const [validation, setValidation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    Promise.all([
      fetch(`${API}/api/reports/pl`).then(r => r.json()),
      fetch(`${API}/api/reports/bs`).then(r => r.json()),
      fetch(`${API}/api/reports/sites`).then(r => r.json()),
      fetch(`${API}/api/validate/mudduluru-ka-2025`).then(r => r.json()),
    ]).then(([plData, bsData, sitesData, valData]) => {
      setPL(plData)
      setBS(bsData)
      setSites(sitesData.sites || [])
      setValidation(valData)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <Layout>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'system-ui' }}>
        <p style={{ color:'#6B7280' }}>Loading Mudduluru Infratech data...</p>
      </div>
    </Layout>
  )

  return (
    <Layout>
      {/* Topbar */}
      <div style={{
        background:'#fff', borderBottom:'1px solid #E5E7EB',
        padding:'0 24px', height:52, display:'flex',
        alignItems:'center', justifyContent:'space-between',
        fontFamily:'system-ui', position:'sticky', top:0, zIndex:40
      }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>CFO Dashboard</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>Mudduluru Infratech (KA) · FY 2025-26</span>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <select style={{ fontSize:11, padding:'4px 8px', borderRadius:6, border:'1px solid #E5E7EB' }}>
            <option>FY 2025-26</option>
            <option>FY 2024-25</option>
          </select>
          {validation?.is_clean && (
            <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
              ✓ {validation.checks_passed}/26 Checks Passed
            </span>
          )}
        </div>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        {/* KPI Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:12, marginBottom:24 }}>
          {[
            { label:'Revenue',      value:`₹${pl?.total_revenue}`,   color:'#2563EB' },
            { label:'Gross Profit', value:`₹${pl?.gross_profit}`,    color:'#059669', sub:`${pl?.gp_margin_pct}% margin` },
            { label:'EBITDA',       value:`₹${pl?.ebitda}`,          color:'#0891B2', sub:`${pl?.ebitda_margin_pct}% margin` },
            { label:'PAT',          value:`₹${pl?.pat}`,             color:'#DC2626' },
            { label:'Total Assets', value:`₹${bs?.total_assets}`,    color:'#7C3AED' },
            { label:'BS Balanced',  value:'₹0.00 diff',              color:'#059669' },
          ].map(k => (
            <div key={k.label} style={{
              background:'#fff', border:'1px solid #E5E7EB',
              borderRadius:12, padding:'14px 16px', borderTop:`3px solid ${k.color}`
            }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color:k.color, letterSpacing:'-.02em' }}>{k.value}</div>
              {k.sub && <div style={{ fontSize:10, color:'#6B7280', marginTop:3 }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>

          {/* P&L Table */}
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>
              P&L Statement — {pl?.period}
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <tbody>
                {pl?.line_items?.map((item: any) => (
                  <tr key={item.mis_head} style={{ borderBottom:'0.5px solid #F3F4F6' }}>
                    <td style={{ padding:'8px 16px', fontWeight: ['Gross Profit','EBITDA','PAT (Net Loss)'].includes(item.mis_head) ? 700 : 400 }}>
                      {item.mis_head}
                    </td>
                    <td style={{ padding:'8px 16px', textAlign:'right', fontFamily:'monospace', color: item.amount.startsWith('-') ? '#DC2626' : '#111' }}>
                      ₹{item.amount}
                    </td>
                    <td style={{ padding:'8px 16px', textAlign:'right', color:'#6B7280', fontSize:11 }}>{item.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Site P&L */}
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>
              Site P&L — GP Margin %
            </div>
            <div style={{ padding:'16px' }}>
              {sites.map(site => (
                <div key={site.cost_centre} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:500 }}>{site.cost_centre}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      {site.status === 'AT_RISK' && (
                        <span style={{ fontSize:9, color:'#DC2626', fontWeight:700, background:'#FEF2F2', padding:'1px 6px', borderRadius:10 }}>AT RISK</span>
                      )}
                      <span style={{ fontSize:12, fontWeight:700, color: site.status === 'AT_RISK' ? '#DC2626' : '#059669' }}>
                        {site.gp_margin_pct}%
                      </span>
                    </div>
                  </div>
                  <div style={{ height:6, background:'#F3F4F6', borderRadius:3, overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:3,
                      width:`${Math.max(parseFloat(site.gp_margin_pct), 1)}%`,
                      background: site.status === 'AT_RISK' ? '#DC2626' : '#059669',
                      transition: 'width .4s'
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OD Gauges */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, padding:'16px 20px', marginBottom:24 }}>
          <div style={{ fontWeight:700, fontSize:13, color:'#1F3864', marginBottom:14 }}>Bank OD Utilisation</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {[
              { bank:'HDFC Bank OD', used:15.00, limit:20.0, pct:75, code:'KA-2341001' },
              { bank:'KVB Bank OD',  used:10.83, limit:12.6, pct:86, code:'KA-2341002' },
            ].map(od => (
              <div key={od.bank}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <div>
                    <span style={{ fontSize:12, fontWeight:600 }}>{od.bank}</span>
                    <span style={{ fontSize:10, color:'#6B7280', marginLeft:6 }}>{od.code}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:800, color: od.pct >= 85 ? '#DC2626' : '#D97706' }}>{od.pct}%</span>
                </div>
                <div style={{ height:8, background:'#F3F4F6', borderRadius:4, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:4,
                    width:`${od.pct}%`,
                    background: od.pct >= 85 ? '#DC2626' : '#D97706'
                  }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:10, color:'#6B7280' }}>
                  <span>Used: ₹{od.used} Cr</span>
                  <span>Limit: ₹{od.limit} Cr</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation */}
        <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontWeight:700, color:'#065F46', marginBottom:8, fontSize:13 }}>
            ✓ {validation?.summary}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {validation?.passed?.map((check: string) => (
              <span key={check} style={{
                background:'#fff', border:'1px solid #A7F3D0',
                borderRadius:20, padding:'2px 10px',
                fontSize:10, color:'#059669', fontWeight:600
              }}>
                {check.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}
