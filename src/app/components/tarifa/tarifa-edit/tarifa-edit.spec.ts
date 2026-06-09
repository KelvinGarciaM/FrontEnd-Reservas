import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifaEdit } from './tarifa-edit';

describe('TarifaEdit', () => {
  let component: TarifaEdit;
  let fixture: ComponentFixture<TarifaEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifaEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(TarifaEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
