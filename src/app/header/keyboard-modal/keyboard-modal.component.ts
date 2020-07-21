import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-keyboard-modal',
  templateUrl: './keyboard-modal.component.html',
  styleUrls: ['./keyboard-modal.component.scss']
})
export class KeyboardModalComponent implements OnInit {

  @Output() modal = new EventEmitter<boolean>();
  @Input() isModalDrop: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }

  dropModal(){
    this.modal.emit(false);
  }

}
