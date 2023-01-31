export const configureOrigin = (origin, callback) => {
  const corsWhitelist = process.env.ORIGIN.split(',');
  const originNotDefined = !origin;
  const isWhitelisted = corsWhitelist.indexOf(origin) !== -1;
  const isLocalhost = new RegExp(/^https?:\/\/(localhost|127.0.0.1)/).test(origin);
  const isMegrulad = new RegExp(/^https?:\/\/(.*)\.megrulad\.ge/).test(origin);
  const corsAllowed = originNotDefined || isLocalhost || isWhitelisted || isMegrulad;

  if (corsAllowed) return callback(null, true);
  callback(new Error(`Origin [${origin}] Not allowed by CORS`));
};
