import {pageRegistry} from './registry';
import {plannedRouteRecords} from './roadmap';

const livePaths = new Set(pageRegistry.map((page) => page.path));

export const contentCatalog = [
  ...pageRegistry.map((page) => ({
    key:page.key,
    path:page.path,
    frPath:page.frPath,
    kind:page.kind,
    published:page.published,
    indexable:page.indexable,
    status:page.published ? 'published' as const : 'draft' as const,
    page,
  })),
  ...plannedRouteRecords.filter((route) => !livePaths.has(route.path)),
];

export function getCatalogEntry(path:string) {
  const normalized = path.replace(/^\/+|\/+$/g,'');
  return contentCatalog.find((entry) => entry.path === normalized || ('frPath' in entry && entry.frPath === normalized));
}
