import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifaAdd } from './tarifa-add';

describe('TarifaAdd', () => {
  let component: TarifaAdd;
  let fixture: ComponentFixture<TarifaAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifaAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(TarifaAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
