export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    imageUrl: string | null;
    createdAt: Date;
}