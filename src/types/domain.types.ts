export type UserRole = 'admin_agency' | 'manager' | 'creator' | 'team_member' | 'client'

export type PieceType = 'post' | 'reel' | 'story' | 'ad' | 'blog' | 'carrusel'

export type PieceStatus =
  | 'draft'
  | 'sent_client'
  | 'approved'
  | 'rejected'
  | 'published'

export interface User {
  id: string
  agency_id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  initials: string
  position?: string
  is_active: boolean
  created_at: string
}

export interface Account {
  id: string
  agency_id: string
  name: string
  initials: string
  handle?: string
  industry?: string
  contact_name?: string
  contact_email?: string
  monthly_budget?: number
  is_active: boolean
  created_at: string
}

export interface Piece {
  id: string
  account_id: string
  account?: Account
  author_id: string
  author?: User
  title: string
  type: PieceType
  copy?: string
  scheduled_date: string
  scheduled_time?: string
  status: PieceStatus
  rejection_reason?: string
  version?: number
  platform?: string
  has_pauta?: boolean
  pauta_amount?: number
  created_at: string
  updated_at: string
}

export interface PieceFile {
  id: string
  piece_id: string
  file_url: string
  file_name: string
  file_type: string
  file_size_kb: number
  uploaded_at: string
}

export interface Comment {
  id: string
  piece_id: string
  author_id: string
  content: string
  created_at: string
  author?: User
}

export interface TimelineEvent {
  id: string
  piece_id: string
  actor?: User
  action: string
  detail?: string
  occurred_at: string
  status_color?: string
}

export interface TeamMember extends User {
  pieces_assigned?: number
  pieces_capacity?: number
  role_label?: string
}

export interface Agency {
  id: string
  name: string
  plan: 'solo' | 'estudio' | 'casa'
}

export interface ActivityItem {
  id: string
  actor: User
  action: string
  target: string
  account?: string
  occurred_at: string
}
