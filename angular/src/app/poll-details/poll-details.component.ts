import { Component, OnInit } from '@angular/core';
import { polls } from '../polls';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.css']
})
export class PollDetailsComponent implements OnInit {

  poll;

  constructor(private route: ActivatedRoute,) { }

  ngOnInit() {
  this.route.paramMap.subscribe(params => {
    this.poll = polls[+params.get('pollId')];
  });
}

}
