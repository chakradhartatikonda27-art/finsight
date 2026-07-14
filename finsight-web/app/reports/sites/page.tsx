'use client'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([])

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${API}/api/reports/sites`).then(r => r.json()).then(d => setSites(d.sites || []))
  }, [])

  return (
    <Layout>
      <div style={{
        background:'#fff', borderBottom:'1px solid #E5E7EB',
        padding:'0 24px', height:52, display:'flex',
        alignItems:'center', justifyContent:'space-between',
        fontFamily:'system-ui', position:'sticky', top:0, zIndex:40
      }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Site P&L</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>Cost centre profitability · 14 NIT projects · FY 2025-26</span>
        </div>
        <span style={{ background:'#FEF2F2', color:'#DC2626', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
          1 site AT RISK
        </span>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        {/* Site cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px,1fr))', gap:16, marginBottom:24 }}>
          {sites.map(site => (
            <div key={site.cost_centre} style={{
              background:'#fff', border:`1px solid ${site.status === 'AT_RISK' ? '#FCA5A5' : '#E5E7EB'}`,
              borderRadius:12, padding:'16px 18px',
              borderTop:`3px solid ${site.status === 'AT_RISK' ? '#DC2626' : '#059669'}`
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:'#1F3864' }}>{site.cost_centre}</div>
                  <div style={{ fontSize:11, color:'#6B7280', marginTop:2 }}>Revenue: ₹{site.revenue}</div>
                </div>
                {site.status === 'AT_RISK'
                  ? <span style={{ background:'#FEF2F2', color:'#DC2626', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>AT RISK</span>
                  : <span style={{ background:'#ECFDF5', color:'#059669', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>ON TRACK</span>
                }
              </div>
              <div style={{ marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:11, color:'#6B7280' }}>GP Margin</span>
                  <span style={{ fontSize:13, fontWeight:800, color: site.status === 'AT_RISK' ? '#DC2626' : '#059669' }}>
                    {site.gp_margin_pct}%
                  </span>
                </div>
                <div style={{ height:8, background:'#F3F4F6', borderRadius:4, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:4,
                    width:`${Math.max(parseFloat(site.gp_margin_pct), 1)}%`,
                    background: site.status === 'AT_RISK' ? '#DC2626' : '#059669',
                    transition:'width .4s'
                  }}/>
                </div>
              </div>
              {site.status === 'AT_RISK' && (
                <div style={{ fontSize:10, color:'#DC2626', background:'#FEF2F2', padding:'6px 10px', borderRadius:6, marginTop:8 }}>
                  ⚠ GP margin below 5% threshold. Review sub-contractor billing and material costs immediately.
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary table */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>
            Site Performance Summary
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Site / Cost Centre','Revenue','GP Margin %','Status'].map(h => (
                  <th key={h} style={{ padding:'8px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sites.map((site, i) => (
                <tr key={i} style={{ borderBottom:'0.5px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px', fontWeight:600 }}>{site.cost_centre}</td>
                  <td style={{ padding:'10px 16px', fontFamily:'monospace' }}>₹{site.revenue}</td>
                  <td style={{ padding:'10px 16px', fontWeight:700, color: site.status === 'AT_RISK' ? '#DC2626' : '#059669' }}>
                    {site.gp_margin_pct}%
                  </td>
                  <td style={{ padding:'10px 16px' }}>
                    <span style={{
                      fontSize:10, fontWeight:700, padding:'2px 10px', borderRadius:20,
                      background: site.status === 'AT_RISK' ? '#FEF2F2' : '#ECFDF5',
                      color: site.status === 'AT_RISK' ? '#DC2626' : '#059669'
                    }}>
                      {site.status === 'AT_RISK' ? 'AT RISK' : 'ON TRACK'}
                    </span>
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
