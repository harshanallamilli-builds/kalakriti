import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium tracking-wide text-charcoal/80"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        rows={4}
        className={cn(
          "w-full resize-none rounded-2xl border border-linen bg-cream/80 px-4 py-3 text-charcoal placeholder:text-warm-gray/60 transition-all duration-200",
          "focus:border-clay focus:bg-white focus:outline-none focus:ring-2 focus:ring-clay/20",
          error && "border-terracotta focus:border-terracotta focus:ring-terracotta/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-terracotta">{error}</p>}
    </div>
  );
}
