import {Component, OnDestroy, OnInit} from '@angular/core';
import {ObservablesService} from "../../../../../services/observables.service";
import {Subscription} from "rxjs";
import {ChallengeService} from "../../../../../services/challenge.service";
import {ClientService} from "cdelateja";

declare var $: any;

@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrls: ['./show-page.component.scss']
})
export class ShowPageComponent implements OnInit, OnDestroy {

  public htmlPage = '';
  private subscriptions: Subscription[] = [];

  constructor(private observablesService: ObservablesService, private challengeService: ChallengeService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.observablesService.obsModalViewPage().subscribe((id: number) => {
        this.challengeService.getPage(id).subscribe(result => {
          if (ClientService.validateData(result)) {
            this.htmlPage = result.result;
            $('#showPageModal').modal('toggle');
          }
        });

      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
