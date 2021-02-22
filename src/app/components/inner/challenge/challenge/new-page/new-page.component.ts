import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractValidator, FormValidator, NotEmpty, NotNull} from "cdelateja";
import {TranslateService} from "@ngx-translate/core";
import {PageForm} from "../../../../../dtos/class.definition";
import {ObservablesService} from "../../../../../services/observables.service";

declare var $: any;

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.scss']
})
@FormValidator({
  formId: '',
  validators: [
    NotEmpty.generate(['name']),
    NotNull.generate(['templateId'])
  ],
  object: new PageForm()
})
export class NewPageComponent extends AbstractValidator implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(protected translate: TranslateService, private observablesService: ObservablesService) {
    super(translate);
    this.subscriptions.push(
      this.observablesService.obsNewPage().subscribe((newPage: any) => {
        this.reset();
        $('#newPageModal').modal('toggle');
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  guardar() {
    if (this.validateForm()) {
      const pageForm: PageForm = this.formGroup.value;

    }
  }

}
