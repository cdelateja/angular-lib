import {Component, OnInit} from '@angular/core';
import {ObservablesService} from "../../../../services/observables.service";
import {ChallengeService} from "../../../../services/challenge.service";
import {PagesResponse} from "../../../../dtos/class.definition";
import {ClientService} from "cdelateja";

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {

  public pages: PagesResponse = new PagesResponse();

  constructor(private observablesService: ObservablesService, private challengeService: ChallengeService) {
  }

  ngOnInit(): void {
    this.searchPages();
    this.observablesService.obsRefresh().subscribe(e => {
      this.searchPages();
    });
  }

  searchPages() {
    this.challengeService.getPages().subscribe(result => {
      if (ClientService.validateData(result)) {
        this.pages = result.result;
      }
    });
  }

  add() {
    this.observablesService.openModalNewPage(null);
  }

  show(id: any) {
    this.observablesService.openModalViewPage(id);
  }
}
