import { Role } from "../interface/interfaces";

export interface LoginDTO {
    email: string;
    password: string;
    role: Role;
}

export interface RegisterDTO {
    email: string;
    password: string;
    role: Role;
}