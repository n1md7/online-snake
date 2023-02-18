export class EnvUtil {
  static get URL() {
    return import.meta.env.VITE_APP_SOCKET_URL;
  }
}
