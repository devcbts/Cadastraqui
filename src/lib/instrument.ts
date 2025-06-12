// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import { init } from '@sentry/node';
init({
  dsn: "https://247f2691730dbecb576ae0bcafe018d6@o4509486897758208.ingest.us.sentry.io/4509486903525376",
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});