import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatTooltipModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  private router = inject(Router);

  displayedColumns = ['title', 'description', 'status', 'dueDate', 'actions'];
  tasks = signal<Task[]>([]);

  ngOnInit() {
    this.load();
  }

  load() {
    this.taskService.list().subscribe(tasks => this.tasks.set(tasks));
  }

  add() { this.router.navigate(['/tasks/new']); }
  edit(task: Task) { this.router.navigate(['/tasks', task.id, 'edit']); }

  remove(task: Task) {
    if (!confirm(`Excluir a tarefa "${task.title}"?`)) return;
    this.taskService.delete(task.id!).subscribe(() => this.load());
  }

  toggle(task: Task) {
    this.taskService.toggleComplete(task).subscribe(() => this.load());
  }
}
