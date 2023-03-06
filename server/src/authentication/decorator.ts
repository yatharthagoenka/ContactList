import { SetMetadata } from "@nestjs/common";
import { Role } from "./interface/interfaces";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);