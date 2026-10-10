import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

interface Step {
  number: string;
  label: string;
}

@Component({
  selector: 'app-journey-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="journey">
      <ol class="steps" aria-label="Reservation journey">
        @for (step of steps; track step.number; let i = $index, last = $last) {
          <li class="step" [class.active]="i < currentStep()">
            <span class="marker" [attr.aria-current]="i < currentStep() ? 'step' : null">{{ step.number }}</span>
            <span class="label">{{ step.label }}</span>
            @if (!last) {
              <span class="connector" aria-hidden="true"></span>
            }
          </li>
        }
      </ol>
      <div class="current-step">
        <span class="current-label">{{ activeLabel() }}</span>
        <span class="season mono">SUMMER 2027</span>
      </div>
    </div>
  `,
  styles: [`
    .journey {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 48px;
      box-sizing: border-box;
      background: var(--surface);
    }
    .steps {
      display: flex;
      align-items: center;
      gap: 20px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .step {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 100px;
      box-sizing: border-box;
      background: #171d1b;
      border: 1px solid var(--border);
      font-size: 11px;
      font-weight: 600;
      line-height: 13px;
      color: var(--muted);
    }
    .label {
      font-size: 13px;
      line-height: 16px;
      color: var(--muted);
    }
    .step.active .marker {
      background: var(--brand);
      border-color: var(--brand);
      color: var(--white);
    }
    .step.active .label {
      font-weight: 600;
      color: var(--accent);
    }
    .connector {
      width: 40px;
      height: 1px;
      background: var(--border-subtle);
    }
    .current-step {
      display: contents;
    }
    .current-label {
      display: none;
    }
    .season {
      font-size: 12px;
      line-height: 16px;
      color: var(--muted);
    }

    @media (max-width: 760px) {
      .journey {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        height: auto;
        padding: 16px 20px;
      }
      .steps {
        gap: 8px;
      }
      .step {
        flex: 1;
        gap: 8px;
      }
      .step:last-child {
        flex: 0 0 auto;
      }
      .label {
        display: none;
      }
      .connector {
        flex: 1;
        width: auto;
      }
      .current-step {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .current-label {
        display: inline;
        font-size: 13px;
        font-weight: 600;
        line-height: 16px;
        color: var(--accent);
      }
      .season {
        font-size: 10px;
      }
    }
  `],
})
export class JourneyStepsComponent {
  readonly currentStep = input(1);

  protected readonly steps: Step[] = [
    {number: '01', label: 'Plan your preferences'},
    {number: '02', label: 'Hold & confirm'},
    {number: '03', label: 'Reservation complete'},
  ];

  protected readonly activeLabel = computed(() => this.steps[this.currentStep() - 1]?.label ?? '');
}
