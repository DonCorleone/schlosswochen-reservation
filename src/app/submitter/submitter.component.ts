import {Component, output, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {AddWeekComponent} from "../add-week/add-week.component";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
  selector: 'app-submitter',
  standalone: true,
  imports: [
    MatButton,
    AddWeekComponent,
    CdkDrag,
    CdkDropList,
    MatGridList,
    MatGridTile
  ],
  template: `
    <mat-grid-list cols="1" rowHeight="50">
      <mat-grid-tile>

      </mat-grid-tile>
      <mat-grid-tile>
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
  `
})
export class SubmitterComponent {
  onSubmit = output();

  buttonClick() {
    this.onSubmit.emit();
  }
}
