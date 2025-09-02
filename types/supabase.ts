// types/supabase.ts
export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          chat_id: string;
          sender: string;
          content: string;
          component_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          sender: string;
          content: string;
          component_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          sender?: string;
          content?: string;
          component_code?: string | null;
          created_at?: string;
        };
      };
      deployed_sites: {
        Row: {
          id: string;
          user_id: string;
          site_name: string;
          message_id: string;
          message_content: string;
          component_code: string;
          chat_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          site_name: string;
          message_id: string;
          message_content: string;
          component_code: string;
          chat_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          site_name?: string;
          message_id?: string;
          message_content?: string;
          component_code?: string;
          chat_id?: string;
          created_at?: string;
        };
      };
      analytics: {
        Row: {
          deployed_site_id: string;
          page_views: number;
          unique_visitors: number;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          deployed_site_id: string;
          page_views?: number;
          unique_visitors?: number;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          deployed_site_id?: string;
          page_views?: number;
          unique_visitors?: number;
          last_updated?: string;
          created_at?: string;
        };
      };
    };
  };
};