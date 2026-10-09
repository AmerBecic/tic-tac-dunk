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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
      daily_puzzles: {
        Row: {
          created_at: string;
          grid_data: Json;
          id: string;
          puzzle_date: string;
        };
        Insert: {
          created_at?: string;
          grid_data: Json;
          id: string;
          puzzle_date: string;
        };
        Update: {
          created_at?: string;
          grid_data?: Json;
          id?: string;
          puzzle_date?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          board: Json;
          created_at: string;
          current_player:
            | Database['public']['Enums']['match_participant']
            | null;
          end_reason: Database['public']['Enums']['match_end_reason'] | null;
          finished_at: string | null;
          grid: Json;
          history: Json;
          id: string;
          mode: Database['public']['Enums']['match_mode'];
          player1_id: string;
          player2_id: string | null;
          status: Database['public']['Enums']['match_status'];
          turn_duration_seconds: number;
          turn_ends_at: string | null;
          turn_number: number;
          updated_at: string;
          version: number;
          winner: Database['public']['Enums']['match_participant'] | null;
        };
        Insert: {
          board?: Json;
          created_at?: string;
          current_player?:
            | Database['public']['Enums']['match_participant']
            | null;
          end_reason?: Database['public']['Enums']['match_end_reason'] | null;
          finished_at?: string | null;
          grid: Json;
          history?: Json;
          id?: string;
          mode: Database['public']['Enums']['match_mode'];
          player1_id: string;
          player2_id?: string | null;
          status?: Database['public']['Enums']['match_status'];
          turn_duration_seconds: number;
          turn_ends_at?: string | null;
          turn_number?: number;
          updated_at?: string;
          version?: number;
          winner?: Database['public']['Enums']['match_participant'] | null;
        };
        Update: {
          board?: Json;
          created_at?: string;
          current_player?:
            | Database['public']['Enums']['match_participant']
            | null;
          end_reason?: Database['public']['Enums']['match_end_reason'] | null;
          finished_at?: string | null;
          grid?: Json;
          history?: Json;
          id?: string;
          mode?: Database['public']['Enums']['match_mode'];
          player1_id?: string;
          player2_id?: string | null;
          status?: Database['public']['Enums']['match_status'];
          turn_duration_seconds?: number;
          turn_ends_at?: string | null;
          turn_number?: number;
          updated_at?: string;
          version?: number;
          winner?: Database['public']['Enums']['match_participant'] | null;
        };
        Relationships: [];
      };
      player_teammates: {
        Row: {
          player_id: string;
          seasons_together: number;
          teammate_id: string;
        };
        Insert: {
          player_id: string;
          seasons_together?: number;
          teammate_id: string;
        };
        Update: {
          player_id?: string;
          seasons_together?: number;
          teammate_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'player_teammates_player_fkey';
            columns: ['player_id'];
            isOneToOne: false;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'player_teammates_teammate_fkey';
            columns: ['teammate_id'];
            isOneToOne: false;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
      players: {
        Row: {
          as: boolean;
          dpoy: boolean;
          first_season: number;
          highest_fg_percentage: number;
          highest_season_points_total: number;
          id: string;
          last_season: number;
          main_team: string | null;
          mip: boolean;
          mvp: boolean;
          name: string;
          roy: boolean;
          teammate_clue_eligible: boolean;
          teams: string[] | null;
        };
        Insert: {
          as: boolean;
          dpoy: boolean;
          first_season: number;
          highest_fg_percentage: number;
          highest_season_points_total: number;
          id: string;
          last_season: number;
          main_team?: string | null;
          mip: boolean;
          mvp: boolean;
          name: string;
          roy: boolean;
          teammate_clue_eligible?: boolean;
          teams?: string[] | null;
        };
        Update: {
          as?: boolean;
          dpoy?: boolean;
          first_season?: number;
          highest_fg_percentage?: number;
          highest_season_points_total?: number;
          id?: string;
          last_season?: number;
          main_team?: string | null;
          mip?: boolean;
          mvp?: boolean;
          name?: string;
          roy?: boolean;
          teammate_clue_eligible?: boolean;
          teams?: string[] | null;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          code: string;
          included_names: string[];
          name: string;
          primary_color: string;
          secondary_color: string;
        };
        Insert: {
          code: string;
          included_names?: string[];
          name: string;
          primary_color: string;
          secondary_color: string;
        };
        Update: {
          code?: string;
          included_names?: string[];
          name?: string;
          primary_color?: string;
          secondary_color?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      find_grid_answers: {
        Args: { _columns: Json; _rows: Json };
        Returns: {
          column_index: number;
          player_id: string;
          row_index: number;
        }[];
      };
      get_random_eligible_players: {
        Args: { requested_count: number };
        Returns: {
          id: string;
          name: string;
        }[];
      };
      get_random_teams: {
        Args: { requested_count: number };
        Returns: {
          code: string;
          included_names: string[];
          name: string;
        }[];
      };
      search_players: {
        Args: { _limit?: number; _offset?: number; _search?: string };
        Returns: {
          as: boolean;
          dpoy: boolean;
          first_season: number;
          highest_fg_percentage: number;
          highest_season_points_total: number;
          id: string;
          last_season: number;
          main_team: string;
          mip: boolean;
          mvp: boolean;
          name: string;
          roy: boolean;
          teammate_clue_eligible: boolean;
          teams: string[];
          total_count: number;
        }[];
      };
      validate_grid: {
        Args: { _columns: Json; _rows: Json };
        Returns: {
          column_index: number;
          has_answer: boolean;
          row_index: number;
        }[];
      };
    };
    Enums: {
      match_end_reason: 'THREE_IN_ROW' | 'DRAW' | 'FORFEIT';
      match_mode: 'AI' | 'ONLINE';
      match_participant: 'PLAYER1' | 'PLAYER2';
      match_status: 'WAITING' | 'ACTIVE' | 'FINISHED' | 'ABANDONED';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      match_end_reason: ['THREE_IN_ROW', 'DRAW', 'FORFEIT'],
      match_mode: ['AI', 'ONLINE'],
      match_participant: ['PLAYER1', 'PLAYER2'],
      match_status: ['WAITING', 'ACTIVE', 'FINISHED', 'ABANDONED'],
    },
  },
} as const;
