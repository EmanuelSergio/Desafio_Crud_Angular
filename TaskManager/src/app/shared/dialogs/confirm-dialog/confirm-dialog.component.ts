import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogData } from './confirm-dialog.models';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div mat-dialog-title class="title">
      <mat-icon *ngIf="data.icon" class="icon" [attr.aria-hidden]="true">{{data.icon}}</mat-icon>
      <span>{{ data.title }}</span>
    </div>
    <div mat-dialog-content class="content">{{ data.message }}</div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">{{ data.cancelText }}</button>
      <button mat-raised-button [color]="data.color" (click)="close(true)">{{ data.confirmText }}</button>
    </div>
  `,
  styles: [
    `.title{ display:flex; align-items:center; gap:8px; }`,
    `.icon{ opacity:.8; }`,
    `.content{ margin:8px 0 4px; white-space:pre-line; }`
  ]
})
export class ConfirmDialogComponent {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<ConfirmDialogComponent, boolean>);

  close(value: boolean) { this.ref.close(value); }
}
