import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSavedComponent } from './payment-saved.component';

describe('PaymentSavedComponent', () => {
  let component: PaymentSavedComponent;
  let fixture: ComponentFixture<PaymentSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentSavedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
