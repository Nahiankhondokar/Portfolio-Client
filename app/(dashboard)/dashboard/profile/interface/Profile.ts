export interface Profile {
  id: number;
  name: string;
  email: string;
  username: string;
  bio?: string;
  location?: string;
  website?: string;
  image?: string;
  phone?: string;
  socials?: string[];
  role?: number; // 1 = Super Admin, 2 = Admin, 3 = User, 4 = Viewer (read-only)
}