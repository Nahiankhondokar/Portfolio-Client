
export interface Blog {
  id: number;
  title: string;
  subtitle?: string
  description: string;
  status?: boolean;
  created_at?: string | null;
  media?: string | null;
}