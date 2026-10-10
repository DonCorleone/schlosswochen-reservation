import {Component, forwardRef} from '@angular/core';
import {NgClass} from "@angular/common";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";

@Component({
    selector: 'app-kids-selector',
    imports: [NgClass],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => KidsSelectorComponent),
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: KidsSelectorComponent
        }
    ],
    template: `
    <div class="grid-container">
      <div class="grid-tile" colspan="4"><b>Weniger Kinder</b></div>
      <div class="grid-tile" colspan="1"></div>
      <div class="grid-tile" colspan="4"><b>Mehr Kinder</b></div>
      <div class="grid-tile tile-button" colspan="4" (click)="onRemove()" [ngClass]="{'active': amount > 1}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      </div>
      <div class="grid-tile">{{ amount }}</div>
      <div class="grid-tile tile-button" colspan="4" (click)="onAdd()" [ngClass]="{'active': amount < 3}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      </div>
    </div>
  `,
    styles: `
    :host {
      min-height: 20px;
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      grid-auto-rows: 50px;
      width: 100%;
    }
    .grid-tile {
      display: flex;
      justify-content: center;
      align-items: center;
      border: solid 1px #ccc;
      border-radius: 4px;
      grid-column: span 1;
      svg {
        width: 24px;
        height: 24px;
      }
    }
    .grid-tile[colspan="4"] { grid-column: span 4; }
    .grid-tile[colspan="1"] { grid-column: span 1; }
    .tile-button {
      color: black;
      pointer-events: none;
      cursor: default;
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
    }
  `
})
export class KidsSelectorComponent implements ControlValueAccessor, Validator {

  amount: number = 1;
  amountString: string = '';
  touched = false;
  disabled = false;

  static generateGuid(): string {

    // generate a GUID
    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    // split the string into an array of strings, by splitting at the comma
    const amountArray = control.value?.split(',');
    const quantity = amountArray?.length;
    if (quantity <= 0) {
      return {
        mustBePositive: {
          quantity
        }
      };
    }
    return null;
  }

  writeValue(amountStr: string): void {
    this.amountString = amountStr;
    // split the string into an array of strings, by splitting at the comma
    const amountArray = amountStr.split(',');
    this.amount = amountArray.length;
  }

  onChange = (amountStr: string) => {
    console.log(amountStr);
  };

  onTouched = () => {
  };

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  onAdd() {
    this.markAsTouched();
    if (!this.disabled) {
      // Generate a single new GUID
      const newGuid = KidsSelectorComponent.generateGuid();
      // Append the new GUID to the existing string, with handling for empty strings
      this.amountString = this.amountString ? `${this.amountString},${newGuid}` : newGuid;
      this.amount++;
      this.onChange(this.amountString);
    }
  }

  onRemove() {
    this.markAsTouched();
    if (!this.disabled && this.amount > 0) {
      // Convert the string to an array, remove the last element, and decrement the amount
      const guids = this.amountString.split(',');
      guids.pop();
      this.amount--;
      // Join the array back into a string
      this.amountString = guids.join(',');
      this.onChange(this.amountString);
    }
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
