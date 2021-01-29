import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {RecipientService} from "../recipient.service";
import {Recipient} from "../recipient";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipient-detail',
  templateUrl: './recipient-edit.component.html',
  styleUrls: ['./recipient-edit.component.scss']
})
export class RecipientEditComponent implements OnInit, OnDestroy {

  public recipientForm = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    callingName: [null, Validators.required],
    emailAddress: [null, Validators.required],
    defaultGreeting: [null, Validators.required],
    defaultSalutation: [null, Validators.required]
  });

  private recipientSubscription: Subscription;

  private recipient: Recipient | undefined = undefined;

  public formTitle = "";

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private recipientService: RecipientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const exists = this.route.snapshot.paramMap.has('id');

    if(exists) {
      const id = +this.route.snapshot.paramMap.get('id');
      this.recipientSubscription = this.recipientService
        .getRecipientById(id)
        .subscribe(recipient => {
          this.recipient = recipient;
          this.formTitle = "Edit " + recipient.firstName + " " + recipient.lastName;
          this.recipientForm.get("firstName").setValue(recipient.firstName);
          this.recipientForm.get("lastName").setValue(recipient.lastName);
          this.recipientForm.get("callingName").setValue(recipient.callingName);
          this.recipientForm.get("emailAddress").setValue(recipient.emailAddress);
          this.recipientForm.get("defaultGreeting").setValue(recipient.defaultGreeting);
          this.recipientForm.get("defaultSalutation").setValue(recipient.defaultSalutation);
        });
    } else {
      this.formTitle = "New recipient";
    }
  }

  ngOnDestroy(): void {
    if(this.recipientSubscription) {
      this.recipientSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    if(this.recipientForm.valid) {

      const exists = this.recipient !== undefined;

      let recipient = this.createRecipientObject(exists);

      if(exists) {
        this.recipientService.updateRecipient(recipient);
      } else {
        this.recipientService.addRecipient(recipient);
      }

      this.router.navigate(["/recipients"]);

    }
  }

  private createRecipientObject(exists: boolean) {
    let recipient: Recipient;

    if (exists) {
      recipient = this.recipient;
    } else {
      recipient = {creationDate: new Date()} as Recipient;
    }

    recipient.firstName = this.recipientForm.get("firstName").value;
    recipient.lastName = this.recipientForm.get("lastName").value;
    recipient.callingName = this.recipientForm.get("callingName").value;
    recipient.emailAddress = this.recipientForm.get("emailAddress").value;
    recipient.defaultGreeting = this.recipientForm.get("defaultGreeting").value;
    recipient.defaultSalutation = this.recipientForm.get("defaultSalutation").value;

    return recipient;
  }

}
