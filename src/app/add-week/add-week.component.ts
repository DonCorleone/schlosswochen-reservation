import {Component, output, input} from '@angular/core';

@Component({
    selector: 'app-add-week',
    template: `
    <div (click)="action()" role="button" tabindex="0" aria-label="{{getAriaLabel()}}">
      @switch (mode()) {
        @case ('add') { <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> }
        @case ('remove') { <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg> }
        @case ('arrow_upward') { <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"/></svg> }
        @case ('down') { <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg> }
      }
    </div>
  `,
    styles: `:host {
    cursor: pointer;
    display: inline-block;
    width: 24px;
    height: 24px;
  }
  svg {
    width: 100%;
    height: 100%;
  }`
})
export class AddWeekComponent {
  readonly mode = input.required<'add' | 'remove' | 'arrow_upward' | 'down'>();
  readonly week = input.required<number>();
  onAction = output<number>();

  getAriaLabel(): string {
    const m = this.mode();
    if (m === 'add') return 'Add week';
    if (m === 'remove') return 'Remove week';
    if (m === 'arrow_upward') return 'Move week up';
    return 'Move week down';
  }

  action() {
    this.onAction.emit(this.week());
  }
}
