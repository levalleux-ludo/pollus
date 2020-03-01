import { Component, OnInit } from '@angular/core';
import { polls } from '../polls';

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css']
})
export class PollListComponent implements OnInit {

  polls = polls;


  expand() {
    window.alert('The product has been shared!');
  }

  ngOnInit() {

  }

}
