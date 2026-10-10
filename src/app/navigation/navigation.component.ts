import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'app-navigation',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="navigation">
      <a class="brand" href="#" aria-label="FirstSeat home">
        <span class="brand-mark"><app-icon name="armchair" [size]="22"/></span>
        <span class="brand-name">FirstSeat</span>
      </a>
      <nav class="primary-nav" aria-label="Primary">
        <a class="active" href="#" aria-current="page">Reservation planner</a>
        <a href="#">My reservations</a>
      </nav>
      <div class="account-utilities">
        <a class="help" href="#" aria-label="Help and support">
          <app-icon name="circle-help" [size]="20"/>
          <span class="help-label">Help &amp; support</span>
        </a>
        <span class="separator" aria-hidden="true"></span>
        <button class="account" type="button" aria-label="Account: Jamie Laurent">
          <span class="avatar">JL</span>
          <span class="name">Jamie Laurent</span>
          <app-icon class="account-chevron" name="chevron-down" [size]="14"/>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .navigation {
      display: flex;
      align-items: center;
      gap: 48px;
      height: 84px;
      padding: 0 48px;
      box-sizing: border-box;
      background: var(--surface);
      border-bottom: 1px solid var(--border-subtle);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: inherit;
    }
    .brand-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--brand);
      color: var(--white);
    }
    .brand-name {
      font-size: 24px;
      font-weight: 700;
      line-height: 29px;
      color: var(--text);
    }
    .primary-nav {
      display: flex;
      align-items: center;
      gap: 28px;
    }
    .primary-nav a {
      font-size: 14px;
      line-height: 17px;
      text-decoration: none;
      color: var(--muted);
    }
    .primary-nav a.active {
      font-weight: 600;
      color: var(--accent);
    }
    .account-utilities {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-left: auto;
    }
    .help {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: var(--muted);
      text-decoration: none;
    }
    .separator {
      width: 1px;
      height: 24px;
      background: var(--border-subtle);
    }
    .account {
      display: flex;
      align-items: center;
      gap: 9px;
      color: var(--accent);
    }
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 100px;
      background: var(--brand);
      color: var(--white);
      font-size: 12px;
      font-weight: 600;
    }
    .name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text);
    }

    @media (max-width: 760px) {
      .navigation {
        flex-wrap: wrap;
        gap: 0;
        height: auto;
        padding: 0 20px;
        border-bottom: none;
      }
      .brand {
        height: 76px;
      }
      .brand-mark {
        width: 34px;
        height: 34px;
      }
      .brand-name {
        font-size: 22px;
        line-height: 27px;
      }
      .account-utilities {
        gap: 4px;
      }
      .help {
        width: 44px;
        height: 44px;
        justify-content: center;
      }
      .help-label,
      .separator,
      .name,
      .account-chevron {
        display: none;
      }
      .avatar {
        width: 40px;
        height: 40px;
        background: var(--badge);
        font-size: 13px;
      }
      .primary-nav {
        order: 3;
        width: calc(100% + 40px);
        height: 44px;
        gap: 22px;
        margin: 0 -20px;
        padding: 0 20px;
        box-sizing: border-box;
        border-bottom: 1px solid var(--border-subtle);
      }
      .primary-nav a {
        font-size: 13px;
      }
    }
  `],
})
export class NavigationComponent {}
