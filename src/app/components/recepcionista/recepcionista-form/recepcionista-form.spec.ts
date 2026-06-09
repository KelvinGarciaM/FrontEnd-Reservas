import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionistaForm } from './recepcionista-form';

describe('RecepcionistaForm', () => {
  let component: RecepcionistaForm;
  let fixture: ComponentFixture<RecepcionistaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionistaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RecepcionistaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
