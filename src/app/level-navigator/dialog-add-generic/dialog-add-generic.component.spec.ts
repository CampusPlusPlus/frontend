import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddGenericComponent } from './dialog-add-generic.component';

describe('DialogAddGenericComponent', () => {
  let component: DialogAddGenericComponent;
  let fixture: ComponentFixture<DialogAddGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddGenericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
