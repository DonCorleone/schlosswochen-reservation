import {Component, output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
    selector: 'app-submitter',
    imports: [
        MatButton,
        MatGridList,
        MatGridTile
    ],
    template: `
    <mat-grid-list cols="9" rowHeight="50">

      <mat-grid-tile colspan="2" />
      <mat-grid-tile colspan="5" />
      <mat-grid-tile colspan="2" />

      <mat-grid-tile colspan="2" />
      <mat-grid-tile  colspan="5">
        <button
          mat-flat-button
          color="primary"
          class="bg-rouge-rubia text-bleu-ceruleen-pale"
          type="submit"
          (click)="buttonClick()"
        >
          Senden
        </button>
      </mat-grid-tile>
      <mat-grid-tile colspan="2" />
    </mat-grid-list>
  `,
    styles: `
    :host {
      min-height: 20px;
      display: flex;
      justify-content: center;
    }
    mat-grid-list {
      width: 100%;
    }
    button {
      width: 100%;
      max-width: 300px;
    }
  `
})
export class SubmitterComponent {
  onSubmit = output();

  buttonClick() {
    this.onSubmit.emit();
  }
}
