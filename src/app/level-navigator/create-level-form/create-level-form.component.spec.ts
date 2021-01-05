import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLevelFormComponent } from './create-level-form.component';

describe('CreateLevelFormComponent', () => {
  let component: CreateLevelFormComponent;
  let fixture: ComponentFixture<CreateLevelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLevelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLevelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
