'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { group:'Platform', items:[
    { href:'/',                          label:'Home / Upload',        icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href:'/dashboard',                 label:'CFO Dashboard',        icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ]},
  { group:'Financials', items:[
    { href:'/reports/pl',                label:'P&L Statement',        icon:'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { href:'/reports/bs',                label:'Balance Sheet',        icon:'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
    { href:'/reports/cf',                label:'Cash Flow',            icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href:'/reports/sites',             label:'Site P&L',             icon:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { href:'/reports/opening-balances',  label:'Opening Balances',     icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ]},
  { group:'Reports', items:[
    { href:'/reports/trial',             label:'Trial Balance',        icon:'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { href:'/reports/daybook',           label:'Day Book',             icon:'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { href:'/reports/gst',               label:'GST Reconciliation',   icon:'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
    { href:'/reports/vendor-ledger',     label:'Vendor Ledger',        icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { href:'/reports/mis-reports',       label:'Download MIS Pack',    icon:'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', badge:'PPT' },
  ]},
  { group:'Analysis', items:[
    { href:'/analysis/bva',              label:'Budget vs Actual',     icon:'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
    { href:'/analysis/yoy',              label:'Year-on-Year',         icon:'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { href:'/analysis/nlq',              label:'Ask FinSight AI',      icon:'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', badge:'AI' },
  ]},
  { group:'Tools', items:[
    { href:'/upload',                    label:'Upload Files',         icon:'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { href:'/mapping',                   label:'Ledger Mapping',       icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', badge:'AI' },
    { href:'/validation',                label:'Validation Engine',    icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href:'/tools/bank-recon',          label:'Bank Reconciliation',  icon:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', badge:'New' },
    { href:'/tools/stock-recon',         label:'Stock Reconciliation', icon:'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', badge:'New' },
    { href:'/tools/multi-period',        label:'Multi-Period',         icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2', badge:'New' },
    { href:'/tools/alerts',              label:'WhatsApp Alerts',      icon:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { href:'/tools/schedule',            label:'Scheduled Reports',    icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <nav style={{ position:'fixed', top:0, left:0, bottom:0, width:220, background:'#1F3864', display:'flex', flexDirection:'column', zIndex:50, fontFamily:'system-ui' }}>
      <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid rgba(255,255,255,.1)' }}>
        <div style={{ color:'#fff', fontSize:15, fontWeight:700 }}>FinSight MIS</div>
        <div style={{ color:'rgba(255,255,255,.5)', fontSize:10, marginTop:2 }}>SiyanTech Global Innovations</div>
      </div>
      <div style={{ padding:'6px 10px', borderBottom:'1px solid rgba(255,255,255,.1)' }}>
        <select style={{ width:'100%', background:'rgba(255,255,255,.1)', color:'#fff', border:'1px solid rgba(255,255,255,.2)', borderRadius:7, padding:'5px 8px', fontSize:11, cursor:'pointer' }}>
          <option>Mudduluru Infratech (KA)</option>
          <option>Mudduluru Infratech (AP)</option>
          <option>Consolidated</option>
        </select>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
        {NAV.map(g => (
          <div key={g.group}>
            <div style={{ padding:'10px 8px 4px', fontSize:9, fontWeight:600, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.09em' }}>{g.group}</div>
            {g.items.map(item => (
              <Link key={item.href} href={item.href} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', margin:'1px 6px', borderRadius:7, fontSize:12, fontWeight:500, color: pathname===item.href?'#fff':'rgba(255,255,255,.7)', background: pathname===item.href?'rgba(255,255,255,.15)':'transparent', textDecoration:'none', transition:'all .12s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                  <path d={item.icon}/>
                </svg>
                {item.label}
                {(item as any).badge && <span style={{ marginLeft:'auto', fontSize:9, background:'#2563EB', color:'#fff', padding:'1px 6px', borderRadius:20 }}>{(item as any).badge}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:'10px 14px', borderTop:'1px solid rgba(255,255,255,.1)' }}>
        <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', lineHeight:1.6 }}>30 checks · All passing ✓<br/>TB001 DR=CR=₹560.51 Cr</div>
      </div>
    </nav>
  )
}
