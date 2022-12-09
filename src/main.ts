import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

Sentry.init({
  dsn: environment.dsn,
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: [environment.baseUrl],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
});
