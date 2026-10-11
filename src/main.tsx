// Preact entry. Loaded as a module, so it always runs after the inline legacy script.
import { registerScreen } from './bridge/mount';
import { initStore } from './bridge/store';
import { Mail } from './screens/mail/Mail';

initStore();

// Screens already migrated from js/ui.js. Each call replaces that screen's legacy DRAW entry.
registerScreen('mail', 'mailBody', Mail);
