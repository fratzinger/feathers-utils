import type { Path } from "../../typesInternal";

export type Handle =
  | "target"
  | "source"
  | "combine"
  | "intersect"
  | "intersectOrFull";

export type ActionOnEmptyIntersect = (
  target: unknown,
  source: unknown,
  prependKey: Path,
) => void;

export interface MergeQueryOptions {
  defaultHandle: Handle;
  actionOnEmptyIntersect: ActionOnEmptyIntersect;
  useLogicalConjunction: boolean;
  handle?: {
    [key: string]: Handle;
  };
}
