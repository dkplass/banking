"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

import { ForwardRefExoticComponent } from "react";

type ProgressProps = ForwardRefExoticComponent<
  ProgressPrimitive.ProgressProps &
    React.RefAttributes<HTMLDivElement> & { indicatorClassName?: string }
>;

const Progress = React.forwardRef<
  React.ElementRef<ProgressProps>,
  React.ComponentPropsWithoutRef<ProgressProps>
>(({ indicatorClassName, className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 bg-primary transition-all",
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
