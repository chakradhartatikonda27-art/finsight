'use client'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'

const UPLOAD_ID = 'bb2ea540-b1a0-4f1f-b3d9-2cfb18d6ead1'

const VCH_TYPES = ['All','MSR Payment','MSR Purchase','MSR Journal','MSR Receipt','MSR Contra','MSR Credit Note']

export default function DayBookPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [vchType, setVchType] = useState('All')
  const [page, setPage] = useState(1)

  const fetchData = () => {
    setLoading(true)
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const params = new URLSearchParams({
      page: String(page),
      limit: '50',
      ...(search  ? { search }   : {}),
      ...(vchType !== 'All' ? { vch_type: vchType } : {}),
    })
    fetch(`${API}/api/reports/real/daybook/${UPLOAD_ID}?${params}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }

  useEffect(() => { fetchData() }, [page, vchType])
  useEffect(() => { setPage(1); fetchData() }, [search])

  const vouchers = data?.vouchers || []

  const VCH_COLORS: Record<string, string> = {
    'MSR Payment':     '#EFF6FF',
    'MSR Purchase':    '#FFF7ED',
    'MSR Journal':     '#F5F3FF',
    'MSR Receipt':     '#ECFDF5',
    'MSR Contra':      '#FFFBEB',
    'MSR Credit Note': '#FEF2F2',
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
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Day Book</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>
            {data?.total?.toLocaleString('en-IN') || 0} real vouchers · FY 2025-26
          </span>
        </div>
        <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
          Live from Supabase
        </span>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        {/* Filters */}
        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          <input
            type="text"
            placeholder="Search ledger name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex:1, minWidth:200, padding:'8px 14px', borderRadius:8,
              border:'1px solid #E5E7EB', fontSize:13, outline:'none'
            }}
          />
          <select
            value={vchType}
            onChange={e => { setVchType(e.target.value); setPage(1) }}
            style={{ padding:'8px 14px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, background:'#fff' }}
          >
            {VCH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button
            onClick={() => { setSearch(''); setVchType('All'); setPage(1) }}
            style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, background:'#fff', cursor:'pointer', color:'#6B7280' }}
          >
            Clear
          </button>
        </div>

        {/* Voucher table */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13, display:'flex', justifyContent:'space-between' }}>
            <span>Day Book — Real Tally Vouchers</span>
            <span style={{ fontSize:11, fontWeight:400, opacity:.7 }}>
              Page {data?.page} of {data?.pages} · {data?.total?.toLocaleString('en-IN')} total
            </span>
          </div>

          {loading ? (
            <div style={{ padding:32, textAlign:'center', color:'#6B7280' }}>Loading from Supabase...</div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#F8FAFC' }}>
                  {['Date','Ledger Name','Vch Type','Vch No.','Cost Centre','Debit (₹)','Credit (₹)'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign: ['Debit (₹)','Credit (₹)'].includes(h) ? 'right' : 'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v: any, i: number) => (
                  <tr key={v.id} style={{ borderBottom:'0.5px solid #F3F4F6', background: VCH_COLORS[v.voucher_type] || '#fff' }}>
                    <td style={{ padding:'8px 12px', fontSize:11, color:'#6B7280', whiteSpace:'nowrap' }}>{v.txn_date}</td>
                    <td style={{ padding:'8px 12px', fontWeight:500, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.ledger_name}</td>
                    <td style={{ padding:'8px 12px' }}>
                      <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:'rgba(0,0,0,0.06)' }}>
                        {v.voucher_type}
                      </span>
                    </td>
                    <td style={{ padding:'8px 12px', fontSize:11, color:'#6B7280', fontFamily:'monospace' }}>{v.voucher_no}</td>
                    <td style={{ padding:'8px 12px', fontSize:11, color:'#6B7280' }}>{v.cost_centre || '—'}</td>
                    <td style={{ padding:'8px 12px', textAlign:'right', fontFamily:'monospace', color: v.debit > 0 ? '#1F3864' : '#9CA3AF' }}>
                      {v.debit > 0 ? v.debit.toLocaleString('en-IN', {minimumFractionDigits:2}) : '—'}
                    </td>
                    <td style={{ padding:'8px 12px', textAlign:'right', fontFamily:'monospace', color: v.credit > 0 ? '#059669' : '#9CA3AF' }}>
                      {v.credit > 0 ? v.credit.toLocaleString('en-IN', {minimumFractionDigits:2}) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, alignItems:'center' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p-1))}
            disabled={page === 1}
            style={{ padding:'6px 16px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, background: page === 1 ? '#F3F4F6' : '#fff', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#9CA3AF' : '#1F3864' }}
          >
            ← Prev
          </button>
          <span style={{ fontSize:12, color:'#6B7280' }}>
            Page {data?.page} of {data?.pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data?.pages || 1, p+1))}
            disabled={page >= (data?.pages || 1)}
            style={{ padding:'6px 16px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, background: page >= (data?.pages || 1) ? '#F3F4F6' : '#fff', cursor: page >= (data?.pages || 1) ? 'default' : 'pointer', color: page >= (data?.pages || 1) ? '#9CA3AF' : '#1F3864' }}
          >
            Next →
          </button>
        </div>

      </div>
    </Layout>
  )
}
