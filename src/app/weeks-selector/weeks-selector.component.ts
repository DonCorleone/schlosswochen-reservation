import {Component, forwardRef} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {AddWeekComponent} from "../add-week/add-week.component";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
    selector: 'app-weeks-selector',
    imports: [
        CdkDropList, CdkDrag, AddWeekComponent, MatGridList, MatGridTile
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WeeksSelectorComponent),
            multi: true
        }
    ],
    templateUrl: './weeks-selector.component.html',
    styleUrls: ['./weeks-selector.component.scss']
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
