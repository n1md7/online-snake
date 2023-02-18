import { Store } from './store.js';

export class UuidStore extends Store {
  protected get KEY() {
    return 'Player-UUID';
  }

  setValue(name: string) {
    super.setValue(name);
    return name;
  }
}
