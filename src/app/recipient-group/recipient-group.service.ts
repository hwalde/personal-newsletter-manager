import {Injectable} from '@angular/core';
import {DatabaseService} from "../shared/services/database.service";
import {Observable, ReplaySubject} from "rxjs";
import {RecipientGroup} from "./recipient-group";
import {filter, map} from "rxjs/operators";
import {ElectronService} from "../core/services";
import {Newsletter} from "../newsletter/newsletter";

@Injectable({
  providedIn: 'root'
})
export class RecipientGroupService {

  private recipientGroupListSubject$: ReplaySubject<RecipientGroup[]> = new ReplaySubject<RecipientGroup[]>(1);

  private recipientGroupListSnapshot: RecipientGroup[];

  private readonly collectionName = "recipient-group";

  constructor(private databaseService: DatabaseService, private electronService: ElectronService) {
    this.databaseService.waitUntilReady().then(() => {
      if(!this.databaseService.existsCollection(this.collectionName)) {
        this.addInitialData();
      }
      this.loadRecipientGroupList();
    });
  }

  private addInitialData() {
    this.databaseService.addCollection(this.collectionName);

    if(!this.electronService.isElectron) {
      this.databaseService.insert<RecipientGroup>({
        id: 0,
        title: "Liste 1",
        recipientIdList: [1,2],
        creationDate: new Date()
      } as RecipientGroup, this.collectionName);
    }
    console.log(this.electronService.isElectron);
  }

  private loadRecipientGroupList() {
    this.recipientGroupListSnapshot = this.databaseService.findAll<RecipientGroup>(this.collectionName);
    this.recipientGroupListSubject$.next(this.recipientGroupListSnapshot);
  }

  public getRecipientGroupList(): Observable<RecipientGroup[]>
  {
    return this.recipientGroupListSubject$.asObservable();
  }

  public getRecipientGroupById(id:number): Observable<RecipientGroup>
  {
    return this.recipientGroupListSubject$.pipe(
      map(recipientGroupList => {
        return recipientGroupList.find(recipientGroup => recipientGroup.id == id);
      }),
      filter(recipientGroup => recipientGroup != undefined)
    );
  }

  public getRecipientGroupListByIdList(idList:number[]): Observable<RecipientGroup[]>
  {
    return this.recipientGroupListSubject$.pipe(
      map(recipientGroupList => {
        return idList.map(id => recipientGroupList.find(recipientGroup=> recipientGroup.id == id));
      })
    );
  }

  public updateRecipientGroup(recipientGroup:RecipientGroup): void
  {
    let index = this.recipientGroupListSnapshot.findIndex(currentRecipient => currentRecipient.id == recipientGroup.id);
    this.recipientGroupListSnapshot[index] = recipientGroup;
    this.recipientGroupListSubject$.next(this.recipientGroupListSnapshot);
    this.databaseService.updateById(recipientGroup, recipientGroup.id, this.collectionName);
  }

  public addRecipientGroup(recipientGroup:RecipientGroup): void
  {
    recipientGroup.id = this.getHighestId() + 1;
    this.recipientGroupListSnapshot.push(recipientGroup);
    this.recipientGroupListSubject$.next(this.recipientGroupListSnapshot);
    this.databaseService.insert<RecipientGroup>(recipientGroup, this.collectionName);
  }

  private getHighestId(): number
  {
    let highestId = -1;
    this.recipientGroupListSnapshot.forEach(recipientGroup=> {
      if(recipientGroup.id > highestId) {
        highestId = recipientGroup.id;
      }
    });
    return highestId;
  }

  public removeRecipientGroupById(id:number): void
  {
    this.recipientGroupListSnapshot = this.recipientGroupListSnapshot.filter(recipientGroup=> recipientGroup.id != id);
    this.recipientGroupListSubject$.next(this.recipientGroupListSnapshot);
    this.databaseService.removeById(id, this.collectionName);
  }

}
