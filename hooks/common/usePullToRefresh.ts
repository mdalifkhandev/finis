import { useCallback, useState } from "react";

export function usePullToRefresh(onRefreshAction?: () => Promise<void> | void) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (onRefreshAction) {
        await onRefreshAction();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshAction]);

  return { refreshing, onRefresh };
}
