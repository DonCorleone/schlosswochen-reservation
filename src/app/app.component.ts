import {Component} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from "@angular/material/form-field";
import {WeeksSelectorComponent} from "./weeks-selector/weeks-selector.component";
import {KidsSelectorComponent} from "./kids-selector/kids-selector.component";
import {SubmitterComponent} from "./submitter/submitter.component";

@Component({
    selector: 'app-root',
    imports: [
        MatFormFieldModule,
        WeeksSelectorComponent,
        KidsSelectorComponent,
        ReactiveFormsModule,
        SubmitterComponent
    ],
    template: `
    <form name="reservation" method="post" action="/schlosswochen/success" netlify
          [formGroup]="fg">
      <input type="hidden" name="form-name" value="reservation" />
        <app-kids-selector name="kidsSelector" formControlName="kidsSelector"></app-kids-selector>
        <app-weeks-selector name="numbers" formControlName="numbers"></app-weeks-selector>
        <app-submitter (onSubmit)="buttonClick()"></app-submitter>
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


  `]
})
export class AppComponent {

  fg = this.fb.group({
    kidsSelector: [KidsSelectorComponent.generateGuid(), Validators.required],
    numbers: [[]]
  });

  constructor(private fb: FormBuilder) {
  }

  buttonClick() {
    const formValues = this.fg.value;
    const data = {
      'form-name': 'reservation',  // Replace with your form name
      ...formValues
    };

    fetch('/', {
      method: 'POST',
      body: new URLSearchParams(data as any) ,
    })
      .then(() => alert('Form submitted'))
      .catch(error => alert(error));
  }
}
