import { Component } from '@angular/core';
import {DatabaseService} from "../shared/services/database.service";
import {SystemService} from "../shared/services/system.service";
import * as compareVersions from "compare-versions";

@Component({
  selector: 'app-import-export-overview',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent {

  processingImport = false;
  importError = undefined;

  constructor(private databaseService: DatabaseService, private systemService: SystemService) { }

  public downloadBackup() {
    this.download(this.createFilename(), this.databaseService.exportDatabaseAsJSON());
  }

  private createFilename(): string
  {
    return "backup-" + this.createNicelyFormattedDatetime() + ".pnm-backup.json";
  }

  private createNicelyFormattedDatetime(): string
  {
    const dt = new Date();
    return `${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')}-${
      dt.getFullYear().toString().padStart(4, '0')} ${
      dt.getHours().toString().padStart(2, '0')}_${
      dt.getMinutes().toString().padStart(2, '0')}_${
      dt.getSeconds().toString().padStart(2, '0')}`
  }

  private download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  uploadImport($fileInputEvent: any) {
    const file = $fileInputEvent.target.files[0] as File;
    this.processingImport = true;
    this.importError = undefined;
    file.text().then(content => {
      if(confirm("Be aware that importing this file will overwrite all existing data!\nDo you want to import this file?")) {
        this.databaseService.importDatabaseFromJSON(content);

        if(!this.databaseService.existsCollection("system")) {
          this.setImportError("Failed to import database file!");
          return;
        }

        let systemInfo = this.databaseService.findOne("system");

        // todo: Add update routines for future versions here:
        // if(compareVersions(systemInfo["databaseVersion"], "2.0.0") < 0) {
          // update logic for upgrade 1.0.0 -> 2.0.0
        // }

        if(compareVersions(systemInfo["databaseVersion"], "1.0.0") != 0) {
          this.setImportError("Backup version is not supported!");
          return;
        }

        console.log("Version: " + systemInfo["databaseVersion"]);
        this.processingImport = false;
        alert("Import finished!\nReloading app now..");
        window.location.reload();
      } else {
        this.processingImport = false;
      }
    });
  }

  private setImportError(errorMessage:string) {
    this.importError = errorMessage;
    this.processingImport = false;
  }
}
