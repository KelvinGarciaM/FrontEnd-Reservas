import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifaDetail } from './tarifa-detail';

describe('TarifaDetail', () => {
  let component: TarifaDetail;
  let fixture: ComponentFixture<TarifaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifaDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(TarifaDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
