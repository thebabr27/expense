import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomNavLayoutComponent } from './bottom-nav-layout.component';

describe('BottomNavLayoutComponent', () => {
  let component: BottomNavLayoutComponent;
  let fixture: ComponentFixture<BottomNavLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomNavLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
