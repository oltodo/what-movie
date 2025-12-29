import data from "@/assets/data.movies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

import { useLocalStorage } from "@uidotdev/usehooks";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Movie({
  movie,
  found,
  onSuccess,
}: {
  movie: (typeof data)[number];
  found: boolean;
  onSuccess: (number: number) => void;
}) {
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
        if (value === movie.name) {
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
        <TooltipContent>{movie.year}</TooltipContent>
      </Tooltip>
      {found ? (
        <Input
          key="found"
          value={`${movie.name} (${movie.year})`}
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

export function App() {
  const [found, save] = useLocalStorage<number[]>("movies", []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 gap-x-8 p-8">
      {data.map((movie) => (
        <Movie
          movie={movie}
          found={found.includes(movie.number)}
          key={movie.number}
          onSuccess={(number) => {
            save([...found, number]);
          }}
        />
      ))}
    </div>
  );
}

export default App;
