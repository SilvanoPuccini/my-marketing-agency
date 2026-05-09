import { useState, useRef } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useFiltersStore } from '@/stores/filters.store'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { Download, X } from 'lucide-react'
import {
  useLibraryFiles,
  useLibraryFolders,
  useUploadFiles,
  usePiecesForUpload,
  type LibraryFile,
} from '@/features/library/hooks/useLibrary'

// ─── Helpers ──────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ayer'
  return `hace ${days} d`
}

function isVideo(file: LibraryFile): boolean {
  if (file.file_type.includes('video')) return true
  const ext = file.file_name.split('.').pop()?.toLowerCase() ?? ''
  return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext)
}

function isImage(file: LibraryFile): boolean {
  if (file.file_type.includes('image')) return true
  const ext = file.file_name.split('.').pop()?.toLowerCase() ?? ''
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)
}

function isAudio(file: LibraryFile): boolean {
  if (file.file_type.includes('audio')) return true
  const ext = file.file_name.split('.').pop()?.toLowerCase() ?? ''
  return ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(ext)
}

function kindLabel(pieceType: string): string {
  const map: Record<string, string> = {
    post: 'POST',
    reel: 'REEL',
    story: 'STORY',
    ad: 'AD',
    blog: 'BLOG',
    carrusel: 'CARR',
  }
  return map[pieceType] ?? pieceType.toUpperCase().slice(0, 4)
}

const TYPE_FILTERS = ['Todo', 'Reels', 'Posts', 'Stories', 'Carruseles', 'Raw / sin editar'] as const

function typeFilterToPieceType(filter: string): string | null {
  const map: Record<string, string | null> = {
    'Todo': null,
    'Reels': 'reel',
    'Posts': 'post',
    'Stories': 'story',
    'Carruseles': 'carrusel',
    'Raw / sin editar': '__raw__',
  }
  return map[filter] ?? null
}

const KNOWN_TYPES = ['post', 'reel', 'story', 'ad', 'blog', 'carrusel']

// ─── File Viewer Modal ───────────────────────────────────────

function FileViewerModal({ file, onClose }: { file: LibraryFile; onClose: () => void }) {
  const isVid = isVideo(file)
  const isImg = isImage(file)
  const isAud = isAudio(file)

  function handleDownload() {
    const a = document.createElement('a')
    a.href = file.file_url
    a.download = file.file_name
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--bg-1)', border: '1px solid var(--line-2)',
        borderRadius: 14, overflow: 'hidden', maxWidth: 900, width: '100%',
        maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderBottom: '1px solid var(--line-1)',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{file.file_name}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
              {file.account_name} · {file.piece_title} · {kindLabel(file.piece_type)} · {file.file_size_kb} KB
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDownload}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', fontSize: 12, fontWeight: 500,
                color: 'var(--fg-1)', borderRadius: 'var(--r-2)',
                border: '1px solid var(--line-2)', background: 'var(--bg-2)',
                cursor: 'pointer',
              }}
            >
              <Download size={12} />
              Descargar
            </button>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, background: 'var(--bg-2)',
                border: '1px solid var(--line-2)', borderRadius: 6,
                color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer',
              }}
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, overflow: 'auto', background: 'var(--bg-0)',
        }}>
          {isImg && (
            <img
              src={file.file_url}
              alt={file.file_name}
              style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 200px)', objectFit: 'contain', borderRadius: 8 }}
            />
          )}
          {isVid && (
            <video
              src={file.file_url}
              controls
              autoPlay
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 200px)',
                borderRadius: 8,
                background: '#000',
              }}
            />
          )}
          {isAud && (
            <div style={{ width: '100%', maxWidth: 500, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>{file.file_name}</div>
              <audio src={file.file_url} controls autoPlay style={{ width: '100%' }} />
            </div>
          )}
          {!isImg && !isVid && !isAud && (
            <div style={{ textAlign: 'center', color: 'var(--fg-3)', fontSize: 14 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
              Vista previa no disponible para este tipo de archivo.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Upload Modal ─────────────────────────────────────────────

interface UploadModalProps {
  files: File[]
  onClose: () => void
}

const PIECE_TYPES = ['post', 'reel', 'story', 'carrusel', 'ad', 'blog'] as const

function UploadModal({ files, onClose }: UploadModalProps) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing')

  const [pieceId, setPieceId] = useState('')
  const pieces = usePiecesForUpload()

  const [newTitle, setNewTitle] = useState('')
  const [newAccountId, setNewAccountId] = useState('')
  const [newType, setNewType] = useState<typeof PIECE_TYPES[number]>('post')
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)

  const upload = useUploadFiles()
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)

  function handleModeNew() {
    setMode('new')
    if (accounts.length === 0) {
      setAccountsLoading(true)
      supabase
        .from('accounts')
        .select('id, name')
        .order('name')
        .then(({ data }) => {
          setAccounts(data ?? [])
          if (data && data.length > 0) setNewAccountId(data[0].id)
          setAccountsLoading(false)
        })
    }
  }

  async function handleSubmit() {
    if (mode === 'existing') {
      if (!pieceId) {
        toast.error('Seleccioná una pieza')
        return
      }
      upload.mutate({ files, pieceId }, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['pieces-for-upload'] })
          onClose()
        },
      })
    } else {
      if (!newTitle.trim()) {
        toast.error('El título es requerido')
        return
      }
      if (!newAccountId) {
        toast.error('Seleccioná una cuenta')
        return
      }

      const { data: piece, error } = await supabase
        .from('pieces')
        .insert({
          title: newTitle.trim(),
          type: newType,
          account_id: newAccountId,
          scheduled_date: newDate,
          status: 'draft',
          author_id: user!.id,
        })
        .select('id')
        .single()

      if (error) {
        toast.error('Error al crear la pieza')
        return
      }

      upload.mutate({ files, pieceId: piece.id }, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['pieces-for-upload'] })
          onClose()
        },
      })
    }
  }

  const isDisabled =
    upload.isPending ||
    (mode === 'existing' && !pieceId) ||
    (mode === 'new' && (!newTitle.trim() || !newAccountId))

  const modalInputStyle = {
    padding: '8px 10px',
    fontSize: 13,
    background: 'var(--bg-2)',
    border: '1px solid var(--line-2)',
    borderRadius: 'var(--r-2)',
    color: 'var(--fg-1)',
    outline: 'none',
    width: '100%',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: 'var(--bg-1)', border: '1px solid var(--line-2)',
          borderRadius: 'var(--r-3)', padding: 24, width: 420,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
          Subir {files.length} archivo{files.length !== 1 ? 's' : ''}
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: 3, gap: 3 }}>
          {(['existing', 'new'] as const).map((m) => (
            <button
              key={m}
              onClick={() => m === 'existing' ? setMode('existing') : handleModeNew()}
              style={{
                flex: 1, padding: '6px 10px', fontSize: 12, fontWeight: 500,
                borderRadius: 'calc(var(--r-2) - 2px)', border: 'none', cursor: 'pointer',
                background: mode === m ? 'var(--bg-1)' : 'transparent',
                color: mode === m ? 'var(--fg-1)' : 'var(--fg-3)',
                boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {m === 'existing' ? 'Pieza existente' : 'Crear nueva pieza'}
            </button>
          ))}
        </div>

        {mode === 'existing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 500 }}>Adjuntar a la pieza</label>
            <select value={pieceId} onChange={(e) => setPieceId(e.target.value)} style={modalInputStyle}>
              <option value="">— Seleccioná una pieza —</option>
              {pieces.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}{p.account_name ? ` (${p.account_name})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === 'new' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 500 }}>
                Título <span style={{ color: 'var(--violet-400)' }}>*</span>
              </label>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Nombre de la pieza" style={modalInputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 500 }}>
                Cuenta <span style={{ color: 'var(--violet-400)' }}>*</span>
              </label>
              <select value={newAccountId} onChange={(e) => setNewAccountId(e.target.value)} disabled={accountsLoading} style={modalInputStyle}>
                {accountsLoading
                  ? <option>Cargando...</option>
                  : accounts.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))
                }
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <label style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 500 }}>Tipo</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value as typeof PIECE_TYPES[number])} style={modalInputStyle}>
                  {PIECE_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <label style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 500 }}>Fecha programada</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={modalInputStyle} />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 120, overflowY: 'auto' }}>
          {files.map((f) => (
            <div key={f.name} className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', padding: '3px 0', borderBottom: '1px solid var(--line-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {f.name}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 14px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{
              padding: '7px 14px', fontSize: 12, fontWeight: 500, color: '#fff',
              borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)',
              background: isDisabled ? 'var(--bg-3)' : 'var(--violet-500)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {upload.isPending ? 'Subiendo...' : 'Subir'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Library Page ─────────────────────────────────────────────

const PAGE_SIZE = 20

export function Library() {
  const { librarySearch, libraryTypeFilter, setLibrarySearch, setLibraryTypeFilter } = useFiltersStore()
  const [localTypeFilter, setLocalTypeFilter] = useState('Todo')
  const [accountFilter, setAccountFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null)
  const [viewingFile, setViewingFile] = useState<LibraryFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filesQuery = useLibraryFiles()
  const foldersQuery = useLibraryFolders()

  const allFiles = filesQuery.data ?? []
  const allFolders = foldersQuery.data ?? []

  // Apply filters
  const pieceTypeTarget = typeFilterToPieceType(localTypeFilter)

  const filtered = allFiles.filter((f) => {
    const matchesSearch =
      !librarySearch ||
      f.file_name.toLowerCase().includes(librarySearch.toLowerCase()) ||
      f.account_name.toLowerCase().includes(librarySearch.toLowerCase()) ||
      f.piece_title.toLowerCase().includes(librarySearch.toLowerCase())

    const matchesType =
      pieceTypeTarget === null ||
      (pieceTypeTarget === '__raw__'
        ? !KNOWN_TYPES.includes(f.piece_type)
        : f.piece_type === pieceTypeTarget)

    const matchesStore =
      libraryTypeFilter === 'all' || f.piece_type === libraryTypeFilter

    const matchesAccount =
      !accountFilter || f.account_id === accountFilter

    return matchesSearch && matchesType && matchesStore && matchesAccount
  })

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = filtered.length > visible.length

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) setPendingFiles(files)
    e.target.value = ''
  }

  function handleTypeFilter(label: string) {
    setLocalTypeFilter(label)
    setPage(1)
    const mapped = typeFilterToPieceType(label)
    if (mapped === null || mapped === '__raw__') {
      setLibraryTypeFilter('all')
    } else {
      setLibraryTypeFilter(mapped as Parameters<typeof setLibraryTypeFilter>[0])
    }
  }

  function handleAccountFilter(accountId: string) {
    setAccountFilter((prev) => prev === accountId ? null : accountId)
    setPage(1)
  }

  function handleSearch(value: string) {
    setLibrarySearch(value)
    setPage(1)
  }

  function handleDownload(file: LibraryFile) {
    const a = document.createElement('a')
    a.href = file.file_url
    a.download = file.file_name
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio', 'Biblioteca']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
            >
              + Subir archivos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />
          </div>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Biblioteca</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
            {filesQuery.isLoading
              ? 'Cargando archivos...'
              : `${allFiles.length} archivos · ordenados por última subida.`}
          </p>
        </div>

        {/* Folders — clickeables para filtrar */}
        {foldersQuery.isLoading ? (
          <div className="library-folders" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', padding: 14, height: 56 }} />
            ))}
          </div>
        ) : allFolders.length > 0 ? (
          <div className="library-folders" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {allFolders.map((f) => {
              const isActive = accountFilter === f.account_id
              return (
                <div
                  key={f.account_id}
                  onClick={() => handleAccountFilter(f.account_id)}
                  style={{
                    background: isActive ? 'var(--violet-soft)' : 'var(--bg-1)',
                    border: `1px solid ${isActive ? 'var(--violet-400)' : 'var(--line-1)'}`,
                    borderRadius: 'var(--r-3)', padding: 14, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = 'var(--line-3)' }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = 'var(--line-1)' }}
                >
                  <div style={{ fontWeight: 500, fontSize: 13, color: isActive ? 'var(--violet-400)' : 'var(--fg-1)' }}>
                    {f.account_name}
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                    {f.file_count} archivo{f.file_count !== 1 ? 's' : ''}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 16, flexWrap: 'wrap' }}>
          <input
            value={librarySearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar archivo, cuenta, pieza..."
            style={{ maxWidth: 280, width: '100%', padding: '9px 12px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }}
          />
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleTypeFilter(f)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 10px',
                background: localTypeFilter === f ? 'var(--violet-soft)' : 'var(--bg-2)',
                border: `1px solid ${localTypeFilter === f ? 'transparent' : 'var(--line-2)'}`,
                borderRadius: 'var(--r-2)', fontSize: 12,
                color: localTypeFilter === f ? 'var(--violet-400)' : 'var(--fg-2)',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
          {accountFilter && (
            <button
              onClick={() => setAccountFilter(null)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '6px 10px', background: 'var(--violet-soft)',
                border: '1px solid var(--violet-400)', borderRadius: 'var(--r-2)',
                fontSize: 12, color: 'var(--violet-400)', cursor: 'pointer',
              }}
            >
              {allFolders.find((f) => f.account_id === accountFilter)?.account_name ?? 'Cuenta'}
              <X size={10} />
            </button>
          )}
          <div style={{ flex: 1 }} />
        </div>

        {/* File grid */}
        {filesQuery.isLoading ? (
          <div className="library-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '1/1', background: 'var(--bg-2)' }} />
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ height: 12, background: 'var(--bg-3)', borderRadius: 4, marginBottom: 6, width: '70%' }} />
                  <div style={{ height: 10, background: 'var(--bg-3)', borderRadius: 4, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--fg-3)', fontSize: 14 }}>
            {allFiles.length === 0 ? 'No hay archivos en la biblioteca todavía.' : 'Ningún archivo coincide con los filtros.'}
          </div>
        ) : (
          <div className="library-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {visible.map((a) => (
              <div
                key={a.id}
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
                onClick={() => setViewingFile(a)}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    aspectRatio: '1/1',
                    background: 'var(--bg-2)',
                    borderBottom: '1px solid var(--line-1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Type badge */}
                  <span style={{
                    position: 'absolute', top: 8, left: 8, zIndex: 2,
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    padding: '2px 6px', borderRadius: 'var(--r-1)',
                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {kindLabel(a.piece_type)}
                  </span>

                  {/* Download button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(a) }}
                    style={{
                      position: 'absolute', top: 8, right: 8, zIndex: 2,
                      width: 26, height: 26, borderRadius: 6,
                      background: 'rgba(0,0,0,0.6)', border: 'none',
                      color: '#fff', display: 'grid', placeItems: 'center',
                      cursor: 'pointer', opacity: 0.8,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8' }}
                  >
                    <Download size={12} />
                  </button>

                  {/* Preview content */}
                  {isImage(a) ? (
                    <img
                      src={a.file_url}
                      alt={a.file_name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : isVideo(a) ? (
                    <video
                      src={a.file_url}
                      muted
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onMouseEnter={(e) => { e.currentTarget.play().catch(() => {}) }}
                      onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
                    />
                  ) : isAudio(a) ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 36 }}>
                      🎵
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' }}>
                        {a.file_name.split('.').pop()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '10px 12px', fontSize: 12 }}>
                  <div style={{ fontWeight: 500, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {a.piece_title}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                    {a.account_name} · {relativeTime(a.uploaded_at).toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Mostrando {visible.length} de {filtered.length}
          </span>
          <div style={{ flex: 1 }} />
          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >
              Cargar más
            </button>
          )}
        </div>
      </div>

      {pendingFiles && (
        <UploadModal files={pendingFiles} onClose={() => setPendingFiles(null)} />
      )}

      {viewingFile && (
        <FileViewerModal file={viewingFile} onClose={() => setViewingFile(null)} />
      )}
    </div>
  )
}
