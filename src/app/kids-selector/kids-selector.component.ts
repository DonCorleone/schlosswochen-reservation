import {Component} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatIcon} from "@angular/material/icon";
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
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatIcon,
    NgClass
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: KidsSelectorComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: KidsSelectorComponent
    }
  ],
  templateUrl: `./kids-selector.component.html`,
  styleUrls: ['./kids-selector.component.scss']
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
