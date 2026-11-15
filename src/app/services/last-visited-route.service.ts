import { Injectable } from '@angular/core';

const LAST_ROUTE_KEY = 'angular-aprende-haciendo:last-route';
const DEFAULT_ROUTE = '/home';

@Injectable({ providedIn: 'root' })
export class LastVisitedRouteService {
  getInitialRoute(): string {
    try {
      const savedRoute = localStorage.getItem(LAST_ROUTE_KEY);
      return this.isInternalRoute(savedRoute) && savedRoute !== '/' ? savedRoute : DEFAULT_ROUTE;
    } catch {
      return DEFAULT_ROUTE;
    }
  }

  rememberRoute(url: string): void {
    // Persist only the path; query strings may contain temporary or private data.
    const path = url.split(/[?#]/, 1)[0];
    if (!this.isInternalRoute(path) || path === '/') {
      return;
    }

    try {
      localStorage.setItem(LAST_ROUTE_KEY, path);
    } catch {
      // The app remains usable when browser storage is unavailable.
    }
  }

  private isInternalRoute(route: string | null | undefined): route is string {
    return Boolean(route && route.startsWith('/') && !route.startsWith('//') && !route.includes('\\'));
  }
}
