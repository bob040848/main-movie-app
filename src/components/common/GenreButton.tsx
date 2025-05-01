import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GenreButtonProps {
  id: number;
  name: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function GenreButton({
  id,
  name,
  isActive = false,
  className,
  onClick,
}: GenreButtonProps) {
  if (onClick) {
    return (
      <Button
        variant="outline"
        className={cn(
          "justify-start hover:bg-secondary truncate",
          isActive && "bg-secondary/80",
          className
        )}
        onClick={onClick}
      >
        {name}
        <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0" />
      </Button>
    );
  }

  return (
    <Link href={`/genres?id=${id}&name=${encodeURIComponent(name)}`}>
      <Button
        variant="outline"
        className={cn(
          "justify-start hover:bg-secondary w-full truncate",
          isActive && "bg-secondary/80",
          className
        )}
      >
        {name}
        <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0" />
      </Button>
    </Link>
  );
}
