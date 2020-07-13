import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() active: boolean;

  constructor(private route:Router, private loginService: LoginService) { 
    
  }

  ngOnInit(): void {
    this.addActiveClass();
  }

  addActiveClass(){

    document.addEventListener('DOMContentLoaded', () => {
        let lists = document.querySelectorAll('.list');

        lists.forEach((list) => {
            list.addEventListener('click', function(e){
              

              // remove all class active
              lists.forEach((list) => {
                list.classList.remove('active');
              })

              console.log(this);
              this.classList.add('active');
              
              
            });
        })
      })
    }

  removeActiveClass(){
    document.addEventListener('DOMContentLoaded', function(){
      let lists = document.querySelectorAll('.list');
      console.log(lists);

      lists.forEach((list) => {
        list.classList.remove('active');
      })
    })
  }

  navigate(link: string){
    // this.active = !this.active;
    // document.getElementsByTagName('body')[0].style.backgroundColor = 'snow';
    this.loginService.changeActive(!this.active);
    this.route.navigate([link]);
  }

}
