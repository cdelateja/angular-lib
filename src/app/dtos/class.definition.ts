export class BasicForm {
  public name: string = '';
  public alias: string = '';
  public password: string = '';
  public birthday: string = '';
  public comments: string = '';
  public terms: any = null;
  public country: any = null;
  public gender: any = null;
  public hobbies: any = null;
  public myOther: any = null;
}

export class Group {
  public name: string = '';
  public description: string = '';
  public status: string = '';
  public group: string = '';
  public master: string = '';
  public funds: string = '';
  public accounts: Account[] = [];
}

export class Balance {
  public today: number;
  public balance: number;
}

export class Movement {
  public balance: number;
  public operation: string;
  public date: Date = new Date();
}

export class Login {
  public userName = '';
  public password = '';
}

export class PageForm {
  public name = '';
  public templateId: any = null;
}

export class PageResponse {
  public name = '';
  public templateId: any = null;
}

export class PagesResponse {
  data: DataPage[] = [];
}

export class DataPage {
  public type = '';
  public id = '';
  public attributes: AttributePage = null;
}

export class AttributePage {
  public title = '';
  public url = '';
  public pageType = '';
}

export class PageRequest {
  public data = {
    type: 'create-new-page',
    attributes: {
      name: '',
      templateId: 0
    }
  }
}
