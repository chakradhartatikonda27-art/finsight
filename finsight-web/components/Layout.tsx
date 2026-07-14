import Sidebar from './Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, background: '#F9FAFB' }}>
        {children}
      </div>
    </div>
  )
}
