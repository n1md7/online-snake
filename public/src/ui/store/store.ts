export abstract class Store {
  protected get KEY() {
    return 'Default-KEY';
  }

  getValue() {
    return localStorage.getItem(this.KEY);
  }

  hasValue() {
    return !!this.getValue();
  }

  setValue(name: string) {
    localStorage.setItem(this.KEY, name);
  }
}
