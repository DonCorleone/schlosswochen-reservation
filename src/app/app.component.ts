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
import {MatAnchor, MatButton} from "@angular/material/button";
import {KidsSelectorComponent} from "./kids-selector/kids-selector.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    WeeksSelectorComponent,
    MatButton,
    MatAnchor,
    KidsSelectorComponent
  ],
  template: `
    <app-kids-selector>

    </app-kids-selector>
    <app-weeks-selector></app-weeks-selector>
    <section>
      <div class="example-button-row">
        <button mat-stroked-button>Basic</button>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    app-weeks-selector {
      width: 100%;
    }
  `],
})
export class AppComponent {
  title = 'angular-material';


}
