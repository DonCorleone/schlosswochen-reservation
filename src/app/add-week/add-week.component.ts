import {Component, Input, output} from '@angular/core';
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
  styles: `:host {
    cursor: pointer;
  }`
})
export class AddWeekComponent {
  @Input() mode!: 'add' | 'remove' | 'arrow_upward' | 'down';
  @Input() week!: number;
  onAction = output<number>();

  action() {
    this.onAction.emit(this.week);
  }
}
