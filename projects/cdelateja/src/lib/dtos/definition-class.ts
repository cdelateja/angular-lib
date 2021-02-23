/**
 * Class definition for the response of rest services
 */
export class Response {
  constructor(public responseStatus: number, public responseError?: string, public result?: any) {
  }
}

/**
 *
 */
export class Progress {
  constructor(public progress: number) {
  }
}

/**
 * Class definition for the Token on Oauth
 */
export class Token {
  public access_token: string;
  public token_type: string;
  public refresh_token: string;
  public expires_in: string;
  public scope: string;
  public compania: string;
  public jti: string;

}

/**
 * Class definition for the user in Oauth
 */
export class User {
  constructor(public userName: string, public authorities: string[]) {
  }
}

/**
 * Class definition user IAM
 */
export class UserIAM {
  public interno: boolean;
  public activo: boolean;
  public administrador: boolean;
  public id: number;
  public idUsuario: number;
  public nombre: string;
  public nombreUsuario: string;
  public telefono: string;
  public email: string;
}

/**
 * Class definition for the properties file
 */
export class ConfigFile {
  public url: string;
  public names: string[];
  public profile: string;
}

/**
 * Class definition  to configure any dynamic field
 */
export interface FieldConfig {
  label?: string;
  placeHolder?: string;
  formControlName?: string;
  collections?: any;
  validations?: string[];
  type: string;
  value?: any;
  itemCaption?: string;
  eqVal?: string;
}

export class LoginRequest {
  public username = '';
  public password = '';
  public autoLogin = false;

  constructor() {
  }
}

export class ClientOptions {
  public delay?: number;
  public take?: number;
  public bufferSize?: number = 0;
}


export class PreferenciaGridRequest {
  public id: number = null;
  public gridName = '';
  public preferencias: PreferenciaNombreRequest[] = [];
}

export class PreferenciaNombreRequest {
  public id: number = null;
  public prefName = '';
  public gridName = '';
  public publica = true;
  public owner = '';
  public description = '';
  public orderColumns: string[] = [];
  public hideColumns: string[] = [];
  public freezeColumns: string[] = [];
  public filters: FiltroRequest[] = [];
}

export class FiltroRequest {
  public columnName = '';
  public value = '';
}

export class IdRequest {
  public id: number;
}
export class MultipleSessionError implements Error {
  message: string;
  name: string;

  constructor(message) {
    this.message = message;
    this.name = 'MultipleSessionError';
  }
}
