import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysubscriptionComponent } from './mysubscription.component';

describe('MysubscriptionComponent', () => {
  let component: MysubscriptionComponent;
  let fixture: ComponentFixture<MysubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MysubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MysubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
