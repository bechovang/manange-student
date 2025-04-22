// types.ts
export interface teacher {
  id: number;
  name: string;
  subject: string;
  avatar?: string;
  colorIndex?: number;
  color?: string;
}

export interface scheduleEvent {
  id: number;
  title: string;
  teacherId: number;
  room: string;
  day: number; // 0-6 (0 là Chủ nhật)
  startTime: string; // "HH:mm"
  endTime: string;  // "HH:mm"
}