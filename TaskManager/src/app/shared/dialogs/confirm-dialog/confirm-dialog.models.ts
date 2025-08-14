export interface ConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  color?: 'primary' | 'accent' | 'warn';
  icon?: string; // material icon name
  width?: string; // e.g., '420px'
  disableClose?: boolean;
}

export interface ConfirmDialogData extends Required<Omit<ConfirmDialogOptions, 'width' | 'disableClose'>> {
  width?: string;
  disableClose?: boolean;
}
