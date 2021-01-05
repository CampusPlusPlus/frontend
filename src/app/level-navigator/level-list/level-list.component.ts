import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BasicDTO } from '../../shared/models/BasicDTO';

@Component({
  selector: 'app-level-list',
  templateUrl: './level-list.component.html',
  styleUrls: ['./level-list.component.scss']
})
export class LevelListComponent implements OnInit {

  @Input() data: any[];
  @Input() level: number;
  @Output() executeAction: EventEmitter<any> = new EventEmitter();
  @Input() toggleAction: 'edit'|'delete'|'';

  constructor() {}

  ngOnInit(): void {
  }

  action(d: BasicDTO): void {
    this.executeAction.emit(d);
  }

}
