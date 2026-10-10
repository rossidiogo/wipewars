// Preact entry. Loaded as a module, so it always runs after the inline legacy script.
import { initStore } from './bridge/store';

initStore();
