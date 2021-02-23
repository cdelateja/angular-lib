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

export class PageForm {
  public name = '';
  public templateId: any = null;
}

export class PageResponse {
  public name = '';
  public templateId: Template = null;
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

export class Template {
  name: String = '';
  pageId = 0;
}

export class TemplatesResponse {
  data: DataTemplate[] = [];
}

export class DataTemplate {
  public type = '';
  public id = '';
  public attributes: AttributeTemplate = null;
}

export class AttributeTemplate {
  public pageId = 0;
  public name = '';
}
