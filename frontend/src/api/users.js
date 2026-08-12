import { client } from "./client.js";

export async function fetchAdminUsers() {
  const { data } = await client.get("/admin/users");
  return data.users;
}

export async function updateUserRole(userId, role) {
  const { data } = await client.patch(`/admin/users/${userId}/role`, { role });
  return data.user;
}
