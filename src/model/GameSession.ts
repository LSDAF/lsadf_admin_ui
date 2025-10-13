export interface GameSession {
  id: string;
  gameSaveId: string;
  userEmail: string;
  endTime: string;
  cancelled: boolean;
  updatedAt: string;
  version: number;
}
