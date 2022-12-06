import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorAlltimebillsComponent } from './calculator-alltimebills.component';

describe('CalculatorAlltimebillsComponent', () => {
  let component: CalculatorAlltimebillsComponent;
  let fixture: ComponentFixture<CalculatorAlltimebillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorAlltimebillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorAlltimebillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
