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

  if (gender === "male") {
    // Laki-laki dengan kopiah (silhouette sederhana)
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-2">
          {/* Kopiah */}
          <ellipse cx="50" cy="28" rx="20" ry="7" fill="hsl(var(--primary))" />
          <path d="M30 28 Q30 16 50 13 Q70 16 70 28" fill="hsl(var(--primary))" />
          
          {/* Kepala */}
          <circle cx="50" cy="42" r="16" fill="hsl(var(--primary))" />
          
          {/* Badan */}
          <path d="M25 95 Q25 70 50 65 Q75 70 75 95" fill="hsl(var(--primary))" />
        </svg>
      </div>
    );
  }

  // Perempuan dengan jilbab (silhouette sederhana)
  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-secondary/20 to-secondary/40 rounded-full flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full p-2">
        {/* Jilbab */}
        <path d="M22 42 Q18 22 50 14 Q82 22 78 42 Q80 72 50 82 Q20 72 22 42" fill="hsl(var(--primary))" />
        
        {/* Wajah (oval) */}
        <ellipse cx="50" cy="40" rx="13" ry="15" fill="hsl(var(--primary) / 0.7)" />
        
        {/* Badan */}
        <path d="M30 95 Q32 78 50 75 Q68 78 70 95" fill="hsl(var(--primary))" />
      </svg>
    </div>
  );
};
