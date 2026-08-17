import bcrypt from "bcrypt";
import { UserDB } from "../db/user";

export class AuthService {
    constructor(private users: UserDB) {}

    async register(username: string, email: string, password: string) {
        const existingUsername = await this.users.findByUsername(username);

        if (existingUsername) {
            throw new Error("Username already exists");
        }

        const existingEmail = await this.users.findByEmail(email);

        if (existingEmail) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        return this.users.create(username, email, hashedPassword);
    }
}