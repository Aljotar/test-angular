import { Component, type OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-client-modal',
  templateUrl: './remove-client-modal.component.html',
  styleUrls: ['./remove-client-modal.component.scss'],
})
export class RemoveClientModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<RemoveClientModalComponent>) {}

  ngOnInit(): void {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
