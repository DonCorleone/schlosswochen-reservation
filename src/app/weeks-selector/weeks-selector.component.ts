import { Component, output } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatIcon} from "@angular/material/icon";
import {AddWeekComponent} from "../add-week/add-week.component";

@Component({
  selector: 'app-weeks-selector',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag, MatIcon, AddWeekComponent],
  templateUrl: './weeks-selector.component.html',
  styleUrls: ['./weeks-selector.component.scss']
})
export class WeeksSelectorComponent {
  todo = ['Woche 1', 'Woche 2', 'Woche 3'];

  done: string[] = [];
  selectionChanged = output<string[]>();

  action() {
    this.selectionChanged.emit(this.done);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.action();
    }
  }

  add($event: any) {

    // remove item from array todo.
    const index = this.todo.indexOf($event);
    if (index > -1) {
      this.todo.splice(index, 1);
    }
    // add item to array done.
    this.done.push($event);
    this.action();
  }

  remove($event: any) {
    // remove item from array done.
    const index = this.done.indexOf($event);
    if (index > -1) {
      this.done.splice(index, 1);
    }
    // add item to array todo.
    this.todo.push($event);
    this.action();
  }

  up($event: string) {
    const index = this.done.indexOf($event);
    if (index > 0) {
      const tmp = this.done[index - 1];
      this.done[index - 1] = $event;
      this.done[index] = tmp;
    }
    this.action();
  }
}
