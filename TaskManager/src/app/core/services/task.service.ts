import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';

const API = 'http://localhost:3000/tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  list(): Observable<Task[]> {
    return this.http.get<Task[]>(API);
  }

  get(id: string | number): Observable<Task> {
    return this.http.get<Task>(`${API}/${id}`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(API, task);
  }

  update(id: string | number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${API}/${id}`, task);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }

  toggleComplete(task: Task): Observable<Task> {
    const nextStatus: TaskStatus = task.status === 'concluída' ? 'pendente' as TaskStatus : 'concluída' as TaskStatus;
    const updated: Task = { ...task, status: nextStatus };
    return this.update(task.id!, updated);
  }
}
