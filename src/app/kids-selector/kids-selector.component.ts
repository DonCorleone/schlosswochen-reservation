import {ChangeDetectionStrategy, Component, computed, forwardRef, signal} from '@angular/core';
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {IconComponent} from '../icon/icon.component';
import {
  AbstractControl,
  ControlValueAccessor,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-kids-selector',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => KidsSelectorComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => KidsSelectorComponent),
    },
  ],
  template: `
    <div class="participant-setup" role="group" aria-label="Participant selection">
      <div class="instructions">
        <h2 class="heading">Who’s coming along?</h2>
        <p class="rule">
          <app-icon name="link" [size]="14"/>
          <span>All {{ amount() }} participants must fit in the same event.</span>
        </p>
      </div>
      <div class="selector">
        <button class="step-button" type="button" (click)="onRemove()" [disabled]="!canRemove()"
                aria-label="Remove one participant">
          <app-icon name="minus" [size]="16"/>
        </button>
        <div class="count" aria-live="polite">
          <span class="value">{{ amount() }}</span>
          <span class="unit">participants</span>
        </div>
        <button class="step-button" type="button" (click)="onAdd()" [disabled]="!canAdd()"
                aria-label="Add one participant">
          <app-icon name="plus" [size]="16"/>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .participant-setup {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 22px;
      box-sizing: border-box;
      border-radius: 12px;
      background: var(--surface);
      border: 1px solid var(--border);
    }
    .instructions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .heading {
      margin: 0;
      font-size: 17px;
      font-weight: 600;
      line-height: 21px;
      color: var(--text);
    }
    .rule {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      font-size: 13px;
      line-height: 16px;
      color: var(--muted);
    }
    .rule app-icon {
      color: var(--accent);
    }
    .selector {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .step-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      box-sizing: border-box;
      background: var(--surface-sunken);
      border: 1px solid var(--border);
      color: var(--accent);
    }
    .step-button:disabled {
      color: var(--border);
      cursor: default;
    }
    .count {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      min-width: 62px;
    }
    .value {
      font-size: 26px;
      font-weight: 600;
      line-height: 31px;
      color: var(--text);
    }
    .unit {
      font-size: 11px;
      line-height: 13px;
      color: var(--muted);
    }

    @media (max-width: 760px) {
      .participant-setup {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        padding: 18px;
        border-radius: 16px;
      }
      .instructions {
        gap: 16px;
      }
      .rule app-icon {
        display: none;
      }
      .selector {
        justify-content: space-between;
        width: 100%;
      }
      .step-button {
        width: 48px;
        height: 48px;
      }
      .count {
        gap: 3px;
        min-width: 68px;
      }
      .value {
        font-size: 28px;
        line-height: 34px;
      }
      .unit {
        font-size: 12px;
      }
    }
  `],
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
     const amountArray = (control.value as string | undefined)?.split(',');
     const quantity = amountArray?.length ?? 0;
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
    if (!this.disabled && this.canAdd()) {
      const newGuid = KidsSelectorComponent.generateGuid();
      const current = this.amountString();
      this.amountString.set(current ? `${current},${newGuid}` : newGuid);
      this.amount.update(a => a + 1);
      this.onChange(this.amountString());
    }
  }

  onRemove() {
    this.markAsTouched();
    if (!this.disabled && this.canRemove()) {
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
