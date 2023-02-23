import Store from './store';

export default class UuidStore extends Store {
  protected KEY() {
    return 'Player-UUID';
  }

  setValue(name: string) {
    super.setValue(name);
    return name;
  }
}

export const uuidStore = new UuidStore();
