import { client, setAuthToken } from "./client.js";

export async function loginUser(email, password) {
  const { data } = await client.post("/auth/login", {
    email,
    password,
  });

  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
}

export async function registerUser(name, email, password) {
  const { data } = await client.post("/auth/register", {
    name,
    email,
    password,
  });

  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
}

export async function getMe() {
  const { data } = await client.get("/auth/me");
  return data.user;
}

export function logoutUser() {
  setAuthToken(null);
}