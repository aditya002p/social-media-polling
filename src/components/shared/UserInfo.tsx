import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { useAuth } from "@/hooks/useAuth";

interface UserInfoProps {
  userId: string;
  showBadges?: boolean;
  size?: "sm" | "md" | "lg";
  linkToProfile?: boolean;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userId,
  showBadges = true,
  size = "md",
  linkToProfile = true,
}) => {
  const { getUserInfo } = useAuth();
  const user = getUserInfo(userId);

  if (!user) {
    return <div className="animate-pulse h-12 bg-gray-200 rounded-md"></div>;
  }

  const UserComponent = () => (
    <div className="flex items-center space-x-3">
      <Avatar
        src={user.avatarUrl}
        alt={user.displayName}
        size={size}
        status={user.online ? "online" : "offline"}
      />
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {user.displayName}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          @{user.username}
        </div>
      </div>
      {showBadges && user.badges && user.badges.length > 0 && (
        <div className="flex space-x-1">
          {user.badges.map((badge) => (
            <Badge
              key={badge.id}
              variant={badge.type}
              title={badge.description}
            >
              {badge.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  if (linkToProfile) {
    return (
      <Link href={`/profile/${user.username}`}>
        <a className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md p-1 transition-colors">
          <UserComponent />
        </a>
      </Link>
    );
  }

  return <UserComponent />;
};
