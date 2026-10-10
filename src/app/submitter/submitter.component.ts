import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'app-submitter',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="action" type="submit" (click)="buttonClick()" aria-label="Review & get ready">
      <span>Review &amp; get ready</span>
      <app-icon name="arrow-right" [size]="18"/>
    </button>
  `,
  styles: [`
    :host {
      display: block;
    }
    .action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      border-radius: 8px;
      background: var(--brand);
      color: var(--white);
      font-size: 14px;
      font-weight: 600;
      line-height: 17px;
    }
    .action:hover {
      filter: brightness(1.15);
    }

    @media (max-width: 760px) {
      .action {
        height: 52px;
      }
    }
  `],
})
export class SubmitterComponent {
  onSubmit = output();

  buttonClick() {
    this.onSubmit.emit();
  }
}
