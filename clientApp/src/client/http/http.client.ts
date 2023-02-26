import UserStore, { userStore } from '/src/store/user.store';
import { EnvUtil } from '/src/utils/env.util';

export default class HttpClient {
  constructor(private readonly uuidStore: UserStore) {}

  async isValidUuid(key: string) {
    return fetch(EnvUtil.URL() + '/users/sign-in', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ key }),
    })
      .then((response) => response.ok)
      .catch(() => false);
  }

  async fetchUuid(username: string): Promise<void> {
    return fetch(EnvUtil.URL() + '/users/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.text())
      .then((uuid) => this.uuidStore.setValue({ uuid, name: username }));
  }
}

export const httpClient = new HttpClient(userStore);
