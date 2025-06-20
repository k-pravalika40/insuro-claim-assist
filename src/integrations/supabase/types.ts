export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      claims: {
        Row: {
          claim_type: string | null
          created_at: string | null
          damage_image_url: string | null
          description: string | null
          id: string
          incident_date: string | null
          status: string | null
          user_id: string | null
          vehicle_number: string | null
        }
        Insert: {
          claim_type?: string | null
          created_at?: string | null
          damage_image_url?: string | null
          description?: string | null
          id?: string
          incident_date?: string | null
          status?: string | null
          user_id?: string | null
          vehicle_number?: string | null
        }
        Update: {
          claim_type?: string | null
          created_at?: string | null
          damage_image_url?: string | null
          description?: string | null
          id?: string
          incident_date?: string | null
          status?: string | null
          user_id?: string | null
          vehicle_number?: string | null
        }
        Relationships: []
      }
      Claims: {
        Row: {
          claim_type: string | null
          created_at: string
          damage_score: number
          description: string | null
          fraud_score: number
          id: number
          incident_date: string | null
          incident_location: string | null
          incident_time: string | null
          is_verified: boolean | null
          policy_number: string | null
          settlement_amount: number
          status: string | null
          updated_at: string | null
          user_id: number | null
          user_uuid: string | null
          vehicle_make: string | null
          vehicle_model: string | null
        }
        Insert: {
          claim_type?: string | null
          created_at?: string
          damage_score: number
          description?: string | null
          fraud_score: number
          id?: number
          incident_date?: string | null
          incident_location?: string | null
          incident_time?: string | null
          is_verified?: boolean | null
          policy_number?: string | null
          settlement_amount: number
          status?: string | null
          updated_at?: string | null
          user_id?: number | null
          user_uuid?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
        }
        Update: {
          claim_type?: string | null
          created_at?: string
          damage_score?: number
          description?: string | null
          fraud_score?: number
          id?: number
          incident_date?: string | null
          incident_location?: string | null
          incident_time?: string | null
          is_verified?: boolean | null
          policy_number?: string | null
          settlement_amount?: number
          status?: string | null
          updated_at?: string | null
          user_id?: number | null
          user_uuid?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          claim_id: string | null
          file_type: string | null
          file_url: string
          id: string
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          claim_id?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          claim_id?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
