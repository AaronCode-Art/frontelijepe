import type { AppState } from "../types";

const KEY = "elijepe_state";

export function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<AppState>) : null;
  } catch {
    return null;
  }
}

export function saveState(state: Partial<AppState>): void {
  try {
    // Don't persist the full notifications array (too large), just key parts
    const toSave: Partial<AppState> = {
      user: state.user,
      favorites: state.favorites,
      compareList: state.compareList,
      testResults: state.testResults,
      currentTestAnswers: state.currentTestAnswers,
      simuladorLoaded: state.simuladorLoaded,
      savedSearches: state.savedSearches,
      viewedUnis: state.viewedUnis,
      ratings: state.ratings,
      tags: state.tags,
      pinnedUnis: state.pinnedUnis,
      chatSessions: state.chatSessions,
      communityLikes: state.communityLikes,
      financieroEnabled: state.financieroEnabled,
    };
    localStorage.setItem(KEY, JSON.stringify(toSave));
  } catch {
    // quota exceeded or private mode
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY);
}
