import UuidStore, { uuidStore } from '/src/store/uuid.store';
import { EnvUtil } from '/src/utils/env.util';

export default class HttpClient {
  constructor(private readonly uuidStore: UuidStore) {}

  async isValidUuid(key: string) {
    return fetch(EnvUtil.URL() + '/users/sign-in', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ key }),
    })
      .then((response) => response.ok)
      .catch(() => false);
  }

  async fetchUuid(username: string): Promise<string> {
    return fetch(EnvUtil.URL() + '/users/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.text())
      .then((uuid) => this.uuidStore.setValue(uuid));
  }
}

export const httpClient = new HttpClient(uuidStore);
