import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompetitionsComponent } from './edit-competitions.component';

describe('EditCompetitionsComponent', () => {
  let component: EditCompetitionsComponent;
  let fixture: ComponentFixture<EditCompetitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCompetitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
