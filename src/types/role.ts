export type UserRole = "admin" | "user";

export interface MockUser {
  id: string;
  name: string;
  role: UserRole;
}
