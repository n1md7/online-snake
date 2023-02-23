export default abstract class Store {
  protected KEY() {
    return 'Default-KEY';
  }

  getValue() {
    return localStorage.getItem(this.KEY());
  }

  hasValue() {
    return !!this.getValue();
  }

  setValue(name: string) {
    localStorage.setItem(this.KEY(), name);
  }
}
