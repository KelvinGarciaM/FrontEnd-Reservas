import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifaList } from './tarifa-list';

describe('TarifaList', () => {
  let component: TarifaList;
  let fixture: ComponentFixture<TarifaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifaList],
    }).compileComponents();

    fixture = TestBed.createComponent(TarifaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
