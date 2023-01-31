/**
 * @description Redis|RabbitMQ|... fully qualified URL parser
 * @example redis://username:password@example.com:6379
 * @example ampq://username:password@example.com:7654
 * @example redis://example.com:6379
 * @example ampq://example.com:2233
 * @NOTE: Make sure at (@) symbol is not included in the password value
 */
export class FullyQualifiedUrlParser {
  public readonly host: string;
  public readonly port: number;
  public readonly username: string;
  public readonly password: string;
  public readonly protocol: string;

  constructor(url: string) {
    if (!url) throw new Error('FullyQualifiedUrlParser: url is required');
    if ((url.match(/@/g) || []).length > 1)
      throw new Error('Symbol @ should appear no more than 1 time');

    const match = url.match(
      /^([a-z]*:\/\/)?(?:([^:]+):([^@]+)@)?([^:]+)(?::(\d+))?(?:\/(\d+))?/,
    );
    if (!match || !match[1])
      throw new Error('FullyQualifiedUrlParser: url is invalid');
    const [, protocol, username, password, host, port] = match;
    this.host = host;
    this.port = port && +port;
    this.password = password;
    this.username = username;
    this.protocol = protocol;
  }

  get asObject() {
    return {
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      protocol: this.protocol,
    };
  }
}
