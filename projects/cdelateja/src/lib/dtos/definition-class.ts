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
  public jti: string;

}

/**
 * Class definition for the user in Oauth
 */
export class User {
  public id: number;
  public userName: string;
  public email: string;
  public password: string;
  public secretKey: string;
  public ip: string;
  public idRole: number;
  public authorities: string[] = [];
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
  public bufferSize = 0;
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

export class ValidateReq {
  public key: string;
}

export class MultipleSessionError implements Error {
  public message: string;
  public name: string;

  constructor(message) {
    this.message = message;
    this.name = 'MultipleSessionError';
  }
}

export class Equals {
  public equals(o2: any): boolean {
    return this === o2;
  }
}

export function ifEquals(eqVal: string, o1: any, o2: any): boolean {
  if (o2 === null) {
    return false;
  }
  return o1[eqVal] === o2[eqVal];
}
