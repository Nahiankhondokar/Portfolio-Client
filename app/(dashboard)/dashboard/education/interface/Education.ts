export interface Education {
  id: number;
  title: string;
  description: string | null;
  subject: string | null;
  duration: string | null;
  institute: string | null;
  start_date: string | null;
  end_date: string | null;
  year: string | null;
  media: {
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
