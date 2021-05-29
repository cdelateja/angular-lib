export default class Utils {

  public static isNull(arg) {
    return arg === null;
  }

  public static isPrimitive(arg): boolean {
    return arg === null ||
      typeof arg === 'boolean' ||
      typeof arg === 'number' ||
      typeof arg === 'string' ||
      typeof arg === 'symbol' ||  // ES6 symbol
      typeof arg === 'undefined';
  }

  public static formatToddMMYY(date): string {
    function pad(s): string {
      return (s < 10) ? '0' + s : s;
    }

    const d = new Date(date);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }
}
