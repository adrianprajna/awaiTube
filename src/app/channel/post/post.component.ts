import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/type';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: any;
  @Input() user: User;

  constructor() { }

  ngOnInit(): void {
  }

}
