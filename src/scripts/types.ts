// Assuming this is in a file named types.ts or similar
export type Post = {
    postId: Number; // Unique identifier for the post
    title: string; // Title of the post
    content: string; // Content of the post
    author_id: string; // ID of the user who authored the post
    created_at: string; // Creation timestamp, assuming ISO 8601 format
    updated_at: string; // Last update timestamp, assuming ISO 8601 format
    slug: string;
};

export type User = {
    username: any;
    website: any;
    avatar_url: any;
    id: any;
};

export type GitHubFormattedIssue = {
    issue_created_date: string;
    issue_name: string;
    issue_user_name: string;
    is_open: boolean;
};

export type GitHubFormattedPullRequest = {
    pull_request_created_date: string;
    pull_request_name: string;
    pull_request_user_name: string;
    is_merged: boolean;
};

export type GitHubFormattedCommit = {
    commit_date: string;
    commit_name: string;
    commit_user_name: string;
    commit_user_email: string;
}

export type Issue = {
    created_at: string;
    title: string;
    user: {
        login: string;
    };
    state: string;
}

export type PullRequest = {
    created_at: string;
    title: string;
    user: {
        login: string;
    };
    merged_at: string | null;
}

export type Commit = {
    commit: {
        author: {
            date: string;
            name: string;
            email: string;
        };
        message: string;
    };
}