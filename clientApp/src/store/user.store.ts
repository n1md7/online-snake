import Store from './store';

export type UserStoreType = {
  uuid: string;
  name: string;
  gameId: string;
};

export default class UserStore extends Store<UserStoreType> {
  protected KEY() {
    return 'User-store';
  }
}

export const userStore = new UserStore();
