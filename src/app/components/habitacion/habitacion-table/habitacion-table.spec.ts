import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionTable } from './habitacion-table';

describe('HabitacionTable', () => {
  let component: HabitacionTable;
  let fixture: ComponentFixture<HabitacionTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitacionTable],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitacionTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
