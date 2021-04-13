import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelNavigatorComponent } from './level-navigator.component';

describe('LevelNavigatorComponent', () => {
  let component: LevelNavigatorComponent;
  let fixture: ComponentFixture<LevelNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
