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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          entity: string | null
          id: string
          ip: string | null
          owner_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          entity?: string | null
          id?: string
          ip?: string | null
          owner_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          entity?: string | null
          id?: string
          ip?: string | null
          owner_id?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          code: string
          course_id: string
          created_at: string
          estado: string
          id: string
          institution_id: string | null
          issued_at: string
          owner_id: string
          pdf_url: string | null
          status: Database["public"]["Enums"]["certificate_status"]
          student_id: string
          teacher_ids: string[]
          type: string
          updated_at: string
        }
        Insert: {
          code: string
          course_id: string
          created_at?: string
          estado: string
          id?: string
          institution_id?: string | null
          issued_at?: string
          owner_id: string
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
          student_id: string
          teacher_ids?: string[]
          type?: string
          updated_at?: string
        }
        Update: {
          code?: string
          course_id?: string
          created_at?: string
          estado?: string
          id?: string
          institution_id?: string | null
          issued_at?: string
          owner_id?: string
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
          student_id?: string
          teacher_ids?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          updated_at: string
          workload: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          updated_at?: string
          workload?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
          workload?: number
        }
        Relationships: []
      }
      institutions: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_cards: {
        Row: {
          code: string
          course_id: string | null
          created_at: string
          estado: string | null
          id: string
          owner_id: string
          pdf_url: string | null
          status: string
          student_id: string
          updated_at: string
          valid_until: string
        }
        Insert: {
          code: string
          course_id?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          owner_id: string
          pdf_url?: string | null
          status?: string
          student_id: string
          updated_at?: string
          valid_until: string
        }
        Update: {
          code?: string
          course_id?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          owner_id?: string
          pdf_url?: string | null
          status?: string
          student_id?: string
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_cards_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_cards_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          course_id: string | null
          cpf: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          owner_id: string
          phone: string | null
          photo_url: string | null
          status: Database["public"]["Enums"]["student_status"]
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          owner_id: string
          phone?: string | null
          photo_url?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          owner_id?: string
          phone?: string | null
          photo_url?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          active: boolean
          cpf: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          owner_id: string
          signature_url: string | null
          titulation: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          owner_id: string
          signature_url?: string | null
          titulation?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          owner_id?: string
          signature_url?: string | null
          titulation?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "parceiro" | "usuario"
      certificate_status: "emitido" | "cancelado" | "reemitido" | "rascunho"
      student_status: "ativo" | "inativo" | "concluido"
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
    Enums: {
      app_role: ["admin", "parceiro", "usuario"],
      certificate_status: ["emitido", "cancelado", "reemitido", "rascunho"],
      student_status: ["ativo", "inativo", "concluido"],
    },
  },
} as const
