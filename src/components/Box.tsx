import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Primary UI component for user interaction
 */

export type BoxProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  variant?: "primary" | "secondary" | "tertiary";
};

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, variant = "primary", children, ...rest }, ref) => {
    return (
      <div
        className={twMerge(
          "flex items-center justify-center rounded-lg p-3",
          className,
          variant === "primary" && "bg-onyx-600 text-zinc-50",
          variant === "secondary" && "bg-reseda-green text-zinc-50",
          variant === "tertiary" && "bg-mountbatten-pink-700 text-zinc-50",
        )}
        {...rest}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

Box.displayName = "Box";
