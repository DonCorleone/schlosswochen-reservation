import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

const ICONS: Record<string, string> = {
  'armchair': `
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/>
    <path d="M5 9a2 2 0 0 0-2 2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2 2 2 0 0 0-2-2"/>
    <path d="M9 13v7"/><path d="M15 13v7"/>`,
  'circle-help': `
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>`,
  'chevron-down': `<path d="m6 9 6 6 6-6"/>`,
  'cloud-check': `
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
    <path d="m9 12 2 2 4-4"/>`,
  'calendar-clock': `
    <path d="M8 2v4"/><path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
    <circle cx="14.5" cy="15" r="3"/><path d="M14.5 14v1.2l.8.5"/>`,
  'link': `
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
  'minus': `<path d="M5 12h14"/>`,
  'plus': `<path d="M5 12h14"/><path d="M12 5v14"/>`,
  'search': `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
  'users': `
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  'check': `<path d="M20 6 9 12l-5 5"/>`,
  'x': `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  'grip-vertical': `
    <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
    <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>`,
  'route': `
    <circle cx="6" cy="19" r="3"/>
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>
    <circle cx="18" cy="5" r="3"/>`,
  'arrow-right': `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
  'arrow-up': `<path d="m6 15 6-6 6 6"/>`,
  'arrow-down': `<path d="m6 9 6 6 6-6"/>`,
  'info': `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`,
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg"
         [attr.width]="size()"
         [attr.height]="size()"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         stroke-width="1.7"
         stroke-linecap="round"
         stroke-linejoin="round"
         aria-hidden="true"
         [innerHTML]="svgHtml()"></svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      flex: none;
    }
  `],
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();
  readonly size = input(16);

  // Icon paths are compile-time constants defined above, never user input.
  protected readonly svgHtml = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()] ?? ''));
}
