export class LoginAction {
  static readonly type = '[Login] Login Status';
}

export class LogoutAction {
  static readonly type = '[Logout] Logout Status';
}

export enum STATUS {
  login = 'LOGIN',
  logout = 'LOGOUT',
  logged = 'LOGGED',
  notLogged = 'LOGGED'
}
