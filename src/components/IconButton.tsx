import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  asChild?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, asChild, active: _active, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { type: "button" as const })}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-md text-muted-foreground",
          "transition-all duration-200 ease-out",
          "hover:bg-muted hover:text-foreground",
          "active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "touch-manipulation",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
IconButton.displayName = "IconButton";
