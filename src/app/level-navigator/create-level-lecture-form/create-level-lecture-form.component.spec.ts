import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLevelLectureFormComponent } from './create-level-lecture-form.component';

describe('CreateLevelLectureFormComponent', () => {
  let component: CreateLevelLectureFormComponent;
  let fixture: ComponentFixture<CreateLevelLectureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLevelLectureFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLevelLectureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
