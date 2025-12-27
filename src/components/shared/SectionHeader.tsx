import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({ 
  title, 
  subtitle, 
  className,
  align = "center" 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "mb-12",
      align === "center" && "text-center",
      className
    )}>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className={cn(
          "section-subtitle",
          align === "left" && "mx-0"
        )}>
          {subtitle}
        </p>
      )}
      <div className="islamic-divider max-w-xs mx-auto">
        <span className="text-secondary">✦</span>
      </div>
    </div>
  );
}
