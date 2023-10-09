import type { Path } from "../../typesInternal";
import type { FilterQueryOptions } from "../filterQuery";

export type Handle =
  | "target"
  | "source"
  | "combine"
  | "intersect"
  | "intersectOrFull";
export type FirstLast = "first" | "last";

export type ActionOnEmptyIntersect = (
  target: unknown,
  source: unknown,
  prependKey: Path,
) => void;

export interface MergeQueryOptions<T> extends FilterQueryOptions<T> {
  defaultHandle: Handle;
  actionOnEmptyIntersect: ActionOnEmptyIntersect;
  useLogicalConjunction: boolean;
  handle?: {
    [key: string]: Handle;
  };
}
