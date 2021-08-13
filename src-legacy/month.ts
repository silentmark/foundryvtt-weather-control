export class Month {
  name = '';
  length = 0;
  leapLength = 0;
  isNumbered = true;
  abbrev = '';
  constructor(name = '', length = 0, leapLength = 0, isNumbered = true, abbrev = '') {
    this.name = name;
    this.length = Number(length);
    this.leapLength = Number(leapLength) || 1;
    this.isNumbered = isNumbered;
    this.abbrev = abbrev;
  }

  setAbbrev(abbrev: string): void {
    this.abbrev = abbrev;
  }
  getAbbrev(): string {
    return this.abbrev;
  }
}
