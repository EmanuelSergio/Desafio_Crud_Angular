import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogOptions, ConfirmDialogData } from './confirm-dialog.models';

const DEFAULTS: ConfirmDialogData = {
  title: 'Confirmação',
  message: 'Deseja confirmar esta ação?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  color: 'primary',
  icon: 'help_outline',
};

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  open(options: ConfirmDialogOptions = {}): Observable<boolean> {
    const data: ConfirmDialogData = { ...DEFAULTS, ...options };
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data,
      width: options.width ?? '420px',
      disableClose: options.disableClose ?? true,
    });
    return ref.afterClosed().pipe(map(result => !!result));
  }
}
