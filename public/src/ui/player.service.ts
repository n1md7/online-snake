import { UuidStore } from './store/uuid.store.js';
import { EnvUtil } from '../env.util.js';

export class PlayerService {
  constructor(private readonly uuidStore: UuidStore) {}

  async isValidUuid(key: string) {
    return fetch(EnvUtil.URL + '/users/sign-in', {
      method: 'POST',
      headers: { 'Content-type': 'Application/json' },
      body: JSON.stringify({ key }),
    })
      .then((response) => response.ok)
      .catch(() => false);
  }

  async fetchUuid(username: string) {
    return fetch(EnvUtil.URL + '/users/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.text())
      .then((uuid) => this.uuidStore.setValue(uuid));
  }
}
