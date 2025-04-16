export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          original_resume: string
          job_description: string
          tailored_resume: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          original_resume: string
          job_description: string
          tailored_resume: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          original_resume?: string
          job_description?: string
          tailored_resume?: string
        }
      }
    }
  }
}
