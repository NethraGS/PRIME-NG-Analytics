import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-streetlight-dialog',
  templateUrl: './streetlight-dialog.component.html',
  styleUrls: ['./streetlight-dialog.component.scss']
})
export class StreetlightDialogComponent {
  light: { id: number; name: string; status: boolean };

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.light = config.data.light;
  }

  toggleLight(): void {
    this.light.status = !this.light.status; // Toggle the status
    this.ref.close(this.light.status); // Close dialog with the new status
  }
}
