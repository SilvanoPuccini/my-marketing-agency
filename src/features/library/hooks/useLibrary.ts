import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export type LibraryFile = {
  id: string
  piece_id: string
  file_url: string
  file_name: string
  file_type: string
  file_size_kb: number
  uploaded_at: string
  // joined from piece -> account
  piece_title: string
  piece_type: string
  account_name: string
  account_id: string
}

export type LibraryFolder = {
  account_id: string
  account_name: string
  file_count: number
}

export function useLibraryFiles() {
  return useQuery({
    queryKey: ['library-files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('piece_files')
        .select(`
          id, piece_id, file_url, file_name, file_type, file_size_kb, uploaded_at,
          pieces!inner(title, type, accounts!inner(id, name))
        `)
        .order('uploaded_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map((f): LibraryFile => {
        const piece = f.pieces as unknown as { title: string; type: string; accounts: { id: string; name: string } }
        return {
          id: f.id,
          piece_id: f.piece_id,
          file_url: f.file_url,
          file_name: f.file_name,
          file_type: f.file_type,
          file_size_kb: f.file_size_kb,
          uploaded_at: f.uploaded_at,
          piece_title: piece.title,
          piece_type: piece.type,
          account_name: piece.accounts.name,
          account_id: piece.accounts.id,
        }
      })
    },
  })
}

export function useLibraryFolders() {
  return useQuery({
    queryKey: ['library-folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, pieces(piece_files(id))')
        .order('name')
      if (error) throw error
      return (data ?? []).map((acc): LibraryFolder => {
        const pieces = acc.pieces as unknown as { piece_files: { id: string }[] }[]
        const fileCount = pieces.reduce((sum, p) => sum + (p.piece_files?.length ?? 0), 0)
        return {
          account_id: acc.id,
          account_name: acc.name,
          file_count: fileCount,
        }
      }).filter((f) => f.file_count > 0)
    },
  })
}

export function usePiecesForUpload() {
  return useQuery({
    queryKey: ['pieces-for-upload'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('id, title, accounts(name)')
        .order('title')
      if (error) throw error
      return (data ?? []).map((p) => {
        const account = p.accounts as unknown as { name: string } | null
        return {
          id: p.id,
          title: p.title,
          account_name: account?.name ?? '',
        }
      })
    },
  })
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024  // 10 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024  // 50 MB

function validateFileSize(file: File): string | null {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  if (isImage && file.size > MAX_IMAGE_BYTES)
    return `"${file.name}" excede el limite de 10 MB para imagenes`
  if (isVideo && file.size > MAX_VIDEO_BYTES)
    return `"${file.name}" excede el limite de 50 MB para videos`
  return null
}

export function useUploadFiles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ files, pieceId }: { files: File[]; pieceId: string }) => {
      // Validate all files before uploading any
      for (const file of files) {
        const error = validateFileSize(file)
        if (error) throw new Error(error)
      }

      const results = []
      for (const file of files) {
        const ext = file.name.split('.').pop() ?? 'bin'
        const path = `pieces/${pieceId}/${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('piece-files')
          .upload(path, file)
        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('piece-files')
          .getPublicUrl(path)

        const { error: dbError } = await supabase
          .from('piece_files')
          .insert({
            piece_id: pieceId,
            file_url: urlData.publicUrl,
            file_name: file.name,
            file_type: file.type || ext,
            file_size_kb: Math.round(file.size / 1024),
          })
        if (dbError) throw dbError
        results.push(path)
      }
      return results
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-files'] })
      qc.invalidateQueries({ queryKey: ['library-folders'] })
      toast.success('Archivos subidos correctamente')
    },
    onError: () => toast.error('Error al subir archivos'),
  })
}

export function useDeleteFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (fileId: string) => {
      // 1. Obtener el path del archivo en Storage
      const { data: fileRecord, error: fetchError } = await supabase
        .from('piece_files')
        .select('file_url')
        .eq('id', fileId)
        .single()
      if (fetchError) throw fetchError

      // 2. Extraer el path (sacar el dominio de la URL pública si existe)
      const fileUrl = fileRecord?.file_url ?? ''
      const pathMatch = fileUrl.match(/\/pieces-files\/(.+)/)
      const storagePath = pathMatch ? pathMatch[1] : null

      // 3. Borrar de Storage (si hay path válido)
      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from('piece-files')
          .remove([storagePath])
        if (storageError) console.warn('Storage delete failed:', storageError.message)
      }

      // 4. Borrar el registro de la DB
      const { error } = await supabase
        .from('piece_files')
        .delete()
        .eq('id', fileId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-files'] })
      qc.invalidateQueries({ queryKey: ['library-folders'] })
      toast.success('Archivo eliminado')
    },
    onError: () => toast.error('Error al eliminar archivo'),
  })
}
