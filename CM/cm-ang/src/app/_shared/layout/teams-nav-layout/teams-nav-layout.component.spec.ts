import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsNavLayoutComponent } from './teams-nav-layout.component';

describe('TeamsNavLayoutComponent', () => {
  let component: TeamsNavLayoutComponent;
  let fixture: ComponentFixture<TeamsNavLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsNavLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsNavLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
