import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DatabaseService} from "../shared/services/database.service";
import {SystemService} from "../shared/services/system.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private systemService: SystemService) { }

  databaseVersion$: Observable<string>;
  systemVersion = "unknown";

  ngOnInit(): void {
    this.databaseVersion$ = this.systemService.getDatabaseVersion();
    this.systemVersion = this.systemService.getSystemVersion();
  }

}
