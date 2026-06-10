import { createElement, type HTMLAttributes, type ReactNode } from "react";

type BoxProps = HTMLAttributes<HTMLElement> & { children?: ReactNode };

/** Layout primitive — avoids invalid tag names in source. */
export function Box({ children, ...props }: BoxProps) {
  return createElement("div", props, children);
}
