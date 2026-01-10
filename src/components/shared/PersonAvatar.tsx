import avatarMale from "@/assets/avatar-male.png";
import avatarFemale from "@/assets/avatar-female.png";

interface PersonAvatarProps {
  gender: "male" | "female";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PersonAvatar = ({ gender, size = "md", className = "" }: PersonAvatarProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const avatar = gender === "male" ? avatarMale : avatarFemale;

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden`}>
      <img 
        src={avatar} 
        alt={gender === "male" ? "Avatar Laki-laki" : "Avatar Perempuan"}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
