'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    group: 'Platform',
    items: [
      { href: '/',              label: 'Home' },
      { href: '/dashboard',     label: 'CFO Dashboard' },
    ]
  },
  {
    group: 'Financials',
    items: [
      { href: '/reports/pl',    label: 'P&L Statement' },
      { href: '/reports/bs',    label: 'Balance Sheet' },
      { href: '/reports/cf',    label: 'Cash Flow' },
      { href: '/reports/sites', label: 'Site P&L' },
    ]
  },
  {
    group: 'Reports',
    items: [
      { href: '/reports/gst',   label: 'GST Reconciliation' },
      { href: '/reports/trial', label: 'Trial Balance' },
      { href: '/reports/daybook',label: 'Day Book' },
    ]
  },
  {
    group: 'Tools',
    items: [
      { href: '/upload',        label: 'Upload Files' },
      { href: '/mapping',       label: 'Ledger Mapping' },
      { href: '/validation',    label: 'Validation Engine' },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 220,
      background: '#1F3864', display: 'flex', flexDirection: 'column',
      zIndex: 50, fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>FinSight MIS</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 }}>SiyanTech Global Innovations</div>
      </div>

      {/* Company switcher */}
      <div style={{ padding: '10px 10px 6px' }}>
        <select style={{
          width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 7, color: '#fff', fontSize: 11, padding: '6px 8px', cursor: 'pointer'
        }}>
          <option>Mudduluru Infratech (KA)</option>
          <option>Mudduluru Infratech (AP)</option>
          <option>Consolidated</option>
        </select>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {NAV.map(section => (
          <div key={section.group}>
            <div style={{
              padding: '10px 14px 4px', fontSize: 9, fontWeight: 700,
              color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.09em'
            }}>
              {section.group}
            </div>
            {section.items.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', padding: '7px 12px',
                  margin: '1px 6px', borderRadius: 7, textDecoration: 'none',
                  fontSize: 12, fontWeight: 500,
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                  transition: 'all .12s'
                }}>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
          FY 2025-26 · 26/26 checks ✓<br />
          Balance Sheet diff ₹0.00
        </div>
      </div>
    </div>
  )
}
