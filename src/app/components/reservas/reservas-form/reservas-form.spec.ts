import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasForm } from './reservas-form';

describe('ReservasForm', () => {
  let component: ReservasForm;
  let fixture: ComponentFixture<ReservasForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
