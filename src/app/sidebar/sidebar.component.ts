import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() active: boolean;

  constructor(private route:Router) { 
    
  }

  ngOnInit(): void {
    this.addActiveClass();
  }

  ngOnChanges(){
  }

  addActiveClass(){

    document.addEventListener('DOMContentLoaded', function(){
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
    this.route.navigate([link]);
  }

}
