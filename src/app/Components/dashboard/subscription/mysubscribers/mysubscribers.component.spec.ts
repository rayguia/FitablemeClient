import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysubscribersComponent } from './mysubscribers.component';

describe('MysubscribersComponent', () => {
  let component: MysubscribersComponent;
  let fixture: ComponentFixture<MysubscribersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MysubscribersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MysubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
