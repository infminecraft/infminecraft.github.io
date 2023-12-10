// Assuming this is in a file named types.ts or similar
export type Post = {
    id: string; // Unique identifier for the post
    title: string; // Title of the post
    content: string; // Content of the post
    author_id: string; // ID of the user who authored the post
    created_at: string; // Creation timestamp, assuming ISO 8601 format
    updated_at: string; // Last update timestamp, assuming ISO 8601 format
};
