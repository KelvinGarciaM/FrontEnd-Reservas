import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoHabitacionTable } from './tipo-habitacion-table';

describe('TipoHabitacionTable', () => {
  let component: TipoHabitacionTable;
  let fixture: ComponentFixture<TipoHabitacionTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoHabitacionTable],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoHabitacionTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
