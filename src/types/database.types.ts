export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_clients: {
        Row: {
          account_id: string
          linked_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          linked_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          linked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_clients_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      account_members: {
        Row: {
          account_id: string
          assigned_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          assigned_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          assigned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_members_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          agency_id: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          handle: string | null
          id: string
          industry: string | null
          is_active: boolean
          monthly_budget: number | null
          name: string
          plan: string | null
          storage_used_kb: number
        }
        Insert: {
          agency_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          handle?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          monthly_budget?: number | null
          name: string
          plan?: string | null
          storage_used_kb?: number
        }
        Update: {
          agency_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          handle?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          monthly_budget?: number | null
          name?: string
          plan?: string | null
          storage_used_kb?: number
        }
        Relationships: [
          {
            foreignKeyName: "accounts_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agencies: {
        Row: {
          created_at: string
          id: string
          name: string
          plan: string
          settings: Json
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          plan?: string
          settings?: Json
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          plan?: string
          settings?: Json
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: []
      }
      client_piece_quota: {
        Row: {
          pieces_created: number
          pieces_limit: number
          user_id: string
          year_month: string
        }
        Insert: {
          pieces_created?: number
          pieces_limit: number
          user_id: string
          year_month: string
        }
        Update: {
          pieces_created?: number
          pieces_limit?: number
          user_id?: string
          year_month?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_piece_quota_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          piece_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          piece_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          piece_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          agency_id: string
          concept: string
          created_at: string
          emision_date: string
          id: string
          iva: number
          number: string
          period: string
          status: string
          subtotal: number
          total: number
        }
        Insert: {
          agency_id: string
          concept: string
          created_at?: string
          emision_date: string
          id?: string
          iva: number
          number: string
          period: string
          status?: string
          subtotal: number
          total: number
        }
        Update: {
          agency_id?: string
          concept?: string
          created_at?: string
          emision_date?: string
          id?: string
          iva?: number
          number?: string
          period?: string
          status?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      piece_files: {
        Row: {
          file_name: string
          file_size_kb: number
          file_type: string
          file_url: string
          id: string
          piece_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_size_kb: number
          file_type: string
          file_url: string
          id?: string
          piece_id: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_size_kb?: number
          file_type?: string
          file_url?: string
          id?: string
          piece_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "piece_files_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      pieces: {
        Row: {
          account_id: string
          archived_at: string | null
          author_id: string
          copy: string | null
          created_at: string
          has_pauta: boolean
          id: string
          pauta_amount: number | null
          platform: string | null
          rejection_reason: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          account_id: string
          archived_at?: string | null
          author_id: string
          copy?: string | null
          created_at?: string
          has_pauta?: boolean
          id?: string
          pauta_amount?: number | null
          platform?: string | null
          rejection_reason?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          archived_at?: string | null
          author_id?: string
          copy?: string | null
          created_at?: string
          has_pauta?: boolean
          id?: string
          pauta_amount?: number | null
          platform?: string | null
          rejection_reason?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pieces_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pieces_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          agency_id: string
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          position: string | null
          role: string
        }
        Insert: {
          agency_id: string
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          position?: string | null
          role: string
        }
        Update: {
          agency_id?: string
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          position?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_account_ids: { Args: never; Returns: string[] }
      auth_agency_id: { Args: never; Returns: string }
      auth_role: { Args: never; Returns: string }
      check_and_increment_piece_quota: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      get_account_storage_limit_kb: {
        Args: { p_account_id: string }
        Returns: number
      }
      get_client_piece_limit: { Args: { p_user_id: string }; Returns: number }
      get_user_agency_id: { Args: never; Returns: string }
      pieces_by_status_count: {
        Args: { p_agency_id: string }
        Returns: {
          status: string
          total: number
        }[]
      }
      published_pieces_by_month: {
        Args: { p_agency_id: string; p_months?: number }
        Returns: {
          month: string
          total: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
