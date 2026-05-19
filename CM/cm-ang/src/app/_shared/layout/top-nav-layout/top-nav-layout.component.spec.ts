import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavLayoutComponent } from './top-nav-layout.component';

describe('TopNavLayoutComponent', () => {
  let component: TopNavLayoutComponent;
  let fixture: ComponentFixture<TopNavLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopNavLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopNavLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
