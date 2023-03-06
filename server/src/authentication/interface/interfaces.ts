import { Document } from 'mongoose';

export interface User {
   email: string;
   password: string;
   roles: Role[];
}

export enum Role {
   USER = "user",
   ADMIN = "admin",
}