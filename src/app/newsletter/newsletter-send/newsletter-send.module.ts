import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsletterSendRoutingModule } from './newsletter-send-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NewsletterSendStep1Component } from "./newsletter-send-step1/newsletter-send-step1.component";
import { NewsletterSendStep2Component } from "./newsletter-send-step2/newsletter-send-step2.component";
import { NewsletterSendComponent } from "./newsletter-send.component";
import { NewsletterSendStep3Component } from './newsletter-send-step3/newsletter-send-step3.component';
import { MatCardModule } from "@angular/material/card";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomNewsletterMailSettingsComponent } from './newsletter-send-step2/custom-newsletter-mail-settings/custom-newsletter-mail-settings.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { RecipientGroupSelectionDialogComponent } from './newsletter-send-step1/recipient-group-selection-dialog/recipient-group-selection-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    NewsletterSendComponent, NewsletterSendStep1Component, NewsletterSendStep2Component, NewsletterSendStep3Component, CustomNewsletterMailSettingsComponent, RecipientGroupSelectionDialogComponent
  ],
    imports: [
        CommonModule, SharedModule, NewsletterSendRoutingModule, MatStepperModule, MatCardModule, ReactiveFormsModule,
        MatButtonModule, MatInputModule, NgSelectModule, MatExpansionModule, MatDialogModule
    ]
})
export class NewsletterSendModule {}
