import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Respaldo } from './respaldo';

describe('Respaldo', () => {
  let component: Respaldo;
  let fixture: ComponentFixture<Respaldo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Respaldo],
    }).compileComponents();

    fixture = TestBed.createComponent(Respaldo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
