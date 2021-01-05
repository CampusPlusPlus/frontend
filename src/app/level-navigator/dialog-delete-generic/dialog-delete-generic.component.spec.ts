import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteGenericComponent } from './dialog-delete-generic.component';

describe('DialogDeleteGenericComponent', () => {
  let component: DialogDeleteGenericComponent;
  let fixture: ComponentFixture<DialogDeleteGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteGenericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
