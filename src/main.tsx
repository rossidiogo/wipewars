// Preact entry. Loaded as a module, so it always runs after the inline legacy script.
import { registerScreen } from './bridge/mount';
import { initStore } from './bridge/store';
import { Mail } from './screens/mail/Mail';
import { Skills } from './screens/skills/Skills';

initStore();

// Screens already migrated from js/ui/. Each call replaces that screen's legacy DRAW entry.
registerScreen('mail', 'mailBody', Mail);
// Screens that never had a legacy version.
registerScreen('skills', 'skillBody', Skills);
