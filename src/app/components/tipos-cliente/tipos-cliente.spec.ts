import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposCliente } from './tipos-cliente';

describe('TiposCliente', () => {
  let component: TiposCliente;
  let fixture: ComponentFixture<TiposCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(TiposCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
