import { Client } from "@/types";

const STORAGE_KEY = "@agende-aqui/clients";

function getClientsFromStorage(): Client[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveClientsToStorage(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

// GET
export async function getClients(): Promise<Client[]> {
  return getClientsFromStorage();
}

// POST
export async function postClient(newClient: Client): Promise<Client> {
  const clients = getClientsFromStorage();
  const updatedClients = [...clients, newClient];
  saveClientsToStorage(updatedClients);
  return newClient;
}

// DELETE
export async function deleteClient(id: string): Promise<{ success: boolean }> {
  const clients = getClientsFromStorage();
  const updatedClients = clients.filter((client) => client.id !== id);
  saveClientsToStorage(updatedClients);
  return { success: true };
}
