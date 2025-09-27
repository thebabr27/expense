import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconLinkListComponent } from './icon-link-list.component';

describe('IconLinkListComponent', () => {
  let component: IconLinkListComponent;
  let fixture: ComponentFixture<IconLinkListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IconLinkListComponent]
    });
    fixture = TestBed.createComponent(IconLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
