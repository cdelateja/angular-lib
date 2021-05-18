import {Equals, ifEquals} from 'cdelateja';

export class BasicForm {
  public name: string = '';
  public alias: string = '';
  public password: string = '';
  public age: number = null;
  public birthday: string = '';
  public comments: string = '';
  public terms: boolean = null;
  public country: any = new Pais(1, 'Mexico');
  public gender: any = {id: 1, nombre: 'Masculino'};
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

export class Pais extends Equals {
  public id: number;
  public pais: string;

  constructor(id: number, pais: string) {
    super();
    this.id = id;
    this.pais = pais;
  }

  equals(o2: any): boolean {
    return ifEquals('id', this, o2);
  }
}
