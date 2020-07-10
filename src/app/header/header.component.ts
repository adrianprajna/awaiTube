import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  active: boolean = false;

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  onClick(){
    this.active = !this.active;
  }

  navigate(){
    this.route.navigate(['/']);
  }

}
