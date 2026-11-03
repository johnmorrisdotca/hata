import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "hata-flag": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { code?: string; shape?: string; size?: number | string; label?: string; lang?: string; theme?: string; border?: boolean; shadow?: boolean };
    }
  }
}
