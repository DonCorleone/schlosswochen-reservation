import {Component, output} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {Action} from "rxjs/internal/scheduler/Action";

@Component({
  selector: 'app-kids-selector',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatIcon,
    NgClass
  ],
  template: `
    <mat-grid-list cols="5" rowHeight="2:1" >
      <mat-grid-tile colspan="2" class="tile-button" [ngClass]="{'active': amount > 1}" (click)="down()">
        <mat-icon aria-hidden="false" aria-label="Example home icon" fontIcon="remove"></mat-icon>
      </mat-grid-tile>
      <mat-grid-tile>{{ amount }}</mat-grid-tile>
      <mat-grid-tile colspan="2" class="tile-button" [ngClass]="{'active': amount < 3}"  (click)="up()">
        <mat-icon aria-hidden="false" aria-label="Example home icon" fontIcon="add"></mat-icon>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: `
    :host{
      min-height: 20px;
      width: 100%;
    }
    .tile-button {

      color: black;
      pointer-events: none;

      &.active {
        background-color: lightcoral;
        color: white;
        pointer-events: all;
        cursor: pointer;
        &:hover {
          background-color: lightblue;
          color: white;
        }
      }

      border: solid 1px #ccc;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `
})
export class KidsSelectorComponent {
  amount: number = 1;
  amountChanged = output<number>();

  action() {
    this.amountChanged.emit(this.amount);
  }

  down() {
    this.amount--;
    this.action();
  }

  up() {
    this.amount++;
    this.action();
  }
}
