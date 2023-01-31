export class Counter {
  protected defaultValue = 0;
  protected currentValue = 0;

  constructor(defaultValue = 0, currentValue = 0) {
    this.defaultValue = defaultValue;
    this.currentValue = currentValue;
  }

  increase() {
    return ++this.currentValue;
  }

  decrease() {
    return --this.currentValue;
  }

  reset() {
    this.currentValue = this.defaultValue;
  }

  value() {
    return this.currentValue;
  }
}
