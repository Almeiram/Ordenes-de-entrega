// app/src/services/rbac.service.ts
import { getRoleById } from "../dao/role.dao"; // ya lo tienes
import type { RoleResponseDto } from "../dto/role.dto";

const roleCache = new Map<number, RoleResponseDto>(); // simple in-memory cache

export async function resolveRole(role_id: number): Promise<RoleResponseDto | null> {
  if (roleCache.has(role_id)) return roleCache.get(role_id)!;
  const role = await getRoleById(role_id);
  if (role) roleCache.set(role_id, role);
  return role ?? null;
}

/** Throws if the role does not exist or is inactive */
export async function assertActiveRole(role_id: number): Promise<RoleResponseDto> {
  const role = await resolveRole(role_id);
  if (!role) throw new Error("ROLE_NOT_FOUND");
  if (!role.is_active) throw new Error("ROLE_INACTIVE");
  return role;
}