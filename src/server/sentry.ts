// import { opentelemetry } from '@elysiajs/opentelemetry';
import * as Sentry from '@sentry/node';
import Elysia from 'elysia';
import { Env } from '@/constants';

export function sentry() {
  Sentry.init({
    enabled: Env.isProduction(),
    dsn: Env.get('SENTRY_DSN'),
    environment: Env.get('SENTRY_ENVIRONMENT'),
    tracesSampleRate: 1.0,
  });

  return new Elysia().decorate('Sentry', Sentry);
  // TODO: Add opentelemetry (https://sentry.io/for/opentelemetry/?platform=sentry.javascript.node-otel)
  // .use(opentelemetry())
  // // Capture exceptions
  // .onError({ as: 'global' }, function captureException({ error, Sentry }) {
  //   Sentry.captureException(error);
  // })
  // // Need this to inject attributes into the span
  // // https://github.com/elysiajs/opentelemetry/issues/40
  // .onAfterResponse(
  //   { as: 'global' },
  //   function injectAttributes({
  //     body,
  //     cookie,
  //     params,
  //     request,
  //     response,
  //     route,
  //     server,
  //     store,
  //     headers,
  //     path,
  //     query,
  //   }) {},
  // )
}
