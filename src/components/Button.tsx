import { forwardRef, ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Primary UI component for user interaction
 */
export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "secondary" | "tertiary";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, disabled = false, variant = "primary", ...rest }, ref) => {
    return (
      <button
        disabled={disabled}
        className={twMerge(
          "flex items-center justify-center   rounded-lg px-4  py-2 text-base transition duration-300 ",
          className,
          disabled && "opacity-70 hover:bg-onyx-600",
          variant === "primary" && "bg-onyx-600 text-zinc-50 hover:bg-onyx-500",
          variant === "secondary" && "bg-red-500 text-black",
          variant === "tertiary" && "bg-orange-500 text-green-400"
        )}
        ref={ref}
        {...rest}
      />
    );
  }
);
export { Button };

//Serve para aparecer em alguns lugares o nome do componente do lugar de button
//Como por exemplo no react-dev-tools
Button.displayName = "Button";
