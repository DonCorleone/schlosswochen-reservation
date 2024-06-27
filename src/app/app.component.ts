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
    <app-kids-selector (amountChanged)="amountChanged($event)"></app-kids-selector>
    <app-weeks-selector (selectionChanged)="selectionChanged($event)"></app-weeks-selector>
    <div class="selectedWeeks">Selected Weeks: {{ selectedWeeks }}</div>
    <div class="selectedKids">Selected Kids: {{ selectedKids }}</div>
    <section>
      <div class="example-button-row">
        <button mat-stroked-button (click)="buttonClick()">Basic</button>
      </div>
    </section>
    <div class="selectedGuids">Selected Guids: {{ selectedGuids }}</div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
    }

    app-weeks-selector {
      width: 100%;
    }

    .selectedWeeks {
      margin: 20px;
    }

    .selectedKids {
      margin: 20px;
    }
  `],
})
export class AppComponent {
  selectedWeeks = '';
  selectedKids = 1;
  selectedGuids: string = '';

  selectionChanged($event: string[]) {
    this.selectedWeeks = $event.join(', ');
  }

  amountChanged($event: number) {
    this.selectedKids = $event;
  }

  buttonClick() {

    // build a GUID for each selected kid
    const guids = [];
    for (let i = 0; i < this.selectedKids; i++) {
      guids.push(this.generateGuid());
    }
    this.selectedGuids = guids.join(', ');
  }

  private generateGuid(): string {

    // generate a GUID
    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
      );
    }
}
