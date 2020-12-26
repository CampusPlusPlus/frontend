import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-level-navigator',
  templateUrl: './level-navigator.component.html',
  styleUrls: ['./level-navigator.component.scss']
})
export class LevelNavigatorComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.params)
  }

}
