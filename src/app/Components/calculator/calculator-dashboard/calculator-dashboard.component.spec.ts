import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorDashboardComponent } from './calculator-dashboard.component';

describe('CalculatorDashboardComponent', () => {
  let component: CalculatorDashboardComponent;
  let fixture: ComponentFixture<CalculatorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
