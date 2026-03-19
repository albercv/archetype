// Report page — implementado en Tarea 9
export default function ReportPage({ params }: { params: Promise<{ sessionId: string }> }) {
  void params
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-cormorant), serif',
        fontSize: '1.25rem',
      }}
    >
      Informe — Próximamente
    </main>
  )
}
