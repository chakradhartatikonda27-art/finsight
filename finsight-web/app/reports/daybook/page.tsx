'use client'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'

const UPLOAD_ID = 'bb2ea540-b1a0-4f1f-b3d9-2cfb18d6ead1'
const VCH_TYPES = ['All','MSR Payment','MSR Purchase','MSR Journal','MSR Receipt','MSR Contra','MSR Credit Note']

const DARK = '#111827'
const GREY = '#6B7280'

function fmtINR(v: number): string {
  if (!v || v === 0) return '—'
  return v.toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

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
      ...(search ? { search } : {}),
      ...(vchType !== 'All' ? { vch_type: vchType } : {}),
    })
    fetch(`${API}/api/reports/real/daybook/${UPLOAD_ID}?${params}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }

  useEffect(() => { fetchData() }, [page, vchType])

  const VCH_COLORS: Record<string, string> = {
    'MSR Payment':     '#EFF6FF',
    'MSR Purchase':    '#FFF7ED',
    'MSR Journal':     '#F5F3FF',
    'MSR Receipt':     '#ECFDF5',
    'MSR Contra':      '#FFFBEB',
    'MSR Credit Note': '#FEF2F2',
  }

  const vouchers = data?.vouchers || []

  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Day Book</span>
          <span style={{ color:GREY, fontSize:12, marginLeft:12 }}>
            {data?.total?.toLocaleString('en-IN') || 0} real vouchers · FY 2025-26
          </span>
        </div>
        <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
          Live from Supabase
        </span>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
          <input
            type="text"
            placeholder="Search ledger name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key==='Enter' && (setPage(1), fetchData())}
            style={{ flex:1, minWidth:200, padding:'8px 14px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, outline:'none', color:DARK, background:'#fff' }}
          />
          <select
            value={vchType}
            onChange={e => { setVchType(e.target.value); setPage(1) }}
            style={{ padding:'8px 14px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, background:'#fff', color:DARK }}
          >
            {VCH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button
            onClick={() => { setSearch(''); setVchType('All'); setPage(1) }}
            style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, background:'#fff', cursor:'pointer', color:GREY }}
          >
            Clear
          </button>
          <button
            onClick={() => { setPage(1); fetchData() }}
            style={{ padding:'8px 16px', borderRadius:8, border:'none', fontSize:12, background:'#1F3864', cursor:'pointer', color:'#fff', fontWeight:600 }}
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13, display:'flex', justifyContent:'space-between' }}>
            <span>Day Book — Real Tally Vouchers</span>
            <span style={{ fontSize:11, opacity:.7 }}>
              Page {data?.page} of {data?.pages} · {data?.total?.toLocaleString('en-IN')} total
            </span>
          </div>

          {loading ? (
            <div style={{ padding:32, textAlign:'center', color:GREY }}>Loading from Supabase...</div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, tableLayout:'fixed' }}>
              <colgroup>
                <col style={{ width:'90px' }} />
                <col style={{ width:'25%' }} />
                <col style={{ width:'110px' }} />
                <col style={{ width:'130px' }} />
                <col style={{ width:'15%' }} />
                <col style={{ width:'110px' }} />
                <col style={{ width:'110px' }} />
              </colgroup>
              <thead>
                <tr style={{ background:'#F8FAFC' }}>
                  {['Date','Ledger Name','Vch Type','Vch No.','Cost Centre','Debit (₹)','Credit (₹)'].map(h => (
                    <th key={h} style={{ padding:'8px 10px', textAlign:['Debit (₹)','Credit (₹)'].includes(h)?'right':'left', fontSize:10, fontWeight:700, color:GREY, textTransform:'uppercase', borderBottom:'1px solid #E5E7EB', background:'#F8FAFC' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v: any) => (
                  <tr key={v.id} style={{ borderBottom:'1px solid #F3F4F6', background: '#fff' }}>
                    <td style={{ padding:'8px 10px', fontSize:11, color:DARK, background: '#fff', whiteSpace:'nowrap' }}>{v.txn_date}</td>
                    <td style={{ padding:'8px 10px', fontWeight:500, color:'#1F3864', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', background: '#fff' }} title={v.ledger_name}>
                      {v.ledger_name}
                    </td>
                    <td style={{ padding:'8px 10px', background: '#fff' }}>
                      <span style={{ fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:20, background:'rgba(0,0,0,0.06)', color:DARK }}>
                        {v.voucher_type}
                      </span>
                    </td>
                    <td style={{ padding:'8px 10px', fontSize:11, color:GREY, fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', background: '#fff' }}>{v.voucher_no}</td>
                    <td style={{ padding:'8px 10px', fontSize:11, color:GREY, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', background: '#fff' }}>{v.cost_centre || '—'}</td>
                    <td style={{ padding:'8px 10px', textAlign:'right', fontFamily:'monospace', fontSize:11, color: v.debit>0?DARK:GREY, fontWeight: v.debit>0?600:400, background: '#fff' }}>
                      {fmtINR(v.debit)}
                    </td>
                    <td style={{ padding:'8px 10px', textAlign:'right', fontFamily:'monospace', fontSize:11, color: v.credit>0?'#059669':GREY, fontWeight: v.credit>0?600:400, background: '#fff' }}>
                      {fmtINR(v.credit)}
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
            disabled={page===1}
            style={{ padding:'7px 18px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, background: page===1?'#F3F4F6':'#fff', cursor: page===1?'default':'pointer', color: page===1?GREY:'#1F3864', fontWeight:600 }}
          >← Prev</button>
          <span style={{ fontSize:12, color:GREY, minWidth:120, textAlign:'center' }}>
            Page {data?.page} of {data?.pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data?.pages||1, p+1))}
            disabled={page>=(data?.pages||1)}
            style={{ padding:'7px 18px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, background: page>=(data?.pages||1)?'#F3F4F6':'#fff', cursor: page>=(data?.pages||1)?'default':'pointer', color: page>=(data?.pages||1)?GREY:'#1F3864', fontWeight:600 }}
          >Next →</button>
        </div>

      </div>
    </Layout>
  )
}
