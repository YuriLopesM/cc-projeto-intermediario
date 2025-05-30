import { UserAuthenticated } from "@/types";

const AUTH_KEY = "@agende-aqui/userAuthenticated";

// GET – retorna o usuário autenticado
export async function getUserAuthenticated(): Promise<UserAuthenticated | null> {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

// POST – salva/atualiza o usuário autenticado
export async function postUserAuthenticated(
  newUser: UserAuthenticated,
): Promise<UserAuthenticated> {
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  return newUser;
}

// DELETE – remove o usuário autenticado (logout)
export async function deleteUserAuthenticated(): Promise<{ success: boolean }> {
  localStorage.removeItem(AUTH_KEY);
  return { success: true };
}
