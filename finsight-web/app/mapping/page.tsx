'use client'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

export default function MappingPage() {
  const [data, setData] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all')

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${API}/api/mapping/mudduluru-ka`)
      .then(r => r.json())
      .then(setData)
  }, [])

  const mappings = data?.sample_mappings || []
  const filtered = filter === 'all' ? mappings
    : filter === 'confirmed' ? mappings.filter((m: any) => m.confirmed)
    : mappings.filter((m: any) => !m.confirmed)

  const SOURCES: Record<string, { label: string; color: string; bg: string }> = {
    rule_engine:  { label: 'Rule Engine',  color: '#1D4ED8', bg: '#EFF6FF' },
    claude_haiku: { label: 'Claude AI',    color: '#7C3AED', bg: '#F5F3FF' },
    confirmed:    { label: 'Confirmed',    color: '#059669', bg: '#ECFDF5' },
    unmapped:     { label: 'Unmapped',     color: '#DC2626', bg: '#FEF2F2' },
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
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Ledger Mapping</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>
            AI maps Tally ledgers to MIS heads · CA confirms
          </span>
        </div>
        <span style={{ background:'#ECFDF5', color:'#059669', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
          {data?.confirmed || 2084} confirmed · {data?.pending_ca_review || 71} pending
        </span>
      </div>

      <div style={{ padding:'24px', fontFamily:'system-ui' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:24 }}>
          {[
            { label:'Total Ledgers',    value: data?.total_ledgers || 2167,      color:'#1F3864' },
            { label:'Confirmed',        value: data?.confirmed || 2084,           color:'#059669' },
            { label:'Pending CA Review',value: data?.pending_ca_review || 71,    color:'#D97706' },
            { label:'Unmapped',         value: data?.unmapped || 12,             color:'#DC2626' },
          ].map(k => (
            <div key={k.label} style={{
              background:'#fff', border:'1px solid #E5E7EB',
              borderRadius:12, padding:'14px 16px', borderTop:`3px solid ${k.color}`
            }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>{k.label}</div>
              <div style={{ fontSize:28, fontWeight:800, color:k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:'14px 20px', marginBottom:20 }}>
          <div style={{ fontWeight:700, color:'#1D4ED8', fontSize:12, marginBottom:6 }}>How AI Ledger Mapping works</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, fontSize:11, color:'#1D4ED8' }}>
            <div><strong>Step 1 — Rule Engine (free)</strong><br/>Maps 90% of ledgers instantly using Tally group hierarchy. "Sales Accounts" → Revenue. "Bank OD A/c" → Current Liability.</div>
            <div><strong>Step 2 — Claude Haiku (AI)</strong><br/>Handles edge cases the rule engine can't classify. "Hire Charges Paver" → Direct Cost. ~₹1.68 per full mapping run.</div>
            <div><strong>Step 3 — CA Confirms</strong><br/>You review all suggestions and click Confirm. Confirmed mappings are reused on every future upload. Zero re-work.</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {(['all','confirmed','pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'6px 16px', borderRadius:20, border:'1px solid #E5E7EB',
              background: filter === f ? '#1F3864' : '#fff',
              color: filter === f ? '#fff' : '#6B7280',
              fontSize:12, fontWeight:600, cursor:'pointer'
            }}>
              {f === 'all' ? 'All Mappings' : f === 'confirmed' ? 'Confirmed' : 'Pending Review'}
            </button>
          ))}
        </div>

        {/* Mappings table */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1F3864', padding:'12px 16px', color:'#fff', fontWeight:700, fontSize:13 }}>
            Ledger Mappings — 2,167 total
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Ledger Name','Tally Group','MIS Head','Confidence','Source','Status','Action'].map(h => (
                  <th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m: any, i: number) => {
                const src = m.confirmed ? SOURCES.confirmed : SOURCES.claude_haiku
                return (
                  <tr key={i} style={{ borderBottom:'0.5px solid #F3F4F6' }}>
                    <td style={{ padding:'10px 14px', fontWeight:500 }}>{m.ledger_name}</td>
                    <td style={{ padding:'10px 14px', color:'#6B7280', fontSize:11 }}>{m.tally_group}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ background:'#F0FFF4', color:'#059669', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:600 }}>
                        {m.mis_head}
                      </span>
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ flex:1, height:4, background:'#F3F4F6', borderRadius:2, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${m.confidence}%`, background: m.confidence >= 90 ? '#059669' : m.confidence >= 70 ? '#D97706' : '#DC2626', borderRadius:2 }}/>
                        </div>
                        <span style={{ fontSize:11, fontWeight:600, color:'#374151', minWidth:28 }}>{m.confidence}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:src.bg, color:src.color }}>
                        {m.confirmed ? 'Confirmed' : 'Claude AI'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      {m.confirmed
                        ? <span style={{ color:'#059669', fontSize:11, fontWeight:600 }}>✓ Confirmed</span>
                        : <span style={{ color:'#D97706', fontSize:11, fontWeight:600 }}>⏳ Pending</span>
                      }
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      {!m.confirmed && (
                        <button style={{
                          background:'#059669', color:'#fff', border:'none',
                          borderRadius:6, padding:'4px 12px', fontSize:11,
                          fontWeight:600, cursor:'pointer'
                        }}>
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Critical rule note */}
        <div style={{ marginTop:16, background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:12, padding:'14px 20px' }}>
          <div style={{ fontWeight:700, color:'#991B1B', fontSize:12, marginBottom:4 }}>
            Critical Rule — Bank OD must be Current Liability
          </div>
          <div style={{ fontSize:11, color:'#DC2626', lineHeight:1.7 }}>
            HDFC Bank OD (KA-2341001) and KVB Bank OD (KA-2341002) are mapped to <strong>Bank OD → Current Liability</strong>.<br/>
            If mapped to Bank Balance (Current Asset) instead, the Balance Sheet overstates net worth by ₹51.66 Cr.<br/>
            Check LM002 verifies this automatically before every report.
          </div>
        </div>

      </div>
    </Layout>
  )
}
