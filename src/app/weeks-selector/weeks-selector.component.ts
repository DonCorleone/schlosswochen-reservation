import {ChangeDetectionStrategy, Component, computed, forwardRef, input, signal} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {viewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {EVENTS, EventOption} from '../data/event-option';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'app-weeks-selector',
  imports: [CdkDropList, CdkDrag, CdkDragHandle, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeeksSelectorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="planning-workspace">
      <section class="event-discovery" aria-label="Find your event">
        <ng-content select="[slot=participants]"/>

        <div class="quick-action">
          <ng-content select="[slot=quick-action]"/>
          <p class="order-shortcut">{{ selected().length }} saved choices · Your reservation order ↓</p>
        </div>

        <div class="discovery-heading">
          <h2>Find your event</h2>
          <span class="results">{{ filtered().length }} events · Summer 2027</span>
        </div>

        <div class="discovery-filters">
          <label class="search">
            <app-icon name="search" [size]="17"/>
            <input
              type="search"
              placeholder="Search events or destinations"
              aria-label="Search events or destinations"
              [value]="searchQuery()"
              (input)="searchQuery.set(targetValue($event))"/>
          </label>
          <label class="filter">
            <select aria-label="Filter by date" [value]="dateFilter()" (change)="dateFilter.set(targetValue($event))">
              <option value="all">All dates</option>
              <option value="July">July</option>
              <option value="August">August</option>
            </select>
            <app-icon name="chevron-down" [size]="14"/>
          </label>
          <label class="filter">
            <select aria-label="Filter by activity" [value]="activityFilter()" (change)="activityFilter.set(targetValue($event))">
              <option value="all">All activities</option>
              <option value="alpine">Alpine adventure</option>
              <option value="lakeside">Lakeside camp</option>
            </select>
            <app-icon name="chevron-down" [size]="14"/>
          </label>
        </div>

        <div
          #availableList="cdkDropList"
          cdkDropList
          [cdkDropListData]="filteredIds()"
          [cdkDropListConnectedTo]="[rankedList]"
          (cdkDropListDropped)="drop($event)"
          class="event-list"
          role="list"
          aria-label="Available events">
          @for (event of filtered(); track event.id) {
            <article class="event-card" cdkDrag role="listitem" [attr.aria-label]="event.title">
              <img class="destination" [src]="event.image" [alt]="'Photo: ' + event.title" width="114" height="102"/>
              <div class="event-details">
                <h3 class="title">{{ event.title }}</h3>
                <p class="date-range mono">{{ event.dateRange }}</p>
                <p class="description">{{ event.description }}</p>
                <p class="capacity">
                  <app-icon name="users" [size]="13"/>
                  <span>{{ event.places }} places total · {{ event.demand }}</span>
                </p>
              </div>
              <div class="add-preference">
                @if (rankOf(event.id); as rank) {
                  <span class="pill" aria-label="Already chosen as priority {{ rank }}">
                    <app-icon name="check" [size]="14"/>
                    <span>Priority {{ rank }}</span>
                  </span>
                } @else {
                  <button
                    class="add-choice"
                    type="button"
                    (click)="add(event.id)"
                    aria-label="Add {{ event.title }} as a choice">
                    <app-icon name="plus" [size]="18"/>
                    <span>Add choice</span>
                  </button>
                }
                <span class="availability">Opens 6 Apr · 10:00</span>
              </div>
            </article>
          } @empty {
            <p class="no-results">No events match your filters.</p>
          }
        </div>

        <p class="disclaimer">
          Capacity is the total event size, not available seats. Availability is checked when registration opens.
        </p>
      </section>

      <aside class="priorities-panel" aria-label="Your reservation order">
        <header class="priority-heading">
          <div class="title-row">
            <h2>Your reservation order</h2>
            <span class="pill">{{ selected().length }} choices</span>
          </div>
          <p class="description">One group. One reservation. Your favourite first.</p>
        </header>

        <p class="reorder-cue">
          <app-icon name="grip-vertical" [size]="16"/>
          <span class="cue-desktop">Drag to reorder</span>
          <span class="cue-mobile">Drag to reorder, or use Move up / Move down.</span>
        </p>

        <div
          #rankedList="cdkDropList"
          cdkDropList
          [cdkDropListData]="selected()"
          [cdkDropListConnectedTo]="[availableList]"
          (cdkDropListDropped)="drop($event)"
          class="ranked-choices"
          role="list"
          aria-label="Ranked choices">
          @for (id of selected(); track id; let i = $index) {
            <article class="priority-choice" cdkDrag role="listitem" [attr.aria-label]="'Priority ' + (i + 1) + ': ' + eventById(id).title">
              <div class="rank-and-choice">
                <span class="drag-handle" cdkDragHandle aria-hidden="true">
                  <app-icon name="grip-vertical" [size]="18"/>
                </span>
                <span class="rank">{{ i + 1 }}</span>
                <div class="choice">
                  <span class="event">{{ eventById(id).title }}</span>
                  <span class="date-range mono">{{ eventById(id).dateRange }}</span>
                </div>
                <button
                  class="remove"
                  type="button"
                  (click)="remove(id)"
                  aria-label="Remove {{ eventById(id).title }} from your order">
                  <app-icon name="x" [size]="16"/>
                </button>
              </div>
              <p class="choice-detail">{{ participants() }} participants · together</p>
              <div class="reorder-controls">
                <button
                  class="move-button"
                  type="button"
                  (click)="move(id, -1)"
                  [disabled]="i === 0"
                  aria-label="Move {{ eventById(id).title }} up">
                  <app-icon name="arrow-up" [size]="18"/>
                  <span>Move up</span>
                </button>
                <button
                  class="move-button"
                  type="button"
                  (click)="move(id, 1)"
                  [disabled]="i === selected().length - 1"
                  aria-label="Move {{ eventById(id).title }} down">
                  <app-icon name="arrow-down" [size]="18"/>
                  <span>Move down</span>
                </button>
              </div>
            </article>
          }
          <div class="drop-target" aria-hidden="true">
            <app-icon name="plus" [size]="18"/>
            <span>Drag an event here to add a fallback</span>
          </div>
        </div>

        <hr class="divider"/>

        <section class="fallback-explanation">
          <h3 class="heading">
            <app-icon name="route" [size]="17"/>
            <span>How your priorities work</span>
          </h3>
          <p class="logic">
            We try your first choice for all {{ participants() }} people first. Only if it can’t fit
            your whole group do we try the next one. We never reserve multiple alternatives.
          </p>
        </section>

        <div class="panel-action">
          <ng-content select="[slot=action]"/>
        </div>

        <p class="no-guarantee">
          <app-icon name="info" [size]="16"/>
          <span>Preparing preferences does not guarantee seats. Keep this page open for registration.</span>
        </p>
      </aside>
    </div>
  `,
  styles: [`
    .planning-workspace {
      display: flex;
      align-items: flex-start;
      gap: 24px;
    }
    .event-discovery {
      display: flex;
      flex-direction: column;
      gap: 20px;
      flex: 1 1 auto;
      min-width: 0;
    }
    .quick-action {
      display: none;
    }
    .cue-mobile {
      display: none;
    }
    .reorder-controls {
      display: none;
    }
    .priorities-panel {
      display: flex;
      flex-direction: column;
      gap: 20px;
      flex: none;
      width: 460px;
      box-sizing: border-box;
      padding: 24px;
      border-radius: 16px;
      background: var(--surface);
      border: 1px solid var(--border);
    }

    .discovery-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .discovery-heading h2 {
      margin: 0;
      font-size: 21px;
      font-weight: 600;
      line-height: 25px;
      color: var(--text);
    }
    .results {
      font-size: 12px;
      line-height: 15px;
      color: var(--muted);
    }

    .discovery-filters {
      display: flex;
      gap: 10px;
    }
    .search {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
      height: 42px;
      box-sizing: border-box;
      padding: 0 14px;
      border-radius: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--muted);
    }
    .search input {
      flex: 1;
      min-width: 0;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text);
      font-size: 13px;
    }
    .search input::placeholder {
      color: var(--muted);
    }
    .filter {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 42px;
      box-sizing: border-box;
      padding: 0 14px;
      border-radius: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--accent);
      cursor: pointer;
    }
    .filter select {
      appearance: none;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text);
      font-size: 13px;
      cursor: pointer;
    }
    .filter select option {
      background: var(--surface);
      color: var(--text);
    }

    .event-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .event-card {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 14px;
      box-sizing: border-box;
      border-radius: 12px;
      background: var(--surface);
      border: 1px solid var(--border);
      cursor: grab;
    }
    .destination {
      flex: none;
      width: 114px;
      height: 102px;
      border-radius: 8px;
      object-fit: cover;
    }
    .event-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }
    .title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      line-height: 19px;
      color: var(--text);
    }
    .date-range {
      margin: 0;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      color: var(--accent);
    }
    .description {
      margin: 0;
      font-size: 12px;
      line-height: 15px;
      color: var(--muted);
    }
    .capacity {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      font-size: 11px;
      line-height: 13px;
      color: var(--muted);
    }
    .add-preference {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 9px;
      flex: none;
      width: 124px;
    }
    .add-choice {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      border-radius: 8px;
      background: var(--surface-sunken);
      border: 1px solid var(--border);
      color: var(--accent);
      font-size: 12px;
      font-weight: 600;
      line-height: 15px;
    }
    .add-choice:hover {
      border-color: var(--brand);
    }
    .availability {
      font-size: 10px;
      line-height: 12px;
      color: var(--muted);
      text-align: center;
    }
    .no-results {
      margin: 0;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 13px;
      text-align: center;
    }
    .disclaimer {
      margin: 0;
      font-size: 12px;
      line-height: 18px;
      color: var(--muted);
    }

    .priority-heading {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title-row h2 {
      margin: 0;
      font-size: 23px;
      font-weight: 600;
      line-height: 28px;
      color: var(--text);
    }
    .priority-heading .description {
      font-size: 13px;
      line-height: 19.5px;
    }
    .reorder-cue {
      display: flex;
      align-items: center;
      gap: 7px;
      margin: 0;
      font-size: 12px;
      font-weight: 500;
      line-height: 15px;
      color: var(--muted);
    }

    .ranked-choices {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .priority-choice {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      box-sizing: border-box;
      border-radius: 12px;
      background: var(--surface);
      border: 1px solid var(--brand);
    }
    .rank-and-choice {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .drag-handle {
      display: flex;
      color: var(--muted);
      cursor: grab;
    }
    .rank {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: var(--badge);
      color: var(--accent);
      font-size: 15px;
      font-weight: 600;
    }
    .choice {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    .choice .event {
      font-size: 14px;
      font-weight: 600;
      line-height: 17px;
      color: var(--text);
    }
    .choice .date-range {
      font-weight: 400;
      font-size: 11px;
      color: var(--muted);
    }
    .remove {
      display: flex;
      color: var(--muted);
    }
    .remove:hover {
      color: var(--text);
    }
    .choice-detail {
      margin: 0;
      padding-left: 60px;
      font-size: 12px;
      line-height: 15px;
      color: var(--muted);
    }
    .drop-target {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-height: 78px;
      box-sizing: border-box;
      border-radius: 12px;
      background: var(--surface-sunken);
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 12px;
    }
    .drop-target app-icon {
      color: var(--accent);
    }
    .ranked-choices.cdk-drop-list-receiving .drop-target {
      border-color: var(--brand);
    }

    .divider {
      width: 100%;
      height: 1px;
      margin: 0;
      border: none;
      background: var(--border-subtle);
    }
    .fallback-explanation {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .fallback-explanation .heading {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      line-height: 17px;
      color: var(--text);
    }
    .fallback-explanation .heading app-icon {
      color: var(--accent);
    }
    .logic {
      margin: 0;
      font-size: 13px;
      line-height: 20.8px;
      color: var(--muted);
    }
    .no-guarantee {
      display: flex;
      gap: 8px;
      margin: 0;
      font-size: 12px;
      line-height: 18px;
      color: var(--muted);
    }
    .no-guarantee app-icon {
      flex: none;
    }

    .cdk-drag-preview {
      border-radius: 12px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }
    .cdk-drag-placeholder {
      opacity: 0;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .event-list.cdk-drop-list-dragging .event-card:not(.cdk-drag-placeholder),
    .ranked-choices.cdk-drop-list-dragging .priority-choice:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    @media (max-width: 1100px) {
      .planning-workspace {
        flex-direction: column;
      }
      .priorities-panel {
        width: 100%;
      }
    }

    @media (max-width: 760px) {
      .planning-workspace {
        gap: 24px;
      }
      .event-discovery {
        gap: 16px;
      }
      .quick-action {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .order-shortcut {
        margin: 0;
        font-size: 12px;
        font-weight: 500;
        line-height: 15px;
        color: var(--accent);
      }
      .cue-desktop {
        display: none;
      }
      .cue-mobile {
        display: inline;
      }
      .discovery-heading {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
      .discovery-heading h2 {
        font-size: 20px;
        line-height: 24px;
      }
      .discovery-filters {
        flex-wrap: wrap;
        gap: 10px;
      }
      .search {
        flex-basis: 100%;
        height: 48px;
        gap: 10px;
        padding: 0 12px;
      }
      .filter {
        flex: 1 1 0;
        height: 48px;
        justify-content: space-between;
        gap: 12px;
      }
      .event-list {
        gap: 16px;
      }
      .event-card {
        display: grid;
        grid-template-columns: 82px 1fr;
        gap: 10px 12px;
        align-items: start;
      }
      .destination {
        grid-column: 1;
        grid-row: 1 / span 2;
        width: 82px;
        height: 90px;
      }
      .event-details {
        display: contents;
      }
      .title {
        grid-column: 2;
        grid-row: 1;
        align-self: end;
        font-size: 16px;
        line-height: 21.6px;
      }
      .date-range {
        grid-column: 2;
        grid-row: 2;
        align-self: start;
        font-size: 11px;
        line-height: 16.5px;
      }
      .description {
        grid-column: 1 / -1;
        grid-row: 3;
      }
      .capacity {
        grid-column: 1 / -1;
        grid-row: 4;
      }
      .add-preference {
        display: contents;
      }
      .add-preference .pill,
      .add-preference .add-choice {
        grid-column: 2;
        grid-row: 5;
        justify-self: end;
        align-self: center;
      }
      .add-preference .add-choice {
        width: auto;
        height: 52px;
        font-size: 14px;
        line-height: 17px;
      }
      .add-preference .availability {
        grid-column: 1;
        grid-row: 5;
        align-self: center;
        justify-self: start;
        font-size: 11px;
      }

      .priorities-panel {
        gap: 16px;
        padding: 18px;
        border-radius: 16px;
      }
      .priority-heading {
        gap: 12px;
      }
      .title-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .title-row h2 {
        font-size: 20px;
        line-height: 24px;
      }
      .reorder-controls {
        display: flex;
        gap: 8px;
      }
      .move-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex: 1;
        height: 52px;
        box-sizing: border-box;
        border-radius: 8px;
        background: var(--surface-sunken);
        border: 1px solid var(--border);
        color: var(--accent);
        font-size: 14px;
        font-weight: 600;
        line-height: 17px;
      }
      .move-button:disabled {
        color: var(--brand);
        cursor: default;
      }
      .priority-choice {
        gap: 12px;
        padding: 14px;
        border-color: var(--border);
      }
      .priority-choice:first-child {
        border-color: var(--brand);
      }
      .priority-choice:first-child .rank {
        background: var(--brand);
        color: var(--white);
      }
      .remove {
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
      }
      .choice .date-range {
        font-size: 10px;
        line-height: 13px;
      }
      .choice-detail {
        padding-left: 0;
      }
      .drop-target {
        min-height: 74px;
        gap: 8px;
      }
      .fallback-explanation .heading app-icon,
      .no-guarantee app-icon {
        display: none;
      }
      .fallback-explanation .heading {
        font-size: 16px;
      }
      .panel-action {
        display: none;
      }
    }
  `],
})
export class WeeksSelectorComponent implements ControlValueAccessor {
  private readonly rankedListRef = viewChild.required<CdkDropList<number[]>>('rankedList');
  private readonly availableListRef = viewChild.required<CdkDropList<number[]>>('availableList');

  readonly participants = input(0);

  readonly searchQuery = signal('');
  readonly dateFilter = signal('all');
  readonly activityFilter = signal('all');

  private readonly selectedIds = signal<number[]>([]);

  protected readonly filtered = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const date = this.dateFilter();
    const activity = this.activityFilter();
    return EVENTS.filter(event => {
      const matchesQuery = !query
        || event.title.toLowerCase().includes(query)
        || event.description.toLowerCase().includes(query);
      const matchesDate = date === 'all' || event.month === date;
      const matchesActivity = activity === 'all' || event.activity === activity;
      return matchesQuery && matchesDate && matchesActivity;
    });
  });

  protected readonly filteredIds = computed(() => this.filtered().map(event => event.id));

  protected readonly selected = this.selectedIds;

  protected eventById(id: number): EventOption {
    const event = EVENTS.find(e => e.id === id);
    if (!event) {
      throw new Error(`Unknown event id: ${id}`);
    }
    return event;
  }

  protected rankOf(id: number): number | null {
    const index = this.selectedIds().indexOf(id);
    return index >= 0 ? index + 1 : null;
  }

  protected targetValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected add(id: number): void {
    if (this.selectedIds().includes(id)) {
      return;
    }
    this.commit([...this.selectedIds(), id]);
  }

  protected remove(id: number): void {
    this.commit(this.selectedIds().filter(selected => selected !== id));
  }

  protected move(id: number, direction: -1 | 1): void {
    const selected = [...this.selectedIds()];
    const index = selected.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= selected.length) {
      return;
    }
    selected[index] = selected[target];
    selected[target] = id;
    this.commit(selected);
  }

  protected drop(event: CdkDragDrop<number[]>): void {
    if (event.previousContainer === event.container) {
      if (event.container === this.rankedListRef()) {
        const selected = [...this.selectedIds()];
        moveItemInArray(selected, event.previousIndex, event.currentIndex);
        this.commit(selected);
      }
      return;
    }
    if (event.container === this.rankedListRef()) {
      const id = (event.previousContainer.data as number[])[event.previousIndex];
      const selected = [...this.selectedIds()];
      const existingIndex = selected.indexOf(id);
      if (existingIndex >= 0) {
        selected.splice(existingIndex, 1);
      }
      selected.splice(Math.min(event.currentIndex, selected.length), 0, id);
      this.commit(selected);
    } else if (event.container === this.availableListRef()) {
      const id = (event.previousContainer.data as number[])[event.previousIndex];
      this.commit(this.selectedIds().filter(selected => selected !== id));
    }
  }

  private commit(selected: number[]): void {
    this.selectedIds.set(selected);
    this.onChange(selected);
    this.onTouched();
  }

  onChange: (selected: number[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: number[] | null): void {
    this.selectedIds.set(value ?? []);
  }

  registerOnChange(onChange: (selected: number[]) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }
}
