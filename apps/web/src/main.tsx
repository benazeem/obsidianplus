import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools' 
import './styles.css'
import reportWebVitals from './reportWebVitals.ts' 
import App from './App.tsx'    
import Home from './pages/Home'
import Install from './pages/Install'
import PrivacyPolicy from './pages/PrivacyPolicy.tsx'
import TermsOfService from './pages/TermsOfService.tsx'

// Root route wraps layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
 
const appRoute = createRoute({
  id: 'app',
  getParentRoute: () => rootRoute,
  component: App,
})
 
const homeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: Home,
})

// Install page shown inside <App />
const installRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/install',
  component: Install,
})

const privacyPolicyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/privacy-policy',
  component: PrivacyPolicy,
})

const termsOfServiceRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/terms-of-service',
  component: TermsOfService,
})

export const routeTree = rootRoute.addChildren([appRoute.addChildren([homeRoute, installRoute, privacyPolicyRoute, termsOfServiceRoute])])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render( 
      <RouterProvider router={router} /> 
  )
} 
reportWebVitals()
