export interface Comment {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
        image: string | null;
    };
    parent_id: number | null;
    replies?: Comment[];
    created_at: string;
}
