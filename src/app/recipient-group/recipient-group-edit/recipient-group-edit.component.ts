import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {RecipientGroupService} from "../recipient-group.service";
import {RecipientGroup} from "../recipient-group";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {Recipient} from "../../recipient/recipient";
import {RecipientService} from "../../recipient/recipient.service";
import {NgOption} from "@ng-select/ng-select/lib/ng-select.types";

@Component({
  selector: 'app-recipient-group-detail',
  templateUrl: './recipient-group-edit.component.html',
  styleUrls: ['./recipient-group-edit.component.scss']
})
export class RecipientGroupEditComponent implements OnInit, OnDestroy {

  public recipientGroupForm = this.formBuilder.group({
    title: [null, Validators.required]
  });

  private recipientGroupSubscription: Subscription;
  private recipientGroup: RecipientGroup | undefined = undefined;

  recipientList$: Observable<Recipient[]>;
  selectedRecipientList: Recipient[] = [];

  public formTitle = "";

  private recipientIdList: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private recipientGroupService: RecipientGroupService,
    private recipientService: RecipientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipientList$ = this.recipientService.getRecipientList();

    const exists = this.route.snapshot.paramMap.has('id');

    if(exists) {
      const id = +this.route.snapshot.paramMap.get('id');
      this.recipientGroupSubscription = this.recipientGroupService
        .getRecipientGroupById(id)
        .subscribe(recipientGroup=> {
          this.recipientGroup= recipientGroup;
          this.formTitle = "Edit " + recipientGroup.title;
          this.recipientGroupForm.get("title").setValue(recipientGroup.title);
          this.recipientIdList = recipientGroup.recipientIdList;
          this.recipientService.getRecipientListByIdList(recipientGroup.recipientIdList).subscribe(selectedRecipientList => {
            this.selectedRecipientList = selectedRecipientList;
          })
        });
    } else {
      this.formTitle = "New recipient-group";
    }
  }

  ngOnDestroy(): void {
    if(this.recipientGroupSubscription) {
      this.recipientGroupSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    if(this.recipientGroupForm.valid) {

      const exists = this.recipientGroup!== undefined;

      let recipientGroup= this.createRecipientGroupObject(exists);

      if(exists) {
        this.recipientGroupService.updateRecipientGroup(recipientGroup);
      } else {
        this.recipientGroupService.addRecipientGroup(recipientGroup);
      }

      await this.router.navigate(["/recipient-groups"]);
    }
  }

  private createRecipientGroupObject(exists: boolean) {
    let recipientGroup: RecipientGroup;

    if (exists) {
      recipientGroup= this.recipientGroup;
    } else {
      recipientGroup= {creationDate: new Date()} as RecipientGroup;
    }

    recipientGroup.title = this.recipientGroupForm.get("title").value;
    recipientGroup.recipientIdList = this.recipientIdList;

    return recipientGroup;
  }

  onAddRecipient(recipient: Recipient) {
    this.recipientIdList.push(recipient.id);
  }

  onRemoveRecipient($event: NgOption) {
    const recipient = $event.value as Recipient;
    this.recipientIdList = this.recipientIdList.filter(recipientId => recipientId != recipient.id);
  }

  onClear() {
    this.recipientIdList = this.selectedRecipientList = [];
  }

  customSearchFn(term: string, recipient: Recipient) {
    term = term.toLowerCase();
    return recipient.firstName.toLowerCase().indexOf(term) > -1
      || recipient.lastName.toLowerCase().indexOf(term) > -1
      || recipient.callingName.toLowerCase().indexOf(term) > -1
      || (recipient.firstName + " " + recipient.lastName).toLowerCase().indexOf(term) > -1
      || recipient.emailAddress.toLowerCase().indexOf(term) > -1
  }

  deleteRecipient(recipient: Recipient) {
    this.recipientIdList = this.recipientIdList.filter(recipientId => recipientId != recipient.id);
    this.selectedRecipientList = this.selectedRecipientList.filter(selectedRecipient => selectedRecipient.id != recipient.id);
  }

}
