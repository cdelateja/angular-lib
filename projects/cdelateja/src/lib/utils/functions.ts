export function ifEquals(eqVal: string, o1: any, o2: any): boolean {
  if (o2 === null) {
    return false;
  }
  return o1[eqVal] === o2[eqVal];
}
