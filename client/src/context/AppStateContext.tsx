import React, { createContext, useContext, useRef, useState, useCallback, useMemo } from 'react';
import {
  residents as initialResidents,
  staff as initialStaff,
  rooms as initialRooms,
  type MockResident,
  type MockStaff,
  type MockRoom,
} from '../data/mockData';

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------
interface AppStateContextType {
  /** Internal ref-backed store – read from here during render */
  store: Record<string, any[]>;
  /** Trigger a state update for a given collection key */
  setCollection: (key: string, updater: any[] | ((prev: any[]) => any[])) => void;
  /** Monotonically increasing counter that forces consumers to re-render */
  version: number;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);

  // Ref-backed store so reads are always synchronous & consistent
  const storeRef = useRef<Record<string, any[]>>({
    residents: [...initialResidents],
    staff: [...initialStaff],
    rooms: [...initialRooms],
  });

  const setCollection = useCallback(
    (key: string, updater: any[] | ((prev: any[]) => any[])) => {
      const prev = storeRef.current[key] ?? [];
      storeRef.current[key] = typeof updater === 'function' ? updater(prev) : updater;
      setVersion((v) => v + 1);
    },
    [],
  );

  const value = useMemo(
    () => ({ store: storeRef.current, setCollection, version }),
    [setCollection, version],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Low-level access to the whole store */
export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('AppStateContext not found – wrap your app with <AppStateProvider>');
  return ctx;
}

/**
 * Drop-in replacement for `useState<T[]>(initialData)`.
 *
 * Data lives in the shared store keyed by `key`.
 * First caller with a given key seeds the store with `initialData`.
 * Subsequent callers (same or different component) share the same array.
 */
export function useCollection<T>(
  key: string,
  initialData: T[],
): [T[], (updater: T[] | ((prev: T[]) => T[])) => void] {
  const { store, setCollection } = useAppState();

  // Lazy-init: safe because we mutate the ref, not React state
  if (!(key in store)) {
    store[key] = [...initialData];
  }

  const data = store[key] as T[];

  const setData = useCallback(
    (updater: T[] | ((prev: T[]) => T[])) => {
      setCollection(key, updater as any);
    },
    [setCollection, key],
  );

  return [data, setData];
}

// -- Typed shortcuts for core collections ----------------------------------

export function useResidents(): [MockResident[], (u: MockResident[] | ((p: MockResident[]) => MockResident[])) => void] {
  return useCollection<MockResident>('residents', initialResidents);
}

export function useStaff(): [MockStaff[], (u: MockStaff[] | ((p: MockStaff[]) => MockStaff[])) => void] {
  return useCollection<MockStaff>('staff', initialStaff);
}

export function useRooms(): [MockRoom[], (u: MockRoom[] | ((p: MockRoom[]) => MockRoom[])) => void] {
  return useCollection<MockRoom>('rooms', initialRooms);
}
