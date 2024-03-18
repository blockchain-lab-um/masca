export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          avatar_url: string | null;
          full_access: boolean;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_access?: boolean;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_access?: boolean;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'admins_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      campaigns: {
        Row: {
          additional_constraints: Json[] | null;
          claimed: number;
          created_at: string;
          credential_subject: Json;
          description: string | null;
          end_date: string | null;
          id: string;
          image_url: string;
          production: boolean;
          schema_context_url: string | null;
          schema_url: string | null;
          start_date: string | null;
          title: string | null;
          total: number | null;
          type: string;
        };
        Insert: {
          additional_constraints?: Json[] | null;
          claimed?: number;
          created_at?: string;
          credential_subject: Json;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url: string;
          production?: boolean;
          schema_context_url?: string | null;
          schema_url?: string | null;
          start_date?: string | null;
          title?: string | null;
          total?: number | null;
          type?: string;
        };
        Update: {
          additional_constraints?: Json[] | null;
          claimed?: number;
          created_at?: string;
          credential_subject?: Json;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string;
          production?: boolean;
          schema_context_url?: string | null;
          schema_url?: string | null;
          start_date?: string | null;
          title?: string | null;
          total?: number | null;
          type?: string;
        };
        Relationships: [];
      };
      campaigns_requirements: {
        Row: {
          campaign_id: string;
          requirement_id: string;
        };
        Insert: {
          campaign_id: string;
          requirement_id: string;
        };
        Update: {
          campaign_id?: string;
          requirement_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_campaigns_requirements_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_campaigns_requirements_requirement_id_fkey';
            columns: ['requirement_id'];
            isOneToOne: false;
            referencedRelation: 'requirements';
            referencedColumns: ['id'];
          },
        ];
      };
      claims: {
        Row: {
          campaign_id: string;
          claimed_at: string;
          id: number;
          user_id: string;
        };
        Insert: {
          campaign_id: string;
          claimed_at?: string;
          id?: number;
          user_id: string;
        };
        Update: {
          campaign_id?: string;
          claimed_at?: string;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_claims_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_claims_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      presentations: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          presentation: Json;
          title: string;
          user_id: string;
          views: number;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          presentation: Json;
          title: string;
          user_id?: string;
          views?: number;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          presentation?: Json;
          title?: string;
          user_id?: string;
          views?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_presentations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      requirements: {
        Row: {
          action_link: string | null;
          created_at: string;
          id: string;
          issuer: string | null;
          name: string | null;
          types: string[] | null;
        };
        Insert: {
          action_link?: string | null;
          created_at?: string;
          id?: string;
          issuer?: string | null;
          name?: string | null;
          types?: string[] | null;
        };
        Update: {
          action_link?: string | null;
          created_at?: string;
          id?: string;
          issuer?: string | null;
          name?: string | null;
          types?: string[] | null;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          connected: boolean;
          data: string | null;
          id: string;
          iv: string | null;
          user_id: string;
        };
        Insert: {
          connected?: boolean;
          data?: string | null;
          id?: string;
          iv?: string | null;
          user_id: string;
        };
        Update: {
          connected?: boolean;
          data?: string | null;
          id?: string;
          iv?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      siwe: {
        Row: {
          created_at: string;
          expires_at: string;
          id: string;
          nonce: string;
        };
        Insert: {
          created_at?: string;
          expires_at: string;
          id?: string;
          nonce?: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          id?: string;
          nonce?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          address: string;
          created_at: string;
          id: string;
        };
        Insert: {
          address: string;
          created_at?: string;
          id?: string;
        };
        Update: {
          address?: string;
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      users_requirements: {
        Row: {
          created_at: string;
          requirement_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          requirement_id?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          requirement_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_users_requirements_requirement_id_fkey';
            columns: ['requirement_id'];
            isOneToOne: false;
            referencedRelation: 'requirements';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_users_requirements_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_presentation_views: {
        Args: {
          presentation_id: string;
        };
        Returns: undefined;
      };
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;
