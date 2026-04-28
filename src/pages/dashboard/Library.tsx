import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'

const FOLDERS = [
  { name: 'Por cuenta', count: '18 carpetas · 1.620 archivos' },
  { name: 'Stock — Marca propia', count: '142 archivos · logos, fuentes, paletas' },
  { name: 'Plantillas reusables', count: '38 archivos · reels, carruseles, stories' },
  { name: 'Papelera', count: '42 archivos · 30 días para recuperar' },
]

const ASSETS = [
  { kind: 'REEL', name: 'apertura-temporada-v3.mp4', account: 'DON TITO', when: 'HOY 12:14', play: true },
  { kind: 'CARR', name: '5-tips-emprender.psd', account: 'TALAMPAYA', when: 'HOY 09:30', play: false },
  { kind: 'POST', name: 'cliente-del-mes-rocio.jpg', account: 'BSAS CO.', when: 'AYER', play: false },
  { kind: 'STORY', name: 'promo-viernes-2x1.fig', account: 'EMPANADAS', when: 'AYER', play: false },
  { kind: 'RAW', name: 'DJI_0142.MOV', account: 'DON TITO', when: 'VIE 25 ABR', play: true },
  { kind: 'REEL', name: 'receta-semanal-14.mp4', account: 'CAFAYATE', when: 'VIE 25', play: true },
  { kind: 'POST', name: 'vino-del-mes-malbec.jpg', account: 'CAFAYATE', when: 'JUE 24', play: false },
  { kind: 'CARR', name: 'guia-barrios-palermo.fig', account: 'BSAS CO.', when: 'MIÉ 23', play: false },
  { kind: 'LOGO', name: 'don-tito-logo-v2.svg', account: 'DON TITO', when: 'MAR 22', play: false },
  { kind: 'PAUTA', name: 'brief-pampero-invierno.pdf', account: 'PAMPERO', when: 'MAR 22', play: false },
  { kind: 'REEL', name: 'behind-the-scenes-04.mp4', account: 'PAMPERO', when: 'LUN 21', play: true },
  { kind: 'POST', name: 'cafe-del-dia-cortado.jpg', account: 'CASA MATE', when: 'LUN 21', play: false },
]

const TYPE_FILTERS = ['Todo', 'Reels', 'Posts', 'Stories', 'Carruseles', 'Raw / sin editar']

export function Library() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Todo')

  const filtered = ASSETS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.account.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio Pampas', 'Biblioteca']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
              Importar de Drive
            </button>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>
              + Subir archivos
            </button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Biblioteca</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>1.842 archivos · 28,4 GB de 100 GB del plan · ordenados por última edición.</p>
        </div>

        {/* Folders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {FOLDERS.map((f) => (
            <div
              key={f.name}
              style={{
                background: 'var(--bg-1)',
                border: '1px solid var(--line-1)',
                borderRadius: 'var(--r-3)',
                padding: 14,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--line-3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-1)' }}
            >
              <div style={{ fontWeight: 500, fontSize: 13 }}>{f.name}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{f.count}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 16 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar archivo, cuenta, etiqueta…"
            style={{ maxWidth: 280, width: '100%', padding: '9px 12px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }}
          />
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                background: typeFilter === f ? 'var(--violet-soft)' : 'var(--bg-2)',
                border: `1px solid ${typeFilter === f ? 'transparent' : 'var(--line-2)'}`,
                borderRadius: 'var(--r-2)',
                fontSize: 12,
                color: typeFilter === f ? 'var(--violet-400)' : 'var(--fg-2)',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', fontSize: 12, color: 'var(--fg-2)', cursor: 'pointer' }}>
            + Filtro
          </button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {filtered.map((a) => (
            <div
              key={a.name}
              style={{
                background: 'var(--bg-1)',
                border: '1px solid var(--line-1)',
                borderRadius: 'var(--r-3)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--line-3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-1)' }}
            >
              <div
                style={{
                  aspectRatio: '1/1',
                  background: 'repeating-linear-gradient(45deg, var(--bg-2) 0 12px, var(--bg-3) 12px 24px)',
                  borderBottom: '1px solid var(--line-1)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--fg-3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    padding: '2px 6px',
                    borderRadius: 'var(--r-1)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'var(--fg-1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {a.kind}
                </span>
                {a.play ? (
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center', color: '#fff' }}>▶</div>
                ) : null}
              </div>
              <div style={{ padding: '10px 12px', fontSize: 12 }}>
                <div style={{ fontWeight: 500, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{a.account} · {a.when}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Mostrando {filtered.length} de 1.842
          </span>
          <div style={{ flex: 1 }} />
          <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
            Cargar más
          </button>
        </div>
      </div>
    </div>
  )
}
