export default class Location {
  private readonly _url: URL;

  constructor(href: string) {
    this._url = new URL(href);
  }

  getGameID() {
    return this._url.searchParams.get('gid');
  }

  setGameID(gid: string) {
    this._url.searchParams.set('gid', gid);
    console.log(this._url.toString());
    window.history.pushState({ path: this._url.toString() }, '', this._url.toString());
  }
}

export const url = new Location(window.location.href);
