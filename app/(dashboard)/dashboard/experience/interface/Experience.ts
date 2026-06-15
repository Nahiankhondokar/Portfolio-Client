export interface Experience {
  id: number;
  title: string;
  description: string | null;
  position: string | null;
  duration: string | null;
  company: string | null;
  start_date: string | null;
  end_date: string | null;
  image: {
    url: string;
    thumbnail?: string;
  } | null;
}

// type UpdatePayload =
//     | {
//   title?: string;
//   description?: string;
//   image?: File | null;
// }
//     | FormData; // Add FormData as a possible type
