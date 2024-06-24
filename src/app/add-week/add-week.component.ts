import {Component, Input, output, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-add-week',
  standalone: true,
  imports: [
    MatIcon
  ],
  template: `
    <div (click)="action()">
      <mat-icon aria-hidden="false" aria-label="Example home icon" [fontIcon]="mode"></mat-icon>
    </div>
  `,
  styles: ``
})
export class AddWeekComponent {
  @Input() mode!: 'add'|'remove';
  @Input() week!: string;
  onAction = output<string>();
  action() {
    this.onAction.emit(this.week);
  }
}
