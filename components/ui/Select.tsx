import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
};

export function Select({ label, options, className, id, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="text-sm font-medium tracking-wide text-charcoal/80"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "w-full appearance-none rounded-2xl border border-linen bg-cream/80 px-4 py-3 text-charcoal transition-all duration-200",
          "focus:border-clay focus:bg-white focus:outline-none focus:ring-2 focus:ring-clay/20",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
