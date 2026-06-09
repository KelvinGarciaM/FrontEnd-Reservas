import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoClienteTable } from './tipo-cliente-table';

describe('TipoClienteTable', () => {
  let component: TipoClienteTable;
  let fixture: ComponentFixture<TipoClienteTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoClienteTable],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoClienteTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
