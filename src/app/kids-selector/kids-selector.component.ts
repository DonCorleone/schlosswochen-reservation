import {Component, output} from '@angular/core';
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
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    const quantity = control.value;
    if (quantity <= 0) {
      return {
        mustBePositive: {
          quantity
        }
      };
    }
    return null;
  }

  amount: number = 1;
  writeValue(amount: number): void {
    this.amount = amount;
  }

  onChange = (amount: number) => {
    console.log(amount);
  };
  onTouched = () => {};
  touched = false;
  disabled = false;

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  onRemove() {
    this.markAsTouched();
    if (!this.disabled) {
      this.amount--;
      this.onChange(this.amount)
    }
  }
  onAdd() {
    this.markAsTouched();
    if (!this.disabled) {
      this.amount++;
      this.onChange(this.amount)
    }
  }
  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
