import {Component, forwardRef} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {AddWeekComponent} from "../add-week/add-week.component";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-weeks-selector',
    imports: [CdkDropList, CdkDrag, AddWeekComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WeeksSelectorComponent),
            multi: true
        }
    ],
    template: `
    <div class="grid-container">
      <div class="grid-tile" colspan="4"><b>Auswahl Wochen</b></div>
      <div class="grid-tile" colspan="1"></div>
      <div class="grid-tile" colspan="4"><b>Reservation Wochen</b></div>
      <div class="grid-tile source-list" colspan="4" rowspan="6">
        <div
          #todoList="cdkDropList"
          (cdkDropListDropped)="drop($event)"
          [cdkDropListConnectedTo]="[doneList]"
          [cdkDropListData]="weeks"
          cdkDropList
          class="list">
          @for (item of weeks; track item) {
            <div class="box" cdkDrag>{{ item }}
              <app-add-week [mode]="'add'" [week]="item" (onAction)="add($event)"></app-add-week>
            </div>
          }
        </div>
      </div>
      <div class="grid-tile gutter" rowspan="6"></div>
      <div class="grid-tile target-list" rowspan="6" colspan="4">
        <div
          #doneList="cdkDropList"
          (cdkDropListDropped)="drop($event)"
          [cdkDropListConnectedTo]="[todoList]"
          [cdkDropListData]="weeksSelected"
          cdkDropList
          class="list">
          @for (item of weeksSelected; track item) {
            <div class="box" cdkDrag>{{ item }}
              @if (weeksSelected.indexOf(item) > 0) {
                <app-add-week [mode]="'arrow_upward'" [week]="item" (onAction)="up($event)"></app-add-week>
              }
              <app-add-week [mode]="'remove'" [week]="item" (onAction)="remove($event)"></app-add-week>
            </div>
          }
        </div>
      </div>
    </div>
  `,
    styles: `
    :host {
      display: block;
      max-width: 100%;
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      grid-auto-rows: 50px;
      width: 100%;
      margin: 0 auto;
    }
    .grid-tile {
      display: flex;
      justify-content: center;
      align-items: center;
      border: solid 1px #ccc;
      border-radius: 4px;
      grid-column: span 1;
      overflow: hidden;
    }
    .grid-tile[colspan="4"] { grid-column: span 4; }
    .grid-tile[colspan="1"] { grid-column: span 1; }
    .grid-tile[rowspan="6"] { grid-row: span 6; }
    .source-list, .target-list, .gutter {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .list {
      outline: solid 1px #ccc;
      margin: 1px;
      border-radius: 4px;
      min-height: 60px;
      height: 300px;
      width: 100%;
      background: white;
      overflow: hidden;
      display: block;
    }
    .box {
      padding: 10px;
      margin: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background-color: white;
      box-sizing: border-box;
      cursor: grab;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.87);
    }
    .cdk-drag-preview {
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    .cdk-drag-placeholder {
      opacity: 0;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .list.cdk-drop-list-dragging .box:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `
})
export class WeeksSelectorComponent implements ControlValueAccessor {
  weeks = [1, 2, 3];
  weeksSelected: number[] = [];
  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  add($event: any) {

    // remove item from array todo.
    const index = this.weeks.indexOf($event);
    if (index > -1) {
      this.weeks.splice(index, 1);
    }
    // add item to array done.
    this.weeksSelected.push($event);
  }

  remove($event: any) {
    // remove item from array done.
    const index = this.weeksSelected.indexOf($event);
    if (index > -1) {
      this.weeksSelected.splice(index, 1);
    }
    // add item to array todo.
    this.weeks.push($event);

    this.onChange(this.weeksSelected);
    this.onTouched();
  }

  up($event: number) {
    const index = this.weeksSelected.indexOf($event);
    if (index > 0) {
      const tmp = this.weeksSelected[index - 1];
      this.weeksSelected[index - 1] = $event;
      this.weeksSelected[index] = tmp;

      this.onChange(this.weeksSelected);
      this.onTouched();
    }
  }

  writeValue(value: number[]): void {
    this.weeksSelected = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
