import {Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {WeeksSelectorComponent} from './weeks-selector/weeks-selector.component';
import {KidsSelectorComponent} from './kids-selector/kids-selector.component';
import {SubmitterComponent} from './submitter/submitter.component';
import {NavigationComponent} from './navigation/navigation.component';
import {JourneyStepsComponent} from './journey-steps/journey-steps.component';
import {OpeningNoticeComponent} from './opening-notice/opening-notice.component';
import {IconComponent} from './icon/icon.component';
import {EVENTS} from './data/event-option';

@Component({
    selector: 'app-root',
    imports: [
        ReactiveFormsModule,
        WeeksSelectorComponent,
        KidsSelectorComponent,
        SubmitterComponent,
        NavigationComponent,
        JourneyStepsComponent,
        OpeningNoticeComponent,
        IconComponent,
    ],
    template: `
    <app-navigation/>
    <app-journey-steps/>
    <form name="reservation" method="post" action="/schlosswochen/success" netlify
          [formGroup]="fg" aria-label="Reservation form">
      <input type="hidden" name="form-name" value="reservation"/>
      <main class="workspace">
        <section class="page-heading">
          <div class="heading">
            <h1>Plan your summer reservation.</h1>
            <p>Choose your dates, then put your favourites in order. We’ll keep your group together.</p>
          </div>
          <span class="pill status">
            <app-icon name="cloud-check" [size]="14"/>
            <span>Preferences saved</span>
          </span>
        </section>

        <app-opening-notice/>

        <app-weeks-selector formControlName="numbers" [participants]="participantsCount()">
          <div slot="participants">
            <app-kids-selector name="kidsSelector" formControlName="kidsSelector"></app-kids-selector>
          </div>
          <div slot="quick-action">
            <app-submitter (onSubmit)="buttonClick()"></app-submitter>
          </div>
          <div slot="action">
            <app-submitter (onSubmit)="buttonClick()"></app-submitter>
          </div>
        </app-weeks-selector>
      </main>
      <div class="action-bar">
        <p class="plan-summary">{{ planSummary() }}</p>
        <app-submitter (onSubmit)="buttonClick()"></app-submitter>
      </div>
    </form>
    <footer class="utility-footer">
      <span>All times in Central European Summer Time (CEST)</span>
      <nav class="footer-links" aria-label="Footer">
        <a href="#">Booking help</a>
        <span aria-hidden="true">·</span>
        <a href="#">Privacy</a>
        <span aria-hidden="true">·</span>
        <a href="#">Terms</a>
      </nav>
    </footer>
  `,
    styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .workspace {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
      max-width: 1440px;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 34px 48px 40px;
    }
    .page-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
    .heading {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .heading h1 {
      margin: 0;
      font-size: 34px;
      font-weight: 600;
      line-height: 41px;
      color: var(--text);
    }
    .heading p {
      margin: 0;
      font-size: 14px;
      line-height: 17px;
      color: var(--muted);
    }
    .action-bar {
      display: none;
    }
    .utility-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 48px;
      box-sizing: border-box;
      border-top: 1px solid var(--border-subtle);
      font-size: 12px;
      line-height: 15px;
      color: var(--muted);
    }
    .footer-links {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .footer-links a {
      color: var(--muted);
      text-decoration: none;
    }
    .footer-links a:hover {
      color: var(--text);
    }
    @media (max-width: 800px) {
      .workspace {
        padding: 24px;
      }
      .utility-footer {
        padding: 20px 24px;
        flex-direction: column;
        gap: 8px;
      }
    }
    @media (max-width: 760px) {
      .workspace {
        padding: 24px 20px;
        gap: 24px;
      }
      .page-heading {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .heading {
        gap: 12px;
      }
      .heading h1 {
        font-size: 28px;
        line-height: 34px;
      }
      .heading p {
        line-height: 21px;
      }
      .action-bar {
        position: sticky;
        bottom: 0;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
        box-sizing: border-box;
        background: var(--surface);
        border-top: 1px solid var(--border-subtle);
      }
      .plan-summary {
        margin: 0;
        font-size: 12px;
        line-height: 15px;
        color: var(--muted);
      }
      .utility-footer {
        padding: 24px 20px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        font-size: 11px;
      }
    }
  `]
})
export class AppComponent {
  private fb = inject(FormBuilder);

  fg = this.fb.group({
    kidsSelector: [KidsSelectorComponent.generateGuid(), Validators.required],
    numbers: [[]]
  });

  participantsCount = signal(1);
  private readonly choices = signal<number[]>([]);

  private readonly firstChoiceShort = computed(() => {
    const first = this.choices()[0];
    if (!first) {
      return null;
    }
    const event = EVENTS.find(e => e.id === first);
    if (!event) {
      return null;
    }
    const part = event.title.split('—');
    return part[1]?.trim() ?? event.title;
  });

  protected readonly planSummary = computed(() => {
    const first = this.firstChoiceShort();
    const choices = this.choices().length;
    const base = `${this.participantsCount()} participants · ${choices} choice${choices === 1 ? '' : 's'}`;
    return first ? `${base} · ${first} first` : base;
  });

  constructor() {
    this.fg.get('kidsSelector')?.valueChanges.subscribe(value => {
      this.participantsCount.set(value ? value.split(',').length : 0);
    });
    this.fg.get('numbers')?.valueChanges.subscribe(value => {
      this.choices.set(value ?? []);
    });
  }

  buttonClick() {
    const formValues = this.fg.value;
    const data = {
      'form-name': 'reservation',
      ...formValues
    };

    fetch('/', {
      method: 'POST',
      body: new URLSearchParams(data as unknown as Record<string, string>),
    })
      .then(() => alert('Form submitted'))
      .catch(error => alert(error));
  }
}
