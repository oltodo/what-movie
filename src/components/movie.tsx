import data from "@/assets/data.movies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { isSimilar } from "@/lib/utils";

import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  movie: (typeof data)[number];
  found: boolean;
  onSuccess: (number: number) => void;
}

export function Movie({ movie, found, onSuccess }: Props) {
  const [error, setError] = useState(false);

  return (
    <form
      className="group/movie flex items-center gap-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (found) {
          return;
        }

        const formData = new FormData(event.currentTarget);
        const value = formData.get("value");
        if (isSimilar(String(value), movie.titles)) {
          onSuccess(movie.number);
          toast.success("Correct! Well done.");
        } else {
          setError(true);
          toast.error("Incorrect! Try again.");
        }
      }}
    >
      <Tooltip delay={3000} disabled={found}>
        <TooltipTrigger>
          <div
            className={clsx(
              "outline size-8 flex rounded-full items-center justify-center text-xs shrink-0",
              found
                ? "outline-green-500 text-green-500"
                : clsx(
                    "outline-muted-foreground/60 text-muted-foreground/60",
                    "hover:outline-muted-foreground hover:text-muted-foreground",
                    "group-has-focus-within/movie:outline-muted-foreground group-has-focus-within/movie:text-muted-foreground"
                  )
            )}
          >
            {movie.number}
          </div>
        </TooltipTrigger>
        <TooltipContent>Année : {movie.year}</TooltipContent>
      </Tooltip>
      {found ? (
        <Input
          key="found"
          value={`${movie.titles.join(" / ")} (${movie.year})`}
          className="pointer-events-none"
        />
      ) : (
        <Input
          key="not-found"
          name="value"
          autoComplete="off"
          aria-invalid={error}
          onChange={() => {
            setError(false);
          }}
        />
      )}
      <Button variant="outline" disabled={found}>
        <Check />
      </Button>
    </form>
  );
}
