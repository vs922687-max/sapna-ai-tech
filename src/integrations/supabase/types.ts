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
      generated_shorts: {
        Row: {
          created_at: string
          description: string
          id: string
          language: string
          script: string
          status: string
          tags: string[]
          title: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          language?: string
          script: string
          status?: string
          tags?: string[]
          title: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          language?: string
          script?: string
          status?: string
          tags?: string[]
          title?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gov_applications: {
        Row: {
          ai_next_steps: string | null
          created_at: string
          follow_up: string | null
          id: string
          notes: string | null
          ref_no: string | null
          service: string
          status: string
          submitted_on: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_next_steps?: string | null
          created_at?: string
          follow_up?: string | null
          id?: string
          notes?: string | null
          ref_no?: string | null
          service: string
          status?: string
          submitted_on?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_next_steps?: string | null
          created_at?: string
          follow_up?: string | null
          id?: string
          notes?: string | null
          ref_no?: string | null
          service?: string
          status?: string
          submitted_on?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gov_documents: {
        Row: {
          created_at: string
          document_number: string | null
          expires_on: string | null
          file_path: string | null
          id: string
          issued_on: string | null
          name: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          expires_on?: string | null
          file_path?: string | null
          id?: string
          issued_on?: string | null
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          expires_on?: string | null
          file_path?: string | null
          id?: string
          issued_on?: string | null
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhaar: string | null
          address: string | null
          annual_income: string | null
          bank_account: string | null
          bank_name: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          district: string | null
          dob: string | null
          driving_license: string | null
          email: string | null
          father_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          ifsc: string | null
          marital_status: string | null
          mobile: string | null
          mother_name: string | null
          nationality: string | null
          occupation: string | null
          pan: string | null
          passport: string | null
          pincode: string | null
          religion: string | null
          spouse_name: string | null
          state: string | null
          updated_at: string
          user_id: string
          voter_id: string | null
        }
        Insert: {
          aadhaar?: string | null
          address?: string | null
          annual_income?: string | null
          bank_account?: string | null
          bank_name?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          dob?: string | null
          driving_license?: string | null
          email?: string | null
          father_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          ifsc?: string | null
          marital_status?: string | null
          mobile?: string | null
          mother_name?: string | null
          nationality?: string | null
          occupation?: string | null
          pan?: string | null
          passport?: string | null
          pincode?: string | null
          religion?: string | null
          spouse_name?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          voter_id?: string | null
        }
        Update: {
          aadhaar?: string | null
          address?: string | null
          annual_income?: string | null
          bank_account?: string | null
          bank_name?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          dob?: string | null
          driving_license?: string | null
          email?: string | null
          father_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          ifsc?: string | null
          marital_status?: string | null
          mobile?: string | null
          mother_name?: string | null
          nationality?: string | null
          occupation?: string | null
          pan?: string | null
          passport?: string | null
          pincode?: string | null
          religion?: string | null
          spouse_name?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          voter_id?: string | null
        }
        Relationships: []
      }
      site_visit_metrics: {
        Row: {
          singleton: boolean
          total: number
        }
        Insert: {
          singleton?: boolean
          total?: number
        }
        Update: {
          singleton?: boolean
          total?: number
        }
        Relationships: []
      }
      site_visits: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      work_applications: {
        Row: {
          cover_note: string
          created_at: string
          id: string
          job_id: string
          payment_status: string
          payment_updated_at: string | null
          quote_inr: number | null
          status: string
          submission_note: string | null
          submission_url: string | null
          updated_at: string
          worker_id: string
        }
        Insert: {
          cover_note: string
          created_at?: string
          id?: string
          job_id: string
          payment_status?: string
          payment_updated_at?: string | null
          quote_inr?: number | null
          status?: string
          submission_note?: string | null
          submission_url?: string | null
          updated_at?: string
          worker_id: string
        }
        Update: {
          cover_note?: string
          created_at?: string
          id?: string
          job_id?: string
          payment_status?: string
          payment_updated_at?: string | null
          quote_inr?: number | null
          status?: string
          submission_note?: string | null
          submission_url?: string | null
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "work_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      work_jobs: {
        Row: {
          budget_inr: number
          category: string
          client_id: string
          contact_note: string | null
          created_at: string
          deadline: string | null
          description: string
          id: string
          requirements: string | null
          skills: string[]
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget_inr?: number
          category: string
          client_id: string
          contact_note?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          requirements?: string | null
          skills?: string[]
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget_inr?: number
          category?: string
          client_id?: string
          contact_note?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          requirements?: string | null
          skills?: string[]
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      work_notifications: {
        Row: {
          application_id: string | null
          created_at: string
          event_type: string
          id: string
          is_read: boolean
          job_id: string | null
          link: string
          message: string
          recipient_id: string
          title: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          is_read?: boolean
          job_id?: string | null
          link?: string
          message: string
          recipient_id: string
          title: string
        }
        Update: {
          application_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          is_read?: boolean
          job_id?: string | null
          link?: string
          message?: string
          recipient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "work_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "work_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      site_visit_totals: {
        Row: {
          total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_site_visit_count: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
