import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CdkDropList} from '@angular/cdk/drag-drop';
import {WeeksSelectorComponent} from './weeks-selector.component';

describe('WeeksSelectorComponent', () => {
  let fixture: ComponentFixture<WeeksSelectorComponent>;
  let component: WeeksSelectorComponent;
  let selectedIds: number[] | undefined;
  let touched: boolean;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeksSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeksSelectorComponent);
    component = fixture.componentInstance;
    component.registerOnChange(value => (selectedIds = value));
    component.registerOnTouched(() => (touched = true));
    fixture.detectChanges();
  });

  it('starts with no selection and all events available', () => {
    component.writeValue(null);
    expect((fixture.componentInstance as unknown as { selected: { (): number[] } }).selected())
      .toEqual([]);
  });

  it('adds choices in order and reports the selection', () => {
    const anyComponent = component as unknown as {
      add: (id: number) => void;
      rankOf: (id: number) => number | null;
    };
    anyComponent.add(2);
    anyComponent.add(1);
    expect(selectedIds).toEqual([2, 1]);
    expect(anyComponent.rankOf(2)).toBe(1);
    expect(anyComponent.rankOf(1)).toBe(2);
    expect(anyComponent.rankOf(3)).toBeNull();
    expect(touched).toBeTrue();
  });

  it('ignores duplicate adds', () => {
    const anyComponent = component as unknown as { add: (id: number) => void };
    anyComponent.add(2);
    anyComponent.add(2);
    expect(selectedIds).toEqual([2]);
  });

  it('removes a choice', () => {
    const anyComponent = component as unknown as {
      add: (id: number) => void;
      remove: (id: number) => void;
    };
    anyComponent.add(2);
    anyComponent.add(1);
    anyComponent.remove(2);
    expect(selectedIds).toEqual([1]);
  });

  it('reorders within the ranked list on drop', () => {
    const anyComponent = component as unknown as {
      add: (id: number) => void;
      drop: (event: unknown) => void;
      rankedListRef: { (): CdkDropList<number[]> };
    };
    anyComponent.add(2);
    anyComponent.add(1);

    const rankedList = anyComponent.rankedListRef();
    anyComponent.drop({
      previousContainer: rankedList,
      container: rankedList,
      previousIndex: 1,
      currentIndex: 0,
    });
    expect(selectedIds).toEqual([1, 2]);
  });

  it('adds an event to the ranked list when dropped from the available list', () => {
    const anyComponent = component as unknown as {
      add: (id: number) => void;
      drop: (event: unknown) => void;
      rankedListRef: { (): CdkDropList<number[]> };
      availableListRef: { (): CdkDropList<number[]> };
      filteredIds: { (): number[] };
    };
    anyComponent.add(2);

    const rankedList = anyComponent.rankedListRef();
    const availableList = anyComponent.availableListRef();
    const previousIndex = anyComponent.filteredIds().indexOf(1);

    anyComponent.drop({
      previousContainer: availableList,
      container: rankedList,
      previousIndex,
      currentIndex: 1,
    });
    expect(selectedIds).toEqual([2, 1]);
  });

  it('removes a choice when it is dragged back to the available list', () => {
    const anyComponent = component as unknown as {
      add: (id: number) => void;
      drop: (event: unknown) => void;
      rankedListRef: { (): CdkDropList<number[]> };
      availableListRef: { (): CdkDropList<number[]> };
    };
    anyComponent.add(2);
    anyComponent.add(1);

    const rankedList = anyComponent.rankedListRef();
    const availableList = anyComponent.availableListRef();

    anyComponent.drop({
      previousContainer: rankedList,
      container: availableList,
      previousIndex: 1,
      currentIndex: 0,
    });
    expect(selectedIds).toEqual([2]);
  });

  it('restores the selection on writeValue', () => {
    component.writeValue([3, 1]);
    const anyComponent = component as unknown as { add: (id: number) => void };
    anyComponent.add(4);
    expect(selectedIds).toEqual([3, 1, 4]);
  });
});
