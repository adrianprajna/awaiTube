import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(private userService: UserService) { }

  @Input() comment: any;

  user: any;

  ngOnInit(): void {
    this.userService.getUser(this.comment.user_id) 
      .valueChanges
      .subscribe(result => this.user = result.data.getUser);
  }

}
