import { writable } from 'svelte/store';

export const rowChanges = writable({});

export function resetTableChanges() {
  rowChanges.set({});
}