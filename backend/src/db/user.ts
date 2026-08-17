import { FastifyInstance } from "fastify";
import { User } from "../models/User";

export class UserDB {
    constructor(private server: FastifyInstance) {}

    async create(username: string, email: string, password: string): Promise<User> {
        const result = await this.server.db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", username, email, password);

        if (result.lastID === undefined) {
            throw new Error("Failed to create user");
        }

        const user = await this.findById(result.lastID);

        if (!user) {
            throw new Error("Failed to find created user");
        }

        return user;
    }

    async findById(id: number): Promise<User | undefined> {
        return this.server.db.get<User>("SELECT id, username, email, password, image_url AS imageUrl, created_at AS createdAt FROM users WHERE id = ?", id);
    }

    async findByUsername(username: string): Promise<User | undefined> {
        return this.server.db.get<User>("SELECT id, username, email, password, image_url AS imageUrl, created_at AS createdAt FROM users WHERE username = ?", username);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.server.db.get<User>("SELECT id, username, email, password, image_url AS imageUrl, created_at AS createdAt FROM users WHERE email = ?", email);
    }
}