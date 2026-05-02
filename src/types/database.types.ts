// Tipos generados manualmente que coinciden con el schema de Supabase.
// Cuando tengas el CLI instalado podés reemplazar con:
//   supabase gen types typescript --project-id <id> > src/types/database.types.ts

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          plan: 'solo' | 'estudio' | 'casa'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: 'solo' | 'estudio' | 'casa'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: 'solo' | 'estudio' | 'casa'
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          agency_id: string
          email: string
          full_name: string
          position: string | null
          role: 'admin_agency' | 'team_member' | 'client'
          avatar_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          agency_id: string
          email: string
          full_name: string
          position?: string | null
          role: 'admin_agency' | 'team_member' | 'client'
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          email?: string
          full_name?: string
          position?: string | null
          role?: 'admin_agency' | 'team_member' | 'client'
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          agency_id: string
          name: string
          handle: string | null
          industry: string | null
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          plan: string | null
          monthly_budget: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          name: string
          handle?: string | null
          industry?: string | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          plan?: string | null
          monthly_budget?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          name?: string
          handle?: string | null
          industry?: string | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          plan?: string | null
          monthly_budget?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      account_members: {
        Row: {
          account_id: string
          user_id: string
          assigned_at: string
        }
        Insert: {
          account_id: string
          user_id: string
          assigned_at?: string
        }
        Update: {
          account_id?: string
          user_id?: string
          assigned_at?: string
        }
      }
      account_clients: {
        Row: {
          account_id: string
          user_id: string
          linked_at: string
        }
        Insert: {
          account_id: string
          user_id: string
          linked_at?: string
        }
        Update: {
          account_id?: string
          user_id?: string
          linked_at?: string
        }
      }
      pieces: {
        Row: {
          id: string
          account_id: string
          author_id: string
          title: string
          type: 'post' | 'reel' | 'story' | 'ad' | 'blog' | 'carrusel'
          copy: string | null
          platform: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: 'draft' | 'sent_client' | 'approved' | 'rejected' | 'published'
          rejection_reason: string | null
          has_pauta: boolean
          pauta_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          author_id: string
          title: string
          type: 'post' | 'reel' | 'story' | 'ad' | 'blog' | 'carrusel'
          copy?: string | null
          platform?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: 'draft' | 'sent_client' | 'approved' | 'rejected' | 'published'
          rejection_reason?: string | null
          has_pauta?: boolean
          pauta_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          author_id?: string
          title?: string
          type?: 'post' | 'reel' | 'story' | 'ad' | 'blog' | 'carrusel'
          copy?: string | null
          platform?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: 'draft' | 'sent_client' | 'approved' | 'rejected' | 'published'
          rejection_reason?: string | null
          has_pauta?: boolean
          pauta_amount?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      piece_files: {
        Row: {
          id: string
          piece_id: string
          file_url: string
          file_name: string
          file_type: string
          file_size_kb: number
          uploaded_at: string
        }
        Insert: {
          id?: string
          piece_id: string
          file_url: string
          file_name: string
          file_type: string
          file_size_kb: number
          uploaded_at?: string
        }
        Update: {
          id?: string
          piece_id?: string
          file_url?: string
          file_name?: string
          file_type?: string
          file_size_kb?: number
          uploaded_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          piece_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          piece_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          piece_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
      }
    }
    Functions: {
      pieces_by_status_count: {
        Args: { p_agency_id: string }
        Returns: { status: string; total: number }[]
      }
      published_pieces_by_month: {
        Args: { p_agency_id: string; p_months?: number }
        Returns: { month: string; total: number }[]
      }
    }
  }
}
