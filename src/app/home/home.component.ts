import { Component, OnInit } from '@angular/core';
import { OwnerRepositoryService } from '../shared/services/owner-repository.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private repo: OwnerRepositoryService) { }

  ngOnInit(): void {
  }


}
