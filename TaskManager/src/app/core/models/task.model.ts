export type TaskStatus = 'pendente' | 'concluída';

export interface Task {
  id?: string | number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}
