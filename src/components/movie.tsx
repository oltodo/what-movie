import data from "@/assets/data.movies";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "lucide-react";
import { isSimilar } from "@/lib/utils";

import clsx from "clsx";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useForm } from "react-hook-form";

interface Props {
  movie: (typeof data)[number];
  found: boolean;
  onSuccess: (number: number) => void;
}

interface FormData {
  value: string;
}

export function Movie({ movie, found, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<FormData>();

  return (
    <form
      className="group/movie flex items-center gap-4"
      onSubmit={handleSubmit(({ value }) => {
        if (isSimilar(value, movie.titles)) {
          onSuccess(movie.number);
          toast.success("Correct! Well done.");
        } else {
          setError("value", { type: "manual" });
          toast.error("Incorrect! Try again.");
        }
      })}
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
        <InputGroup>
          <InputGroupInput
            autoComplete="off"
            aria-invalid={!!errors.value}
            {...register("value", {
              required: true,
            })}
          />
          <InputGroupAddon align="inline-end" className="pr-3">
            {isValid && (
              <InputGroupButton
                variant="default"
                className="rounded-full"
                size="icon-xxs"
              >
                <CheckIcon />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      )}
    </form>
  );
}
