/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthImport } from './routes/_auth'
import { Route as AppImport } from './routes/_app'

// Create Virtual Routes

const AppIndexLazyImport = createFileRoute('/_app/')()
const AuthLoginLazyImport = createFileRoute('/_auth/login')()
const AuthJoinLazyImport = createFileRoute('/_auth/join')()
const AppNotesLazyImport = createFileRoute('/_app/notes')()
const AppNotesNewLazyImport = createFileRoute('/_app/notes/new')()
const AppNotesIdIndexLazyImport = createFileRoute('/_app/notes/$id/')()
const AppNotesIdEditLazyImport = createFileRoute('/_app/notes/$id/edit')()

// Create/Update Routes

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexLazyRoute = AppIndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AppRoute,
} as any).lazy(() => import('./routes/_app/index.lazy').then((d) => d.Route))

const AuthLoginLazyRoute = AuthLoginLazyImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/_auth/login.lazy').then((d) => d.Route))

const AuthJoinLazyRoute = AuthJoinLazyImport.update({
  id: '/join',
  path: '/join',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/_auth/join.lazy').then((d) => d.Route))

const AppNotesLazyRoute = AppNotesLazyImport.update({
  id: '/notes',
  path: '/notes',
  getParentRoute: () => AppRoute,
} as any).lazy(() => import('./routes/_app/notes.lazy').then((d) => d.Route))

const AppNotesNewLazyRoute = AppNotesNewLazyImport.update({
  id: '/new',
  path: '/new',
  getParentRoute: () => AppNotesLazyRoute,
} as any).lazy(() =>
  import('./routes/_app/notes.new.lazy').then((d) => d.Route),
)

const AppNotesIdIndexLazyRoute = AppNotesIdIndexLazyImport.update({
  id: '/$id/',
  path: '/$id/',
  getParentRoute: () => AppNotesLazyRoute,
} as any).lazy(() =>
  import('./routes/_app/notes.$id.index.lazy').then((d) => d.Route),
)

const AppNotesIdEditLazyRoute = AppNotesIdEditLazyImport.update({
  id: '/$id/edit',
  path: '/$id/edit',
  getParentRoute: () => AppNotesLazyRoute,
} as any).lazy(() =>
  import('./routes/_app/notes.$id.edit.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_app/notes': {
      id: '/_app/notes'
      path: '/notes'
      fullPath: '/notes'
      preLoaderRoute: typeof AppNotesLazyImport
      parentRoute: typeof AppImport
    }
    '/_auth/join': {
      id: '/_auth/join'
      path: '/join'
      fullPath: '/join'
      preLoaderRoute: typeof AuthJoinLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/login': {
      id: '/_auth/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof AuthLoginLazyImport
      parentRoute: typeof AuthImport
    }
    '/_app/': {
      id: '/_app/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AppIndexLazyImport
      parentRoute: typeof AppImport
    }
    '/_app/notes/new': {
      id: '/_app/notes/new'
      path: '/new'
      fullPath: '/notes/new'
      preLoaderRoute: typeof AppNotesNewLazyImport
      parentRoute: typeof AppNotesLazyImport
    }
    '/_app/notes/$id/edit': {
      id: '/_app/notes/$id/edit'
      path: '/$id/edit'
      fullPath: '/notes/$id/edit'
      preLoaderRoute: typeof AppNotesIdEditLazyImport
      parentRoute: typeof AppNotesLazyImport
    }
    '/_app/notes/$id/': {
      id: '/_app/notes/$id/'
      path: '/$id'
      fullPath: '/notes/$id'
      preLoaderRoute: typeof AppNotesIdIndexLazyImport
      parentRoute: typeof AppNotesLazyImport
    }
  }
}

// Create and export the route tree

interface AppNotesLazyRouteChildren {
  AppNotesNewLazyRoute: typeof AppNotesNewLazyRoute
  AppNotesIdEditLazyRoute: typeof AppNotesIdEditLazyRoute
  AppNotesIdIndexLazyRoute: typeof AppNotesIdIndexLazyRoute
}

const AppNotesLazyRouteChildren: AppNotesLazyRouteChildren = {
  AppNotesNewLazyRoute: AppNotesNewLazyRoute,
  AppNotesIdEditLazyRoute: AppNotesIdEditLazyRoute,
  AppNotesIdIndexLazyRoute: AppNotesIdIndexLazyRoute,
}

const AppNotesLazyRouteWithChildren = AppNotesLazyRoute._addFileChildren(
  AppNotesLazyRouteChildren,
)

interface AppRouteChildren {
  AppNotesLazyRoute: typeof AppNotesLazyRouteWithChildren
  AppIndexLazyRoute: typeof AppIndexLazyRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppNotesLazyRoute: AppNotesLazyRouteWithChildren,
  AppIndexLazyRoute: AppIndexLazyRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

interface AuthRouteChildren {
  AuthJoinLazyRoute: typeof AuthJoinLazyRoute
  AuthLoginLazyRoute: typeof AuthLoginLazyRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthJoinLazyRoute: AuthJoinLazyRoute,
  AuthLoginLazyRoute: AuthLoginLazyRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AuthRouteWithChildren
  '/notes': typeof AppNotesLazyRouteWithChildren
  '/join': typeof AuthJoinLazyRoute
  '/login': typeof AuthLoginLazyRoute
  '/': typeof AppIndexLazyRoute
  '/notes/new': typeof AppNotesNewLazyRoute
  '/notes/$id/edit': typeof AppNotesIdEditLazyRoute
  '/notes/$id': typeof AppNotesIdIndexLazyRoute
}

export interface FileRoutesByTo {
  '': typeof AuthRouteWithChildren
  '/notes': typeof AppNotesLazyRouteWithChildren
  '/join': typeof AuthJoinLazyRoute
  '/login': typeof AuthLoginLazyRoute
  '/': typeof AppIndexLazyRoute
  '/notes/new': typeof AppNotesNewLazyRoute
  '/notes/$id/edit': typeof AppNotesIdEditLazyRoute
  '/notes/$id': typeof AppNotesIdIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_app': typeof AppRouteWithChildren
  '/_auth': typeof AuthRouteWithChildren
  '/_app/notes': typeof AppNotesLazyRouteWithChildren
  '/_auth/join': typeof AuthJoinLazyRoute
  '/_auth/login': typeof AuthLoginLazyRoute
  '/_app/': typeof AppIndexLazyRoute
  '/_app/notes/new': typeof AppNotesNewLazyRoute
  '/_app/notes/$id/edit': typeof AppNotesIdEditLazyRoute
  '/_app/notes/$id/': typeof AppNotesIdIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/notes'
    | '/join'
    | '/login'
    | '/'
    | '/notes/new'
    | '/notes/$id/edit'
    | '/notes/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/notes'
    | '/join'
    | '/login'
    | '/'
    | '/notes/new'
    | '/notes/$id/edit'
    | '/notes/$id'
  id:
    | '__root__'
    | '/_app'
    | '/_auth'
    | '/_app/notes'
    | '/_auth/join'
    | '/_auth/login'
    | '/_app/'
    | '/_app/notes/new'
    | '/_app/notes/$id/edit'
    | '/_app/notes/$id/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AppRoute: typeof AppRouteWithChildren
  AuthRoute: typeof AuthRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  AppRoute: AppRouteWithChildren,
  AuthRoute: AuthRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_app",
        "/_auth"
      ]
    },
    "/_app": {
      "filePath": "_app.tsx",
      "children": [
        "/_app/notes",
        "/_app/"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/join",
        "/_auth/login"
      ]
    },
    "/_app/notes": {
      "filePath": "_app/notes.lazy.tsx",
      "parent": "/_app",
      "children": [
        "/_app/notes/new",
        "/_app/notes/$id/edit",
        "/_app/notes/$id/"
      ]
    },
    "/_auth/join": {
      "filePath": "_auth/join.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/login": {
      "filePath": "_auth/login.lazy.tsx",
      "parent": "/_auth"
    },
    "/_app/": {
      "filePath": "_app/index.lazy.tsx",
      "parent": "/_app"
    },
    "/_app/notes/new": {
      "filePath": "_app/notes.new.lazy.tsx",
      "parent": "/_app/notes"
    },
    "/_app/notes/$id/edit": {
      "filePath": "_app/notes.$id.edit.lazy.tsx",
      "parent": "/_app/notes"
    },
    "/_app/notes/$id/": {
      "filePath": "_app/notes.$id.index.lazy.tsx",
      "parent": "/_app/notes"
    }
  }
}
ROUTE_MANIFEST_END */
