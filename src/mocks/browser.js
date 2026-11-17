import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

/** Service Worker de MSW: intercepta en el navegador los fetch que coinciden con los handlers. */
export const worker = setupWorker(...handlers)
