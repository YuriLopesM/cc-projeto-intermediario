import { Schedule } from "@/types";

const STORAGE_KEY = "@agende-aqui/schedules";

function getSchedulesFromStorage(): Schedule[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveSchedulesToStorage(schedules: Schedule[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

// GET
export async function getSchedules(): Promise<Schedule[]> {
  return getSchedulesFromStorage();
}

// POST (adiciona ou atualiza um agendamento com base no ID)
export async function postSchedule(newSchedule: Schedule): Promise<Schedule> {
  const schedules = getSchedulesFromStorage();
  const index = schedules.findIndex((s) => s.id === newSchedule.id);

  let updatedSchedules;
  if (index !== -1) {
    // Atualiza se já existir
    updatedSchedules = [...schedules];
    updatedSchedules[index] = newSchedule;
  } else {
    // Adiciona novo
    updatedSchedules = [...schedules, newSchedule];
  }

  saveSchedulesToStorage(updatedSchedules);
  return newSchedule;
}

// DELETE
export async function deleteSchedule(
  id: string,
): Promise<{ success: boolean }> {
  const schedules = getSchedulesFromStorage();
  const updatedSchedules = schedules.filter((schedule) => schedule.id !== id);
  saveSchedulesToStorage(updatedSchedules);
  return { success: true };
}
