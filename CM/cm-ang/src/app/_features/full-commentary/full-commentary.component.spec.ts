import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCommentaryComponent } from './full-commentary.component';

describe('FullCommentaryComponent', () => {
  let component: FullCommentaryComponent;
  let fixture: ComponentFixture<FullCommentaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullCommentaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullCommentaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
