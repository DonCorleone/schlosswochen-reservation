import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  PristineChangeEvent,
  ReactiveFormsModule, StatusChangeEvent,
  TouchedChangeEvent,
  ValueChangeEvent
} from '@angular/forms';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {WeeksSelectorComponent} from "./weeks-selector/weeks-selector.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    WeeksSelectorComponent
  ],
  template: `
    <mat-form-field>
      <mat-label>Input</mat-label>
      <input matInput type="text" id="name" [formControl]=title>
    </mat-form-field>
    <app-weeks-selector></app-weeks-selector>
  `,
  styles: [],
})
export class AppComponent implements OnInit{
  title = new FormControl('My App');

  ngOnInit() {
    this.title.events.subscribe((event) => {
      if (event instanceof TouchedChangeEvent) {
        console.log('Touched: ' + event.touched);
      }
      if (event instanceof PristineChangeEvent) {
        console.log('Pristine: ' + event.pristine);
      }
      if (event instanceof ValueChangeEvent) {
        console.log('ValueChange: ' + event.value);
      }
      if (event instanceof StatusChangeEvent) {
        console.log('StatusChange: ' + event.status);
      }
    });
  }
}
