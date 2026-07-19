/**
 * @deprecated Use typed API modules in core/services/*.api.ts instead.
 * This file is kept temporarily for backward compatibility during refactor.
 * All callers will be migrated to the new typed API layer.
 */
export { http as fetchWithAuth, logout } from './http.service';
