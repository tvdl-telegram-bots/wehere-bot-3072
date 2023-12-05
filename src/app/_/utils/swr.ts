import useSWRInfinite from "swr/infinite";

import { IParse } from "@/types";
import { last } from "@/utils/array";

type BaseQueryForHttpGet = Record<
  string,
  string | number | boolean | null | undefined
>;

export type ResourceKey<P = void> = {
  path: string;
  params: P;
};

export function httpGet<R>(schema: IParse<R>) {
  return async function ({
    path,
    params,
  }: ResourceKey<BaseQueryForHttpGet>): Promise<R> {
    const search = new URLSearchParams();
    for (const k in params) {
      const v = params[k];
      if (v == null) continue;
      search.append(k, `${v}`);
    }
    const url = path + "?" + search.toString();

    const response = await fetch(url, {
      method: "GET",
      headers: { Accepts: "application/json" },
    });
    const data = await response.json();
    return schema.parse(data);
  };
}

type PageData<P, R> = {
  result: R;
  params: P;
};

export function useResourceInfinite<P, R>({
  path,
  initialParams,
  getNextParams,
  fetcher,
  swrConfig,
}: {
  path: string;
  initialParams: P | null | undefined;
  getNextParams: (previousPageData: PageData<P, R>) => P | null | undefined;
  fetcher: (resourceKey: ResourceKey<P>) => Promise<R>;
  swrConfig?: {
    refreshInterval?: number;
  };
}) {
  const keyLoader = (
    index: number,
    previousPageData: PageData<P, R> | null | undefined
  ): ResourceKey<P> | null | undefined => {
    if (!initialParams) return undefined;
    if (!index) return { path, params: initialParams };
    if (!previousPageData) return undefined;
    const nextParams = getNextParams(previousPageData);
    if (!nextParams) return undefined;
    return { path, params: nextParams };
  };

  const swr = useSWRInfinite(
    keyLoader,
    async (resourceKey: ResourceKey<P>): Promise<PageData<P, R>> => {
      const result = await fetcher(resourceKey);
      return { result, params: resourceKey.params };
    },
    swrConfig
  );

  const lastPageData = last(swr.data);

  const isEnded =
    !swr.isLoading &&
    swr.size > 0 &&
    lastPageData != null &&
    !getNextParams(lastPageData);

  const isLoading = swr.isLoading || (!!swr.data && swr.size > swr.data.length);

  const loadMore =
    !swr.isLoading && !isEnded ? () => swr.setSize((s) => s + 1) : undefined;

  return {
    data: swr.data?.map((d) => d.result),
    error: swr.error,
    isEnded,
    isLoading,
    loadMore,
    swr,
  };
}
