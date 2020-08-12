import { useSelector } from "react-redux";
import { getToken, getOwnUserId } from "./redux";
import Axios from "axios";
import { useState, SetStateAction, Dispatch, useCallback } from "react";
import { useEffectOnce } from "react-use";

async function fetchMetaString(token: string, id: string) {
  const result = await Axios.get<string>(`/api/users/${id}/uiState`, {
    headers: { Authorization: `Bearer ${token}` },
    transformResponse: (res) => res,
  });
  return result.data;
}

async function postUpdateToMetaString(
  token: string,
  id: string,
  newMeta: string
) {
  await Axios.put(`/api/users/${id}/uiState`, newMeta, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
  });
}

type UseUserMetaStringResult = [
  string,
  Dispatch<SetStateAction<string>>,
  { isLoading: boolean }
];

function useUserMetaString(): UseUserMetaStringResult {
  const token = useSelector(getToken).orSome("");
  const ownId = useSelector(getOwnUserId).orSome("");

  const [meta, setMeta] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const updateMeta: Dispatch<SetStateAction<string>> = useCallback(
    (action) => {
      setMeta((prevMeta) => {
        const nextMeta =
          typeof action === "function" ? action(prevMeta) : action;

        setIsLoading(true);
        postUpdateToMetaString(token, ownId, nextMeta)
          .catch(() => {
            setMeta(prevMeta);
          })
          .finally(() => {
            setIsLoading(false);
          });

        return nextMeta;
      });
    },
    [setMeta, token, ownId, setIsLoading]
  );

  useEffectOnce(() => {
    async function fetchInitialMetaFromBackend() {
      setIsLoading(true);

      try {
        const initialMeta = await fetchMetaString(token, ownId);
        setMeta(initialMeta);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialMetaFromBackend();
  });

  return [meta, updateMeta, { isLoading }];
}

type UseUserMetaJSONResult = [
  Record<string, any>,
  Dispatch<SetStateAction<Record<string, any>>>,
  { isLoading: boolean }
];

function parseJsonWithFallback(json: string, fallback: any) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function useUserMetaJSON(): UseUserMetaJSONResult {
  const [meta, setMeta, info] = useUserMetaString();

  const metaJson = parseJsonWithFallback(meta, {});

  const setMetaJson: Dispatch<SetStateAction<
    Record<string, any>
  >> = useCallback(
    (action) => {
      setMeta((prevMeta) => {
        const prevMetaJson = parseJsonWithFallback(prevMeta, {});
        const nextMeta =
          typeof action === "function" ? action(prevMetaJson) : action;

        return JSON.stringify(nextMeta);
      });
    },
    [setMeta]
  );

  return [metaJson, setMetaJson, info];
}

type UseUserMetaResult<T> = [
  T,
  Dispatch<SetStateAction<T>>,
  { isLoading: boolean }
];

export function useUserMeta<T>(
  key: string,
  unsetValue: T
): UseUserMetaResult<T> {
  const [metaJson, setMetaJson, info] = useUserMetaJSON();

  const metaValue: T = metaJson[key] ?? unsetValue;

  const setMeta: Dispatch<SetStateAction<T>> = useCallback(
    (action) => {
      setMetaJson((prevMetaJson) => {
        const prevMetaValue: T | undefined = prevMetaJson[key];
        let nextMetaValue: T;

        if (typeof action === "function") {
          nextMetaValue = (action as (oldMeta: T) => T)(
            prevMetaValue ?? unsetValue
          );
        } else {
          nextMetaValue = action;
        }

        return {
          ...prevMetaJson,
          [key]: nextMetaValue,
        };
      });
    },
    [setMetaJson, key]
  );

  return [metaValue, setMeta, info];
}
