import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

export const SubmitButton = ({ 
  isLoading, 
  className, 
  children 
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};