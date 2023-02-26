import EventEmitter from 'eventemitter2';

export default abstract class Store extends EventEmitter {
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
    this.emit('change', name);
  }
}
