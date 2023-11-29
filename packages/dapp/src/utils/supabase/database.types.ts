export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      authorization: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          nonce: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          nonce?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          nonce?: string
        }
        Relationships: []
      }
      identities: {
        Row: {
          addedd_at: string
          did: string
          id: string
          user_id: string
        }
        Insert: {
          addedd_at?: string
          did: string
          id?: string
          user_id: string
        }
        Update: {
          addedd_at?: string
          did?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      presentations: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          presentation: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          presentation: Json
          user_id?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          presentation?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          address: string
          id: string
        }
        Insert: {
          address: string
          id?: string
        }
        Update: {
          address?: string
          id?: string
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
