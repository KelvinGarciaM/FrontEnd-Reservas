import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoClienteForm } from './tipo-cliente-form';

describe('TipoClienteForm', () => {
  let component: TipoClienteForm;
  let fixture: ComponentFixture<TipoClienteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoClienteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoClienteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
