"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Signal, Watch } from "@/lib/signal";

const vis = new Signal(false);

function toggleVisibility() {
  vis.update((value) => {
    vis.value = !value;
  });
}

export default function ShowPasswordInput() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Watch signal={vis}>
          {() => <>
            <Input
              className="pe-9"
              id={id}
              placeholder="Password"
              type={vis.value ? "text" : "password"}
            />
            <button
              aria-controls="password"
              aria-label={vis.value ? "Hide password" : "Show password"}
              aria-pressed={vis.value}
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              onClick={toggleVisibility}
              type="button"
            >
              {vis.value ? (
                <EyeOffIcon aria-hidden="true" size={16} />
              ) : (
                <EyeIcon aria-hidden="true" size={16} />
              )}
            </button>
          </>}
        </Watch>
      </div>
    </div>
  );
}
