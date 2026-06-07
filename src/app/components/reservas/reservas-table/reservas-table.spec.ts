import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasTable } from './reservas-table';

describe('ReservasTable', () => {
  let component: ReservasTable;
  let fixture: ComponentFixture<ReservasTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
