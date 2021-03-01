export default class Utils {

    static isNull(arg) {
        return arg === null;
    }

    static isPrimitive(arg) {
        return arg === null ||
            typeof arg === 'boolean' ||
            typeof arg === 'number' ||
            typeof arg === 'string' ||
            typeof arg === 'symbol' ||  // ES6 symbol
            typeof arg === 'undefined';
    }

    static formatddMMYY(date) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      const d = new Date(date);
      return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    }
}
