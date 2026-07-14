'use client'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'

const UPLOAD_ID = 'bb2ea540-b1a0-4f1f-b3d9-2cfb18d6ead1'

function formatCr(val: number): string {
  if (!val) return '₹0.00'
  const cr = Math.abs(val) / 10000000
  return `₹${cr.toFixed(2)} Cr`
}

function formatINR(val: number): string {
  return Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

export default function PLPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${API}/api/reports/real/pl-v2/${UPLOAD_ID}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  const rows = data ? [
    { label: 'Revenue from Operations',    value: data.revenue,       pct: 100,                        type: 'revenue', bold: true },
    { label: 'Other Income',               value: data.other_income,  pct: data.other_income/data.total_income*100, type: 'sub' },
    { label: 'Total Income',               value: data.total_income,  pct: 100,                        type: 'subtotal', bold: true },
    { label: 'Less: Material Cost',        value: -data.material_cost,pct: data.material_cost/data.total_income*100,  type: 'cost' },
    { label: 'Less: Direct Project Cost',  value: -data.direct_cost,  pct: data.direct_cost/data.total_income*100,   type: 'cost' },
    { label: 'Less: Direct Labour',        value: -data.direct_labour,pct: data.direct_labour/data.total_income*100, type: 'cost' },
    { label: 'GROSS PROFIT',               value: data.gross_profit,  pct: data.gp_margin_pct,         type: 'subtotal', bold: true },
    { label: 'Less: Employee Cost',        value: -data.employee_cost,pct: data.employee_cost/data.total_income*100, type: 'opex' },
    { label: 'Less: Administrative Cost',  value: -data.admin_cost,   pct: data.admin_cost/data.total_income*100,    type: 'opex' },
    { label: 'EBITDA',                     value: data.ebitda,        pct: data.ebitda_margin_pct,     type: 'subtotal', bold: true },
    { label: 'Less: Finance Cost',         value: -data.finance_cost, pct: data.finance_cost/data.total_income*100,  type: 'finance' },
    { label: 'Less: Depreciation',         value: 0,                  pct: 0,                          type: 'finance' },
    { label: 'PBT',                        value: data.pat,           pct: data.pat_margin_pct,        type: 'subtotal', bold: true },
    { label: 'Tax',                        value: 0,                  pct: 0,                          type: 'finance' },
    { label: 'PAT (Net Profit/Loss)',       value: data.pat,           pct: data.pat_margin_pct,        type: 'total', bold: true },
  ] : []

  const ROW_BG: Record<string, string> = {
    revenue:  '#EFF6FF',
    subtotal: '#F0FFF4',
    total:    '#ECFDF5',
  }

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
            {loading ? 'Loading real data...' : `Real data · ${data?.total_vouchers?.toLocaleString('en-IN')} vouchers`}
          </span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
            Live from Supabase
          </span>
        </div>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        {/* KPI Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12, marginBottom:24 }}>
          {[
            { label:'Revenue',      value: loading ? '...' : formatCr(data?.revenue),      color:'#2563EB' },
            { label:'Gross Profit', value: loading ? '...' : formatCr(data?.gross_profit), color:'#059669', sub: loading ? '' : `${data?.gp_margin_pct}% margin` },
            { label:'EBITDA',       value: loading ? '...' : formatCr(data?.ebitda),       color:'#0891B2', sub: loading ? '' : `${data?.ebitda_margin_pct}% margin` },
            { label:'Finance Cost', value: loading ? '...' : formatCr(data?.finance_cost), color:'#D97706' },
            { label:'PAT',          value: loading ? '...' : formatCr(data?.pat),          color: data?.pat >= 0 ? '#059669' : '#DC2626', sub: loading ? '' : `${data?.pat_margin_pct}% margin` },
          ].map(k => (
            <div key={k.label} style={{
              background:'#fff', border:'1px solid #E5E7EB',
              borderRadius:12, padding:'14px 16px', borderTop:`3px solid ${k.color}`
            }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color:k.color }}>{k.value}</div>
              {k.sub && <div style={{ fontSize:10, color:'#6B7280', marginTop:3 }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:'20px', textAlign:'center', marginBottom:16 }}>
            <div style={{ fontSize:13, color:'#1D4ED8', fontWeight:600 }}>
              ⏳ Fetching all 30,490 vouchers from Supabase...
            </div>
            <div style={{ fontSize:11, color:'#6B7280', marginTop:4 }}>Processing in batches — takes 3-5 seconds</div>
          </div>
        )}

        {/* P&L Table */}
        {!loading && (
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
            <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13, display:'flex', justifyContent:'space-between' }}>
              <span>Profit & Loss Statement — FY 2025-26</span>
              <span style={{ fontSize:11, opacity:.7 }}>Real data · {data?.total_vouchers?.toLocaleString('en-IN')} vouchers</span>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#F8FAFC' }}>
                  <th style={{ padding:'8px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB', width:'45%' }}>MIS Head</th>
                  <th style={{ padding:'8px 16px', textAlign:'right', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB' }}>Amount (₹)</th>
                  <th style={{ padding:'8px 16px', textAlign:'right', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB' }}>% Income</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{
                    background: ROW_BG[row.type] || '#fff',
                    fontWeight: row.bold ? 700 : 400,
                    borderBottom: '0.5px solid #F3F4F6'
                  }}>
                    <td style={{
                      padding: `9px 16px 9px ${row.type === 'sub' ? 32 : 16}px`,
                      color: ['subtotal','total'].includes(row.type) ? '#1F3864' : '#374151',
                      fontSize: row.type === 'sub' ? 11 : 12,
                    }}>
                      {row.label}
                    </td>
                    <td style={{
                      padding:'9px 16px', textAlign:'right', fontFamily:'monospace',
                      color: row.value < 0 ? '#DC2626' : row.value === 0 ? '#9CA3AF' : '#111'
                    }}>
                      {row.value === 0 ? '—' : row.value < 0 ? `(₹${formatINR(row.value)})` : `₹${formatINR(row.value)}`}
                    </td>
                    <td style={{ padding:'9px 16px', textAlign:'right', fontSize:11, color:'#6B7280' }}>
                      {row.value === 0 ? '—' : `${Math.abs(row.pct).toFixed(1)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:12, padding:'14px 20px' }}>
            <div style={{ fontWeight:700, color:'#065F46', fontSize:12, marginBottom:4 }}>
              ✓ Real P&L — Computed from {data?.total_vouchers?.toLocaleString('en-IN')} actual Tally vouchers
            </div>
            <div style={{ fontSize:11, color:'#059669', lineHeight:1.7 }}>
              Revenue {formatCr(data?.revenue)} → Gross Profit {formatCr(data?.gross_profit)} ({data?.gp_margin_pct}%) →
              EBITDA {formatCr(data?.ebitda)} ({data?.ebitda_margin_pct}%) →
              PAT {formatCr(data?.pat)} ({data?.pat_margin_pct}%)<br/>
              Data source: Supabase PostgreSQL · Mumbai ap-south-1 · Upload ID: {UPLOAD_ID}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
