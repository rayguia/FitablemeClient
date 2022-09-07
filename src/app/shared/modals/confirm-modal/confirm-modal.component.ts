import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  modalHeaderText: string = '';
  modalBodyText: string = '';
  okButtonText: string = '';
  cancelButtonText: string = '';
  deleteConfirmed: EventEmitter<any> = new EventEmitter();
  constructor(private bsModalRef: BsModalRef) { }
  ngOnInit(): void {
  }
  onOkClicked = () => {
    this.deleteConfirmed.emit();
    this.bsModalRef.hide();
  }
  cancelDelete = () => {
    this.bsModalRef.hide();
  }

}
