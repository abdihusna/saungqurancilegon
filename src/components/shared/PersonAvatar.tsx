import { User } from "lucide-react";

interface PersonAvatarProps {
  gender: "male" | "female";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PersonAvatar = ({ gender, size = "md", className = "" }: PersonAvatarProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-full h-full",
  };

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 80,
  };

  if (gender === "male") {
    // Laki-laki dengan kopiah
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center relative overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle */}
          <circle cx="50" cy="50" r="48" fill="hsl(var(--primary) / 0.1)" />
          
          {/* Kopiah (Islamic cap) */}
          <ellipse cx="50" cy="28" rx="22" ry="8" fill="hsl(var(--primary))" />
          <path d="M28 28 Q28 15 50 12 Q72 15 72 28" fill="hsl(var(--primary))" />
          <ellipse cx="50" cy="28" rx="18" ry="5" fill="hsl(var(--primary) / 0.8)" />
          
          {/* Face */}
          <circle cx="50" cy="45" r="18" fill="#D4A574" />
          
          {/* Eyes */}
          <circle cx="44" cy="43" r="2" fill="hsl(var(--foreground))" />
          <circle cx="56" cy="43" r="2" fill="hsl(var(--foreground))" />
          
          {/* Smile */}
          <path d="M45 50 Q50 54 55 50" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          
          {/* Beard */}
          <path d="M35 52 Q35 70 50 72 Q65 70 65 52" fill="#4A3728" opacity="0.6" />
          
          {/* Body/Shoulders with Islamic clothing */}
          <path d="M25 95 Q25 75 50 70 Q75 75 75 95" fill="hsl(var(--primary))" />
          <path d="M40 72 L50 80 L60 72" fill="white" opacity="0.9" />
        </svg>
      </div>
    );
  }

  // Perempuan dengan jilbab
  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-secondary/20 to-secondary/40 rounded-full flex items-center justify-center relative overflow-hidden`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="hsl(var(--secondary) / 0.1)" />
        
        {/* Hijab outer */}
        <path d="M20 45 Q15 25 50 15 Q85 25 80 45 Q82 75 50 85 Q18 75 20 45" fill="hsl(var(--primary))" />
        
        {/* Hijab inner frame around face */}
        <ellipse cx="50" cy="42" rx="18" ry="20" fill="hsl(var(--primary) / 0.85)" />
        
        {/* Face */}
        <ellipse cx="50" cy="42" rx="14" ry="16" fill="#E8C4A0" />
        
        {/* Eyes */}
        <circle cx="45" cy="40" r="2" fill="hsl(var(--foreground))" />
        <circle cx="55" cy="40" r="2" fill="hsl(var(--foreground))" />
        
        {/* Eyebrows */}
        <path d="M42 36 Q45 35 48 36" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" />
        <path d="M52 36 Q55 35 58 36" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" />
        
        {/* Smile */}
        <path d="M46 48 Q50 51 54 48" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* Hijab drape */}
        <path d="M20 50 Q18 80 35 95" fill="hsl(var(--primary))" />
        <path d="M80 50 Q82 80 65 95" fill="hsl(var(--primary))" />
        
        {/* Body */}
        <path d="M30 95 Q35 80 50 78 Q65 80 70 95" fill="hsl(var(--primary) / 0.9)" />
      </svg>
    </div>
  );
};
