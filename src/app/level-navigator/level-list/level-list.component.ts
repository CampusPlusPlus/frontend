import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-level-list',
  templateUrl: './level-list.component.html',
  styleUrls: ['./level-list.component.scss']
})
export class LevelListComponent implements OnInit {

  @Input() data: any[];
  @Input() level: number;
  @Output() navigateTo: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
  }

  navigate(id: number): void {
    this.navigateTo.emit(id);
  }

}
