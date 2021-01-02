import {Injectable} from '@angular/core';
import {map, startWith} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  constructor() {
  }

  // TODO: make autocomplete functions generic;

  // private initStudyCourses(): void {
  //   const name = this.disciplineNameDOMElement.nativeElement.value;
  //   const id = this.disciplineService.getDisciplineID(name);
  //   this.studyCourses = this.studyCourseService.getStudyCourseByDisciplineID(
  //     id
  //   );
  //   this.studyCourses.forEach((s) => this.studyCourseNames.push(s.name));
  // }
  //
  // autocompleteStudyCourses() {
  //   this.initStudyCourses();
  //   this.filteredStudyCourses = this.form.get('studyCourses').valueChanges.pipe(
  //     startWith(''),
  //     map((value) => this._studyCoursesFilter(value))
  //   );
  // }
  //
  // private _studyCoursesFilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.studyCourseNames.filter((studyCourse) =>
  //     studyCourse.toLowerCase().includes(filterValue)
  //   );
  // }
}
