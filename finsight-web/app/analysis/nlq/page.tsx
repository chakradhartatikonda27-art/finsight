'use client'
import { useState, useRef } from 'react'
import Layout from '../../../components/Layout'

const SUGGESTIONS = [
  'Which site had the lowest GP margin?',
  'Why is net profit negative despite positive EBITDA?',
  'What is our combined OD utilisation?',
  'Top 5 vendors by outstanding amount',
  'How much GST is payable this month?',
  'Show revenue vs budget variance',
]

interface Msg { role:'user'|'ai'; text:string }

export default function NLQPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role:'ai', text:"Hello! I'm FinSight AI, powered by Claude. I have access to Mudduluru Infratech's FY 2025-26 data — 30,490 vouchers, 1,406 ledgers, 6 cost centres.\n\nAsk me anything about your finances in plain English." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const send = async (q?: string) => {
    const question = q || input.trim()
    if (!question) return
    setInput('')
    setMsgs(m => [...m, { role:'user', text:question }])
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-6',
          max_tokens:1000,
          system:`You are FinSight AI for Mudduluru Infratech Pvt. Ltd. (KA), Indian road construction. FY 2025-26 data:
Revenue: ₹56.87 Cr | GP: ₹11.52 Cr (20.3%) | EBITDA: ₹4.63 Cr (8.1%) | PAT: (₹87.91 L) (-1.5%)
Finance Cost: ₹3.70 Cr | Cash: ₹2.31 Cr | Debtors: ₹13.43 Cr | Creditors: ₹36.70 Cr
HDFC OD: ₹15 Cr / ₹20 Cr (75%) | KVB OD: ₹10.83 Cr / ₹12.6 Cr (86%) | Combined: 79.2%
Sites: NIT-15 Tayalur 0.9% AT RISK, NIT-22 Mangalore 18.4%, NIT-25 Vaddahalli 22.1%, NIT-27 Bellur 15.4%, NIT-28 Narasapura 5.8%, Corporate-KA 41.4%
30/30 checks passed. Answer concisely with specific ₹ figures.`,
          messages:[{ role:'user', content:question }],
        }),
      })
      const data = await res.json()
      const answer = data.content?.[0]?.text || 'Unable to generate answer. Please try again.'
      setMsgs(m => [...m, { role:'ai', text:answer }])
    } catch {
      setMsgs(m => [...m, { role:'ai', text:'Error connecting to Claude AI. Please try again.' }])
    }
    setLoading(false)
    setTimeout(() => endRef.current?.scrollIntoView({ behavior:'smooth' }), 100)
  }

  return (
    <Layout>
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <span style={{ fontWeight:700, color:'#1F3864', fontSize:14 }}>Ask FinSight AI</span>
          <span style={{ color:'#6B7280', fontSize:12, marginLeft:12 }}>Plain English questions · Claude AI answers from your Tally data</span>
        </div>
        <span style={{ fontSize:11, background:'#F5F3FF', color:'#7C3AED', padding:'4px 12px', borderRadius:20, fontWeight:700, border:'1px solid #DDD6FE' }}>⬡ Powered by Claude</span>
      </div>
      <div style={{ padding:'24px', fontFamily:'system-ui' }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ padding:'6px 14px', background:'#F5F3FF', color:'#7C3AED', border:'1px solid #DDD6FE', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer' }}>{s}</button>
          ))}
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', minHeight:480 }}>
          <div style={{ background:'linear-gradient(135deg,#F5F3FF,#EFF6FF)', padding:'12px 18px', borderBottom:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, background:'#7C3AED', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'#7C3AED' }}>FinSight AI <span style={{ fontSize:9, background:'#7C3AED', color:'#fff', padding:'1px 7px', borderRadius:10, marginLeft:5 }}>Claude</span></div>
              <div style={{ fontSize:10, color:'#6B7280' }}>Answers from Mudduluru Infratech FY 2025-26 data</div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:18, display:'flex', flexDirection:'column', gap:14, minHeight:340 }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', gap:10 }}>
                {m.role==='ai' && (
                  <div style={{ width:26, height:26, background:'#7C3AED', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  </div>
                )}
                <div style={{ background: m.role==='user'?'#2563EB':'#F3F4F6', color: m.role==='user'?'#fff':'#111', borderRadius: m.role==='user'?'12px 0 12px 12px':'0 12px 12px 12px', padding:'10px 14px', maxWidth:480, fontSize:12, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ width:26, height:26, background:'#7C3AED', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                </div>
                <div style={{ background:'#F3F4F6', borderRadius:'0 12px 12px 12px', padding:'10px 14px', fontSize:12, color:'#6B7280' }}>Analysing your financial data...</div>
              </div>
            )}
            <div ref={endRef}/>
          </div>
          <div style={{ padding:'14px 18px', borderTop:'1px solid #E5E7EB', background:'#F9FAFB', display:'flex', gap:10 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything... e.g. Why is NIT-15 margin so low?" style={{ flex:1, padding:'10px 14px', border:'1px solid #E5E7EB', borderRadius:10, fontSize:13, outline:'none', background:'#fff' }}/>
            <button onClick={()=>send()} disabled={loading} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#2563EB,#7C3AED)', color:'#fff', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', opacity:loading?0.7:1 }}>Ask AI</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
