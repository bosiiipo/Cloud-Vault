import { RoleType } from "@prisma/client";

export enum RoleEnum {
  USER,
  ADMIN
}

export interface createUserInput {
  fullName: string;
  email: string;
  role: RoleType;
  password: string;
};

export interface authUserInput {
  email: string;
  password: string;
};