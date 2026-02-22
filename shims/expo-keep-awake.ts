export const ExpoKeepAwakeTag = "ExpoKeepAwakeDisabledTag";

export function useKeepAwake(): void {
  // no-op shim to avoid dev-only keep-awake activation errors
}

export async function isAvailableAsync(): Promise<boolean> {
  return false;
}

export async function activateKeepAwakeAsync(): Promise<void> {}

export async function deactivateKeepAwake(): Promise<void> {}

export async function activateKeepAwake(): Promise<void> {}
