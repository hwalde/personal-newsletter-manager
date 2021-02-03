import { Component, OnInit } from '@angular/core';
import { SystemService } from "../shared/services/system.service";
import { Observable } from "rxjs";
import { NewsletterSendDataService } from "../newsletter/newsletter-send/newsletter-send-data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private systemService: SystemService, private newsletterSendDataService: NewsletterSendDataService) { }

  databaseVersion$: Observable<string>;
  systemVersion = "unknown";

  ngOnInit(): void {
    this.databaseVersion$ = this.systemService.getDatabaseVersion();
    this.systemVersion = this.systemService.getSystemVersion();
  }

  logInternalData() {
    console.log(this.newsletterSendDataService.getListSnapshot());
  }
}
