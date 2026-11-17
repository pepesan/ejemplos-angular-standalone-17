// Igual que en angular.json (polyfills): ng-bootstrap usa $localize en sus plantillas.
import '@angular/localize/init';
import { applicationConfig, type Preview } from '@storybook/angular-vite';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const preview: Preview = {
  // Providers de aplicación comunes: los componentes del temario usan router y HttpClient.
  decorators: [
    applicationConfig({
      providers: [provideRouter([]), provideHttpClient()],
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
