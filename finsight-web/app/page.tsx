export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F9FAFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: '#1F3864', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 28
        }}>📊</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1F3864', margin: '0 0 8px' }}>
          FinSight MIS
        </h1>
        <p style={{ color: '#6B7280', fontSize: 16, margin: '0 0 32px' }}>
          Tally XLS → Automated MIS Reports · SiyanTech Global Innovations
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/dashboard" style={{
            background: '#1F3864', color: '#fff',
            padding: '12px 24px', borderRadius: 8,
            textDecoration: 'none', fontWeight: 600, fontSize: 14
          }}>Open Dashboard</a>
          <a href="http://localhost:8000/docs" target="_blank" style={{
            background: '#fff', color: '#1F3864',
            padding: '12px 24px', borderRadius: 8,
            textDecoration: 'none', fontWeight: 600, fontSize: 14,
            border: '1px solid #1F3864'
          }}>API Docs</a>
        </div>
        <div style={{
          marginTop: 48, padding: '20px 32px',
          background: '#fff', borderRadius: 12,
          border: '1px solid #E5E7EB', display: 'inline-block'
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
            Backend: <span style={{ color: '#059669', fontWeight: 600 }}>http://localhost:8000</span>
            &nbsp;·&nbsp;
            Frontend: <span style={{ color: '#2563EB', fontWeight: 600 }}>http://localhost:3000</span>
          </p>
        </div>
      </div>
    </div>
  )
}
