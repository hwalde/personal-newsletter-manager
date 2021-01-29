import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NewsletterService} from "../newsletter.service";
import {Newsletter} from "../newsletter";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-newsletter-detail',
  templateUrl: './newsletter-edit.component.html',
  styleUrls: ['./newsletter-edit.component.scss']
})
export class NewsletterEditComponent implements OnInit, OnDestroy, AfterViewInit {

  public newsletterForm = this.fb.group({
    internalTitle: [null, Validators.required],
    subject: [null, Validators.required],
    message: [null, Validators.required]
  });

  private newsletterSubscription: Subscription;

  private newsletter: Newsletter | undefined = undefined;

  public formTitle = "";

  public hasSubjectFocus = false;

  public hasMessageBodyFocus = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private newsletterService: NewsletterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const exists = this.route.snapshot.paramMap.has('id');

    if(exists) {
      const id = +this.route.snapshot.paramMap.get('id');
      this.newsletterSubscription = this.newsletterService
        .getNewsletterById(id)
        .subscribe(newsletter => {
          this.newsletter = newsletter;
          this.formTitle = "Edit " + newsletter.internalTitle;
          this.newsletterForm.get("internalTitle").setValue(newsletter.internalTitle);
          this.newsletterForm.get("subject").setValue(newsletter.subject);
          this.newsletterForm.get("message").setValue(newsletter.message);
        });
    } else {
      this.formTitle = "New newsletter";
    }
  }

  ngAfterViewInit(): void {
    this.adjustTextareaHeight();
  }

  ngOnDestroy(): void {
    if(this.newsletterSubscription) {
      this.newsletterSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    if(this.newsletterForm.valid) {

      const exists = this.newsletter !== undefined;

      let newsletter = this.createNewsletterObject(exists);

      if(exists) {
        this.newsletterService.updateNewsletter(newsletter);
      } else {
        this.newsletterService.addNewsletter(newsletter);
      }

      this.router.navigate(["/newsletters"]);
    }
  }

  private createNewsletterObject(exists: boolean) {
    let newsletter: Newsletter;

    if (exists) {
      newsletter = this.newsletter;
    } else {
      newsletter = {creationDate: new Date()} as Newsletter;
    }

    newsletter.internalTitle = this.newsletterForm.get("internalTitle").value;
    newsletter.subject = this.newsletterForm.get("subject").value;
    newsletter.message = this.newsletterForm.get("message").value;

    return newsletter;
  }

  adjustTextareaHeight() {
    const element:HTMLTextAreaElement = document.querySelector("#message-body-textarea");
    element.style.height = "1px";
    element.style.height = (25+element.scrollHeight)+"px";
  }

  insertCode(code: string) {
    this.insertString("{{" + code + "}}");
  }

  insertString(stringValue: string) {
    const subjectInput:HTMLInputElement = document.querySelector("#subject-input");
    const messageTextarea:HTMLTextAreaElement = document.querySelector("#message-body-textarea");

    if(this.hasSubjectFocus) {
      this.insertAtCursor(subjectInput, stringValue);
      this.newsletterForm.get("subject").setValue(subjectInput.value);
    } else if(this.hasMessageBodyFocus) {
      this.insertAtCursor(messageTextarea, stringValue);
      this.newsletterForm.get("message").setValue(messageTextarea.value);
    }
  }

  insertAtCursor(element:HTMLTextAreaElement | HTMLInputElement, stringToInsert) {
    //IE support
    // @ts-ignore
    if (document.selection) {
      console.log("ie mode");
      element.focus();
      // @ts-ignore
      const sel = document.selection.createRange();
      sel.text = stringToInsert;
      element.focus();
    }
    //MOZILLA and others
    else if (element.selectionStart || element.selectionStart == 0) {
      const startPos = element.selectionStart;
      const endPos = element.selectionEnd;
      element.value = element.value.substring(0, startPos)
        + stringToInsert
        + element.value.substring(endPos, element.value.length);

      // put cursor to new location
      element.selectionStart = startPos + stringToInsert.length;
      element.selectionEnd = startPos + stringToInsert.length;

      element.focus();
    } else {
      element.value += stringToInsert;
      element.focus();
    }
  }


}
