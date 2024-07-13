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
    <!--form
      name="chooser"
      method="post"
      netlify
      action="/schlosswochen/success"
      [formGroup]="fg">
      <input type="hidden" name="form-name" value="chooser" />
      <app-kids-selector id="selector" name="kids" formControlName="kidsSelector"></app-kids-selector>
      <app-weeks-selector name="weeks" formControlName="numbers"></app-weeks-selector>

      <button type="submit" mat-stroked-button>Submit</button>
    </form-->
    <form name="subscribe" method="post" action="/schlosswochen/success" netlify
          [formGroup]="fg"  (ngSubmit)="onSubmit()">
      <input type="hidden" name="form-name" value="subscribe" />
      <div class="grid grid-cols-1 gap-6">
        <label for="first_name" class="block">
          <span class="text-bleu-ceruleen-pale text-base">Vorname</span>
          <input
            type="text"
            name="first_name"
            id="first_name"
            class="mt-1 block w-full"
            required
          />
        </label>
        <label for="last_name" class="block">
          <span class="text-bleu-ceruleen-pale text-base">Nachname</span>
          <input
            type="text"
            name="last_name"
            id="last_name"
            class="mt-1 block w-full"
            required
          />
        </label>
        <label for="email" class="block">
          <span class="text-bleu-ceruleen-pale text-base">e-Mail</span>
          <input
            type="email"
            name="email"
            id="email"
            class="mt-1 block w-full"
            placeholder="john@example.com"
            required
          />
        </label>
        <app-kids-selector id="selector" name="kids" formControlName="kidsSelector"></app-kids-selector>
        <!--app-weeks-selector name="weeks" formControlName="numbers"></app-weeks-selector-->
        <button
          mat-flat-button
          color="primary"
          class="bg-rouge-rubia text-bleu-ceruleen-pale"
          type="submit"
        >
          Senden
        </button>
      </div>
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

  onSubmit() {
    console.log(JSON.stringify(this.fg.value));
  }
}
