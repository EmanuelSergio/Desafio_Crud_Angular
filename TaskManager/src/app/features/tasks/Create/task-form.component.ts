import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(TaskService);
  private snack = inject(MatSnackBar);

  id?: string | number;
  minDate = new Date();

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    status: ['pendente' as TaskStatus, Validators.required],
    dueDate: [null as unknown as Date, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.service.get(id).subscribe(t => {
        this.form.patchValue({
          title: t.title,
          description: t.description,
          status: t.status,
          dueDate: new Date(t.dueDate)
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as any as Task;
    const payload: Task = {
      ...value,
      dueDate: this.toIsoDate(this.form.value.dueDate as Date)
    };

    const request = this.id ? this.service.update(this.id, { ...payload, id: this.id }) : this.service.create(payload);
    request.subscribe({
      next: () => {
        this.snack.open('Tarefa salva com sucesso', 'Fechar', { duration: 2500 });
        this.router.navigate(['/tasks']);
      },
      error: () => this.snack.open('Erro ao salvar a tarefa', 'Fechar', { duration: 3000 })
    });
  }

  private toIsoDate(d: Date) {
    const pad = (n: number) => `${n}`.padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
