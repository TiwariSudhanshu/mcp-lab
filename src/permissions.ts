export type Role = "reader" | "writer" | "admin";

export const Current_Role: Role = "admin";

const rolePermissions: Record<Role, string[]> = {
  reader: ["ping", "list_users", "get_user_by_id", "search_users", "count_users"], // read-only operations
  writer: ["ping", "list_users", "get_user_by_id", "search_users", "count_users", "create_user", "update_user"], // read + create/update
  admin: ["ping", "list_users", "get_user_by_id", "search_users", "count_users", "create_user", "update_user", "delete_user", "verify_user", "get_user_workflow", "activate_user"] // all operations
};

export function canExecute(toolName: string, role:Role = Current_Role): boolean {
  const allowedTools = rolePermissions[role] ?? [];
  return allowedTools.includes(toolName);
}