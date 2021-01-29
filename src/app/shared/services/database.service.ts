import { Injectable } from '@angular/core';
import * as Loki from "lokijs";
import { ElectronService } from "../../core/services";
const lokiFsStructuredAdapter  = require('lokijs/src/loki-fs-structured-adapter.js');
const lokiIndexedAdapter  = require('lokijs/src/loki-indexed-adapter');

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db:Loki;
  private hasBeenInitialized = false;

  constructor(private electronService:ElectronService) {
    const lokiOptions = {
      autoload: true,
      autoloadCallback : () => this.hasBeenInitialized = true,
      autosave: true,
      autosaveInterval: 400
    };

    if(this.electronService.isElectron) {
      lokiOptions['adapter'] = new lokiFsStructuredAdapter();
    } else {
      lokiOptions['adapter'] = new lokiIndexedAdapter();
    }
    this.db = new Loki('../personal-newsletter-manager.db', lokiOptions);
  }

  public findAll<T extends object>(collectionName:string): (T & LokiObj)[]
  {
    return this.db
      .getCollection<T>(collectionName)
      .find()
  }

  public findOne<T extends object>(collectionName:string): T & LokiObj
  {
    return this.db
      .getCollection<T>(collectionName)
      .findOne()
  }

  async waitUntilReady() {
    while(!this.hasBeenInitialized) {
      await this.sleep(400);
    }
  }

  private sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  public existsCollection(collectionName:string): boolean
  {
    return this.db.getCollection(collectionName) !== null;
  }

  public addCollection(collectionName:string): void
  {
    this.db.addCollection(collectionName);
  }

  public deleteAll(collectionName:string): void
  {
    this.db.getCollection(collectionName).removeWhere(value => value)
  }

  public insert<T extends object>(object:T, collectionName:string): void
  {
    this.db.getCollection(collectionName).insert(object);
  }

  public removeById(id: number, collectionName: string) {
    if(this.db.getCollection(collectionName).findOne(value => value["id"] == id) == null) {
      console.error("Cannot remove item from " + collectionName +  " by id = " + id + " because it does not exist!");
    }
    this.db.getCollection(collectionName).removeWhere(value => value["id"] == id);
  }

  public removeByQuery<T extends object>(query: (value: T) => boolean, collectionName: string) {
    if(this.db.getCollection(collectionName).findOne(query) == null) {
      console.error("Cannot remove item from " + collectionName +  " by query because it does not exist!");
    }
    this.db.getCollection(collectionName).removeWhere(query);
  }

  public updateById<T extends object>(value: T, id: number, collectionName: string) {
    if(this.db.getCollection(collectionName).findOne(value => value["id"] == id) == null) {
      console.error("Cannot update item from " + collectionName +  " by id = " + id + " because it does not exist!");
    }
    this.db.getCollection(collectionName).updateWhere(value => value["id"] == id, data => data);
  }

  public exportDatabaseAsJSON(): string {
    return this.db.toJson({serializationMethod: "pretty"});
  }

  public importDatabaseFromJSON(json:string) {
    this.db.deleteDatabase(() => {
      this.db.loadJSON(json, {serializationMethod: "pretty"});
      this.db.saveDatabase();
    });
  }
}
