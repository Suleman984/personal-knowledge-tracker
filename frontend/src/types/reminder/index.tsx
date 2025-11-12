export interface Reminder {
  id: number;
  user_id: number;
  content_id: number;
  schedule_for: string;
  is_set: boolean;
  is_sent: boolean;
  created_at: string;
  title?: string;
}