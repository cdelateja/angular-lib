export class LoginAction {
  public static readonly type = '[Login] Login Status';
}

export class LogoutAction {
  public static readonly type = '[Logout] Logout Status';
}

export enum STATUS {
  login = 'LOGIN',
  logout = 'LOGOUT',
  logged = 'LOGGED',
  notLogged = 'LOGGED'
}
