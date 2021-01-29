import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {NewsletterModule} from "./newsletter/newsletter.module";
import {RecipientModule} from "./recipient/recipient.module";
import {RecipientGroupModule} from "./recipient-group/recipient-group.module";
import {SettingModule} from "./setting/setting.module";
import {SettingComponent} from './setting/setting.component';
import {MatInputModule} from "@angular/material/input";
import {BackupModule} from "./backup/backup.module";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, SettingComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    NewsletterModule,
    RecipientModule,
    BackupModule,
    RecipientGroupModule,
    SettingModule,

    // IMPORT ALL MODULES BEFORE AppRoutingModule, OR THEIR ROUTES WON'T WORK
    AppRoutingModule,
    NoopAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatCardModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
