import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNationsComponent } from './edit-nations.component';

describe('EditNationsComponent', () => {
  let component: EditNationsComponent;
  let fixture: ComponentFixture<EditNationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditNationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
