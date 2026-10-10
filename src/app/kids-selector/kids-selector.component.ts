import {Component, forwardRef, signal, computed} from '@angular/core';
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
    <div class="grid-container" role="group" aria-label="Kinder Auswahl">
      <div class="grid-tile" colspan="4"><b>Weniger Kinder</b></div>
      <div class="grid-tile" colspan="1"></div>
      <div class="grid-tile" colspan="4"><b>Mehr Kinder</b></div>
      <div class="grid-tile tile-button" colspan="4" (click)="onRemove()" [class.active]="canRemove()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      </div>
      <div class="grid-tile" aria-live="polite">{{ amount() }}</div>
      <div class="grid-tile tile-button" colspan="4" (click)="onAdd()" [class.active]="canAdd()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
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
    }
    .tile-button.active {
      background-color: lightcoral;
      color: white;
      pointer-events: all;
      cursor: pointer;
    }
    .tile-button.active:hover {
      background-color: lightblue;
      color: white;
    }
  `
})
export class KidsSelectorComponent implements ControlValueAccessor, Validator {

  amount = signal(1);
  amountString = signal('');
  touched = false;
  disabled = false;

  canAdd = computed(() => this.amount() < 3);
  canRemove = computed(() => this.amount() > 1);

  static generateGuid(): string {
     return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
       (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
     );
   }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
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
     this.amountString.set(amountStr);
     const amountArray = amountStr.split(',');
     this.amount.set(amountArray.length);
   }

  onChange = (amountStr: string) => {};
  onTouched = () => {};

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
       const newGuid = KidsSelectorComponent.generateGuid();
       const current = this.amountString();
       this.amountString.set(current ? `${current},${newGuid}` : newGuid);
       this.amount.update(a => a + 1);
       this.onChange(this.amountString());
     }
   }

  onRemove() {
     this.markAsTouched();
     if (!this.disabled && this.amount() > 0) {
       const guids = this.amountString().split(',');
       guids.pop();
       this.amount.update(a => a - 1);
       this.amountString.set(guids.join(','));
       this.onChange(this.amountString());
     }
   }

  markAsTouched() {
     if (!this.touched) {
       this.onTouched();
       this.touched = true;
     }
  }
}
