import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white";
  label?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  label,
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colorMap = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    white: "text-white",
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center`}>
      <div
        className={`${sizeMap[size]} ${colorMap[color]} animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      {label && (
        <p
          className={`mt-2 text-${
            color === "white" ? "white" : "gray-700 dark:text-gray-300"
          }`}
        >
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 dark:bg-black/50 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
