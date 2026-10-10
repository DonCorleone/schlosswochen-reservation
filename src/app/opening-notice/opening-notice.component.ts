import {ChangeDetectionStrategy, Component, OnDestroy, signal} from '@angular/core';
import {IconComponent} from '../icon/icon.component';

const OPENING_TIME = Date.parse('2027-04-06T10:00:00+02:00'); // Tuesday, 6 April 2027, 10:00 CEST

@Component({
  selector: 'app-opening-notice',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="notice" aria-label="Registration opening">
      <span class="icon-chip"><app-icon name="calendar-clock" [size]="20"/></span>
      <div class="details">
        <p class="status">
          <app-icon class="inline-icon" name="calendar-clock" [size]="24"/>
          <span>All four events open registration at the same time</span>
        </p>
        <p class="timestamp mono">TUESDAY, 6 APRIL 2027&nbsp; · &nbsp;10:00 CEST</p>
      </div>
      <hr class="notice-divider"/>
      <div class="countdown">
        <span class="countdown-label">Registration opens in</span>
        <span class="time-remaining mono" role="timer" aria-label="{{ timeRemaining() }}">
          {{ timeRemaining() }}
        </span>
      </div>
    </section>
  `,
  styles: [`
    .notice {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 12px;
      background: var(--badge);
      border: 1px solid transparent;
    }
    .icon-chip {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--surface);
      color: var(--accent);
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      line-height: 17px;
      color: var(--accent);
    }
    .inline-icon {
      display: none;
    }
    .timestamp {
      margin: 0;
      font-size: 13px;
      line-height: 17px;
      color: var(--text);
    }
    .notice-divider {
      display: none;
    }
    .countdown {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 5px;
      flex: none;
    }
    .countdown-label {
      font-size: 11px;
      line-height: 13px;
      color: var(--muted);
    }
    .time-remaining {
      font-size: 20px;
      font-weight: 500;
      line-height: 26px;
      color: var(--accent);
      font-variant-numeric: tabular-nums;
    }

    @media (max-width: 760px) {
      .notice {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        padding: 18px;
        border-radius: 16px;
        border-color: var(--border-subtle);
      }
      .icon-chip {
        display: none;
      }
      .details {
        gap: 16px;
      }
      .status {
        align-items: flex-start;
        gap: 10px;
        line-height: 21px;
      }
      .inline-icon {
        display: inline-flex;
        flex: none;
      }
      .timestamp {
        font-size: 12px;
        line-height: 18px;
      }
      .notice-divider {
        display: block;
        width: 100%;
        height: 1px;
        margin: 0;
        border: none;
        background: var(--border-subtle);
      }
      .countdown {
        align-items: flex-start;
        gap: 5px;
      }
      .time-remaining {
        font-size: 23px;
        line-height: 30px;
      }
    }
  `],
})
export class OpeningNoticeComponent implements OnDestroy {
  readonly timeRemaining = signal(this.computeRemaining());

  private readonly interval = setInterval(() => {
    this.timeRemaining.set(this.computeRemaining());
  }, 1000);

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  private computeRemaining(): string {
    const diff = Math.max(0, OPENING_TIME - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }
}
