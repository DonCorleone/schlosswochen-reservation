import {Component, output, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-submitter',
    template: `
    <div class="grid-container">
      <div class="grid-tile" colspan="2"></div>
      <div class="grid-tile" colspan="5"></div>
      <div class="grid-tile" colspan="2"></div>
      <div class="grid-tile" colspan="2"></div>
      <div class="grid-tile" colspan="5">
        <button
          class="bg-rouge-rubia text-bleu-ceruleen-pale"
          type="submit"
          (click)="buttonClick()"
        >
          Senden
        </button>
      </div>
      <div class="grid-tile" colspan="2"></div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: `
    :host {
      min-height: 20px;
      display: flex;
      justify-content: center;
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      grid-auto-rows: 50px;
      width: 100%;
    }
    .grid-tile {
      grid-column: span 1;
    }
    .grid-tile[colspan="2"] { grid-column: span 2; }
    .grid-tile[colspan="5"] { grid-column: span 5; }
    button {
      width: 100%;
      max-width: 300px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `
})
export class SubmitterComponent {
  onSubmit = output();

  buttonClick() {
    this.onSubmit.emit();
  }
}
