import { Injectable } from '@angular/core';
import {SystemInfo} from "./system-info";
import {DatabaseService} from "./database.service";
import {BehaviorSubject, Observable} from "rxjs";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private readonly collectionName = "system";

  private systemInfo$: BehaviorSubject<SystemInfo | undefined> = new BehaviorSubject<SystemInfo | undefined>(undefined);

  constructor(private databaseService: DatabaseService) {
    this.databaseService.waitUntilReady().then(() => {
      this.addInitialDataToDatabaseIfMissing();
      this.loadFromDatabase();
    });
  }

  private addInitialDataToDatabaseIfMissing() {

    if(!this.databaseService.existsCollection(this.collectionName)) {
      this.addInitialDataToDatabase();
    }
  }

  private addInitialDataToDatabase() {
    this.databaseService.addCollection(this.collectionName);
    this.databaseService.insert({
      databaseVersion: "1.0.0"
    } as SystemInfo, this.collectionName)
  }

  private loadFromDatabase() {
    this.systemInfo$.next(this.databaseService.findOne<SystemInfo>(this.collectionName));
  }

  public reloadFromDatabase() {
    this.loadFromDatabase();
  }

  public getDatabaseVersion(): Observable<string | undefined> {
    return this.systemInfo$.pipe(
      map(systemInfo => systemInfo?.databaseVersion)
    );
  }

  public getSystemVersion(): string {
    return "1.0.0";
  }

}
