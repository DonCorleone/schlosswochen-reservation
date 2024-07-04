import {Component} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
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
    <form
      name="chooser"
      method="post"
      netlify
      [formGroup]="fg">
      <input type="hidden" name="form-name" value="chooser" />
      <app-kids-selector id="selector" formControlName="kidsSelector"></app-kids-selector>
      <app-weeks-selector formControlName="numbers"></app-weeks-selector>
      <button type="submit" mat-stroked-button (click)="buttonClick()">Basic</button>
    </form>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
    }

    form {
      width: 90%;
      height: 90%;
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
  fg = this.fb.group({
    kidsSelector: [KidsSelectorComponent.generateGuid(), Validators.required],
    numbers: [[]]
  });

  constructor(private fb: FormBuilder) {
  }

  buttonClick() {
    console.log(JSON.stringify(this.fg.value));
  }
}
