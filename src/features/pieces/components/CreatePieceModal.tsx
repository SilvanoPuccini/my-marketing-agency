import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, Trash2 } from 'lucide-react'
import { useCreatePiece } from '@/features/pieces/hooks/usePiece'
import { useUploadFiles } from '@/features/library/hooks/useLibrary'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'

const schema = z.object({
  account_id:     z.string().min(1, 'Seleccioná una cuenta'),
  title:          z.string().min(3, 'Mínimo 3 caracteres').max(150, 'Máximo 150 caracteres'),
  type:           z.enum(['post', 'reel', 'story', 'ad', 'blog', 'carrusel'], {
    error: 'Seleccioná un tipo',
  }),
  scheduled_date: z.string().min(1, 'La fecha es obligatoria'),
  scheduled_time: z.string().optional(),
  copy:           z.string().optional(),
  platform:       z.string().optional(),
  has_pauta:      z.boolean(),
  pauta_amount:   z.coerce.number().min(0).optional(),
})

type FormValues = z.infer<typeof schema>

const TYPE_OPTIONS = [
  { value: 'post',     label: 'Post' },
  { value: 'reel',     label: 'Reel' },
  { value: 'story',    label: 'Story' },
  { value: 'carrusel', label: 'Carrusel' },
  { value: 'ad',       label: 'Aviso' },
  { value: 'blog',     label: 'Blog' },
]

const PLATFORM_OPTIONS = [
  'Instagram', 'TikTok', 'Facebook',
  'Instagram + TikTok', 'Instagram + Facebook', 'Todas',
]

interface CreatePieceModalProps {
  onClose: () => void
  defaultAccountId?: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13,
  background: 'var(--bg-2)', border: '1px solid var(--line-2)',
  borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
  boxSizing: 'border-box',
}

const errorStyle: React.CSSProperties = {
  color: 'var(--status-rejected)', fontSize: 11, marginTop: 4,
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--fg-2)', marginBottom: 6,
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  )
}

function isImageType(type: string) {
  return type.startsWith('image/')
}

function isVideoType(type: string) {
  return type.startsWith('video/')
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (isImageType(file.type) || isVideoType(file.type)) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px', background: 'var(--bg-2)',
      border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)',
    }}>
      {/* Thumbnail */}
      <div style={{
        width: 48, height: 48, borderRadius: 6, overflow: 'hidden',
        background: 'var(--bg-3)', flexShrink: 0, display: 'grid', placeItems: 'center',
      }}>
        {preview && isImageType(file.type) && (
          <img src={preview} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {preview && isVideoType(file.type) && (
          <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
        )}
        {!preview && (
          <span className="mono" style={{ fontSize: 9, color: 'var(--fg-3)', textTransform: 'uppercase' }}>
            {file.name.split('.').pop()}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {file.name}
        </div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>
          {(file.size / 1024).toFixed(0)} KB · {file.type || 'desconocido'}
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        style={{
          width: 28, height: 28, borderRadius: 6, border: '1px solid var(--line-2)',
          background: 'var(--bg-1)', color: 'var(--fg-3)', display: 'grid', placeItems: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <Trash2 size={12} />
      </button>
    </div>
  )
}

export function CreatePieceModal({ onClose, defaultAccountId }: CreatePieceModalProps) {
  const { data: accounts = [] } = useAccounts()
  const createPiece = useCreatePiece()
  const uploadFiles = useUploadFiles()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      account_id:     defaultAccountId ?? '',
      has_pauta:      false,
      scheduled_date: new Date().toISOString().split('T')[0],
    },
  })

  const hasPauta = watch('has_pauta')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files])
    }
    e.target.value = ''
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(values: FormValues) {
    // 1. Crear la pieza
    const pieceId = await createPiece.mutateAsync(values)

    // 2. Si hay archivos, subirlos
    if (selectedFiles.length > 0 && pieceId) {
      setIsUploading(true)
      try {
        await uploadFiles.mutateAsync({ files: selectedFiles, pieceId })
      } finally {
        setIsUploading(false)
      }
    }

    onClose()
  }

  const isBusy = isSubmitting || createPiece.isPending || isUploading

  return (
    <>
      {/* Scrim */}
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,9,0.72)', zIndex: 40 }}
      />

      {/* Centering wrapper */}
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: 'min(560px, calc(100vw - 48px))',
          background: 'var(--bg-1)', border: '1px solid var(--line-2)',
          borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
          overflow: 'hidden', pointerEvents: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
            Nueva pieza
          </h2>
          <button
            onClick={onClose}
            style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
          >
            <X size={12} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

            {/* Cuenta */}
            <Field label="Cuenta *" error={errors.account_id?.message}>
              <select {...register('account_id')} style={inputStyle}>
                <option value="">Seleccioná una cuenta…</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </Field>

            {/* Título */}
            <Field label="Título *" error={errors.title?.message}>
              <input
                {...register('title')}
                placeholder="Ej: Reel apertura de temporada"
                style={inputStyle}
              />
            </Field>

            {/* Tipo + Plataforma */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Tipo *" error={errors.type?.message}>
                <select {...register('type')} style={inputStyle}>
                  <option value="">Seleccioná un tipo…</option>
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Plataforma" error={errors.platform?.message}>
                <select {...register('platform')} style={inputStyle}>
                  <option value="">Seleccioná…</option>
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Fecha + Hora */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Fecha de publicación *" error={errors.scheduled_date?.message}>
                <input
                  type="date"
                  {...register('scheduled_date')}
                  style={inputStyle}
                />
              </Field>
              <Field label="Hora" error={errors.scheduled_time?.message}>
                <input
                  type="time"
                  {...register('scheduled_time')}
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Copy */}
            <Field label="Copy / Texto" error={errors.copy?.message}>
              <textarea
                {...register('copy')}
                placeholder="Texto que acompaña la pieza, hashtags, etc."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, fontFamily: 'inherit' }}
              />
            </Field>

            {/* Archivo adjunto */}
            <div>
              <label style={labelStyle}>Archivo adjunto</label>

              {selectedFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                  {selectedFiles.map((file, i) => (
                    <FilePreview key={`${file.name}-${i}`} file={file} onRemove={() => removeFile(i)} />
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%', padding: '14px 12px', fontSize: 12, fontWeight: 500,
                  color: 'var(--fg-3)', borderRadius: 'var(--r-2)',
                  border: '2px dashed var(--line-2)', background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--violet-400)'; e.currentTarget.style.color = 'var(--violet-400)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.color = 'var(--fg-3)' }}
              >
                <Upload size={14} />
                {selectedFiles.length > 0 ? 'Agregar más archivos' : 'Seleccionar archivo (imagen, video, audio)'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>

            {/* Pauta */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  {...register('has_pauta')}
                  style={{ width: 16, height: 16, accentColor: 'var(--violet-500)', cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Tiene pauta</span>
              </label>
              {hasPauta && (
                <div style={{ marginTop: 10 }}>
                  <Field label="Monto de pauta (ARS)" error={errors.pauta_amount?.message}>
                    <input
                      type="number"
                      min={0}
                      {...register('pauta_amount')}
                      placeholder="Ej: 24000"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {uploadFiles.progress && isUploading && (
            <div style={{ padding: '0 20px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', marginBottom: 6 }}>
                <span>{uploadFiles.progress.fileName}</span>
                <span className="mono">{uploadFiles.progress.percent}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: 'var(--violet-500)', borderRadius: 999,
                  width: `${uploadFiles.progress.percent}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-1)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: isBusy ? 'not-allowed' : 'pointer', opacity: isBusy ? 0.5 : 1 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isBusy}
              style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: isBusy ? 'var(--violet-600)' : 'var(--violet-500)', cursor: isBusy ? 'not-allowed' : 'pointer' }}
            >
              {isUploading ? `Subiendo ${uploadFiles.progress?.percent ?? 0}%...` : isBusy ? 'Guardando…' : 'Crear pieza'}
            </button>
          </div>
        </form>
      </motion.div>
      </div>
    </>
  )
}
