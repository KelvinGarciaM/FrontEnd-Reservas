import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasDetalle } from './reservas-detalle';

describe('ReservasDetalle', () => {
  let component: ReservasDetalle;
  let fixture: ComponentFixture<ReservasDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
