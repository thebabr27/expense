import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLayoutComponent } from './game-layout.component';

describe('GameLayoutComponent', () => {
  let component: GameLayoutComponent;
  let fixture: ComponentFixture<GameLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameLayoutComponent]
    });
    fixture = TestBed.createComponent(GameLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
