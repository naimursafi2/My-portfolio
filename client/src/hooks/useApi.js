import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Loads data from the API once on mount. `fallback` keeps the public site
 * looking right even if the backend is unreachable.
 *
 * The fetcher is held in a ref so passing an inline arrow function does not
 * restart the request on every render.
 */
export const useApiData = (fetcher, fallback) => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await fetcherRef.current();
      setData(payload.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};
