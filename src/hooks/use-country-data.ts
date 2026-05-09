import { useEffect, useState } from "react";

import { getCountries, getCountryByCode, type CachedResult } from "../data/countries";
import type { CountryBrief, CountrySummary } from "../types";

type AsyncDataState<T> =
  | {
      status: "loading";
      data: null;
      source: null;
      error: null;
    }
  | {
      status: "ready";
      data: T;
      source: CachedResult<T>["source"];
      error: null;
    }
  | {
      status: "error";
      data: null;
      source: null;
      error: Error;
    };

function createLoadingState<T>(): AsyncDataState<T> {
  return {
    status: "loading",
    data: null,
    source: null,
    error: null
  };
}

export function useCountryIndex() {
  const [state, setState] = useState<AsyncDataState<CountrySummary[]>>(createLoadingState);

  useEffect(() => {
    let isCancelled = false;

    setState(createLoadingState());

    void getCountries()
      .then((result) => {
        if (isCancelled) {
          return;
        }

        setState({
          status: "ready",
          data: result.data,
          source: result.source,
          error: null
        });
      })
      .catch((error: Error) => {
        if (isCancelled) {
          return;
        }

        setState({
          status: "error",
          data: null,
          source: null,
          error
        });
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return state;
}

export function useCountryBrief(countryCode: string) {
  const [state, setState] = useState<AsyncDataState<CountryBrief>>(createLoadingState);

  useEffect(() => {
    let isCancelled = false;

    setState(createLoadingState());

    void getCountryByCode(countryCode)
      .then((result) => {
        if (isCancelled) {
          return;
        }

        setState({
          status: "ready",
          data: result.data,
          source: result.source,
          error: null
        });
      })
      .catch((error: Error) => {
        if (isCancelled) {
          return;
        }

        setState({
          status: "error",
          data: null,
          source: null,
          error
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [countryCode]);

  return state;
}
