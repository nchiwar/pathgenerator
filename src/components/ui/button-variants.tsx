import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground shadow-primary hover:shadow-glow hover:scale-105",
        hero: "bg-gradient-hero text-primary-foreground shadow-glow text-base px-8 py-6 rounded-xl hover:scale-105 animate-pulse-glow",
        secondary: "bg-secondary text-secondary-foreground shadow-card hover:shadow-primary hover:scale-105",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-primary",
        ghost: "hover:bg-muted hover:text-foreground",
        success: "bg-success text-success-foreground shadow-card hover:shadow-primary hover:scale-105",
        destructive: "bg-destructive text-destructive-foreground shadow-card hover:shadow-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
