import React, { ReactNode } from "react";
import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  imageSrc?: string;
  action?: ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  imageSrc,
  action,
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "p-4" : "p-8"
      } bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}
    >
      {icon && <div className="text-gray-400 mb-4">{icon}</div>}

      {imageSrc && (
        <div className={`${compact ? "mb-3" : "mb-6"}`}>
          <Image
            src={imageSrc}
            alt="Empty state illustration"
            width={compact ? 120 : 200}
            height={compact ? 120 : 200}
          />
        </div>
      )}

      <h3
        className={`font-medium text-gray-900 dark:text-white ${
          compact ? "text-lg" : "text-xl"
        }`}
      >
        {title}
      </h3>

      {description && (
        <p
          className={`mt-2 text-gray-500 dark:text-gray-400 ${
            compact ? "text-sm" : "text-base"
          }`}
        >
          {description}
        </p>
      )}

      {action && <div className={`mt-${compact ? "3" : "6"}`}>{action}</div>}
    </div>
  );
};
