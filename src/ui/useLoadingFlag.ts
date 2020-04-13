import { useState, useCallback } from "react";

export function useLoadingFlag(): [
  boolean,
  <T>(task: () => Promise<T>) => Promise<T>
] {
  const [loading, setLoading] = useState(false);

  const performLoadingTask = useCallback(
    async <T>(task: () => Promise<T>) => {
      let result: T;

      try {
        setLoading(true);
        result = await task();
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }

      return result;
    },
    [setLoading]
  );

  return [loading, performLoadingTask];
}
