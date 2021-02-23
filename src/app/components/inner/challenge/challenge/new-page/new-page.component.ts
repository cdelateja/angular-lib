import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractValidator, ClientService, FormValidator, NotEmpty, NotNull} from "cdelateja";
import {TranslateService} from "@ngx-translate/core";
import {PageForm, PageRequest, Template, TemplatesResponse} from "../../../../../dtos/class.definition";
import {ObservablesService} from "../../../../../services/observables.service";
import {Subscription} from "rxjs";
import {ChallengeService} from "../../../../../services/challenge.service";

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
  public templatesResponse: TemplatesResponse = new TemplatesResponse();
  public templates: Template[] = [];

  constructor(protected translate: TranslateService, private observablesService: ObservablesService,
              private challengeService: ChallengeService) {
    super(translate);
    this.subscriptions.push(
      this.observablesService.obsNewPage().subscribe((newPage: any) => {
        this.reset();
        $('#newPageModal').modal('toggle');
      })
    );
    this.subscriptions.push(
      this.challengeService.getTemplates().subscribe(result => {
        if (ClientService.validateData(result)) {
          this.templatesResponse = result.result;
          this.templatesResponse.data.forEach(e => {
            const template: Template = new Template();
            template.name = e.attributes.name;
            template.pageId = e.attributes.pageId;
            this.templates.push(template);
          })
        }
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  save() {
    if (this.validateForm()) {
      const pageForm: PageForm = this.formGroup.value;
      const pageRequest: PageRequest = new PageRequest();
      pageRequest.data.attributes.name = pageForm.name;
      pageRequest.data.attributes.templateId = pageForm.templateId.pageId;
      this.subscriptions.push(
        this.challengeService.savePage(pageRequest).subscribe(result => {
          if (ClientService.validateData(result)) {
            this.observablesService.refreshTable(null);
            $('#newPageModal').modal('toggle');
          }
        })
      );
    }
  }

}
