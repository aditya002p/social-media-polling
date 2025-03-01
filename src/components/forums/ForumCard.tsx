import React from "react";
import Link from "next/link";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Users, MessageSquare, ArrowRight } from "lucide-react";

interface ForumCardProps {
  id: string;
  title: string;
  description: string;
  categories: string[];
  memberCount: number;
  threadCount: number;
  lastActive: string;
}

export const ForumCard: React.FC<ForumCardProps> = ({
  id,
  title,
  description,
  categories,
  memberCount,
  threadCount,
  lastActive,
}) => {
  const formattedLastActive = new Date(lastActive).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/forums/${id}`}>
            <h3 className="text-xl font-bold hover:text-blue-600">{title}</h3>
          </Link>
        </div>

        <p className="text-gray-600 mb-4">{description}</p>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="text-sm">
                {category}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>{memberCount} members</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              <span>{threadCount} threads</span>
            </div>
          </div>
          <div>
            <span>Last active: {formattedLastActive}</span>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href={`/forums/${id}`}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View Forum <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ForumCard;
