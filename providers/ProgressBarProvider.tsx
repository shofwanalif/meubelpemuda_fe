"use client";

import React from "react";
import { ProgressProvider } from "@bprogress/next/app";

const primary_color = "#2563eb";

type ProgressBarProviderProps = {
  children: React.ReactNode;
};

export function ProgressBarProvider({ children }: ProgressBarProviderProps) {
  return (
    <ProgressProvider
      height="2px"
      color={primary_color}
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
