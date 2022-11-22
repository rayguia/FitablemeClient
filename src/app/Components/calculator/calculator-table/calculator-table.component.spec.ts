import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorTableComponent } from './calculator-table.component';

describe('CalculatorTableComponent', () => {
  let component: CalculatorTableComponent;
  let fixture: ComponentFixture<CalculatorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
