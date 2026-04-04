
export interface Blog {
  id: number;
  title: string;
  slug: string;
  subtitle?: string
  description: string;
  status?: boolean;
  created_at?: string | null;
  image?: string | null;
}