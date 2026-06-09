import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionistaTable } from './recepcionista-table';

describe('RecepcionistaTable', () => {
  let component: RecepcionistaTable;
  let fixture: ComponentFixture<RecepcionistaTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionistaTable],
    }).compileComponents();

    fixture = TestBed.createComponent(RecepcionistaTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
