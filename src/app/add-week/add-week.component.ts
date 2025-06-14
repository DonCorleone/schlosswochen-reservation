import {Component, output, input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-add-week',
    imports: [
        MatIcon
    ],
    template: `
    <div (click)="action()">
      <mat-icon aria-hidden="false" aria-label="Example home icon" [fontIcon]="mode()"></mat-icon>
    </div>
  `,
    styles: `:host {
    cursor: pointer;
  }`
})
export class AddWeekComponent {
  readonly mode = input.required<'add' | 'remove' | 'arrow_upward' | 'down'>();
  readonly week = input.required<number>();
  onAction = output<number>();

  action() {
    this.onAction.emit(this.week());
  }
}
