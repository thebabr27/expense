import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaLoginComponent } from './alfa-login.component';

describe('AlfaLoginComponent', () => {
  let component: AlfaLoginComponent;
  let fixture: ComponentFixture<AlfaLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlfaLoginComponent]
    });
    fixture = TestBed.createComponent(AlfaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
