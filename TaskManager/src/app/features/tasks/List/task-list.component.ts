import {
  Component,
  ViewChild,
  AfterViewInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { ConfirmDialogService } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements AfterViewInit {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private confirm = inject(ConfirmDialogService);
  private snack = inject(MatSnackBar);

  displayedColumns = ['title', 'description', 'status', 'dueDate', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.load();
    this.dataSource.filterPredicate = (data: Task, filter: string) => {
      const term = filter.trim().toLowerCase();
      return (
        data.title.toLowerCase().includes(term) ||
        data.description.toLowerCase().includes(term) ||
        data.status.toLowerCase().includes(term) ||
        this.displayStatus(data).toLowerCase().includes(term)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.taskService.list().subscribe({
      next: (tasks) => {
        this.dataSource.data = tasks;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar as tarefas.');
        this.loading.set(false);
        this.snack.open('Erro ao carregar as tarefas', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  add() {
    this.router.navigate(['/tasks/new']);
  }
  edit(task: Task) {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }

  remove(task: Task) {
    this.confirm
      .open({
        title: 'Excluir tarefa',
        message: `Tem certeza que deseja excluir "${task.title}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        color: 'warn',
        icon: 'delete',
      })
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.taskService.delete(task.id!).subscribe({
          next: () => {
            this.snack.open('Tarefa excluída', 'Fechar', { duration: 2500 });
            this.load();
          },
          error: () =>
            this.snack.open('Erro ao excluir tarefa', 'Fechar', {
              duration: 3000,
            }),
        });
      });
  }

  toggle(task: Task) {
    this.taskService.toggleComplete(task).subscribe({
      next: () => {
        const msg =
          task.status === 'concluída'
            ? 'Tarefa marcada como pendente'
            : 'Tarefa concluída';
        this.snack.open(msg, 'Fechar', { duration: 2500 });
        this.load();
      },
      error: () =>
        this.snack.open('Erro ao atualizar status', 'Fechar', {
          duration: 3000,
        }),
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  applyFilterFromInput(value: string) {
    this.dataSource.filter = (value || '').trim().toLowerCase();
  }

  isOverdue(t: Task): boolean {
    if (t.status === 'concluída') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }

  displayStatus(t: Task): TaskStatus {
    if (t.status === 'concluída') return 'concluída';
    return this.isOverdue(t) ? 'vencido' : 'pendente';
  }
}
