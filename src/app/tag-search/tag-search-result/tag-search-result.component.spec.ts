import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSearchResultComponent } from './tag-search-result.component';

describe('TagSearchResultComponent', () => {
  let component: TagSearchResultComponent;
  let fixture: ComponentFixture<TagSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagSearchResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
