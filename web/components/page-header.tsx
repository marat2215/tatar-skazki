"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Bi, TT } from "@/components/bi";
import { S, type Line } from "@/lib/strings";

export function PageHeader({ title, lead }: { title: Line; lead: Line }) {
  return (
    <div className="mx-auto w-full max-w-content px-4 pt-10 sm:px-6 lg:px-8">
      <Link href="/#sections" className="inline-flex items-center gap-1.5 rounded-btn text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        <TT line={S.home} />
      </Link>
      <h1 className="mt-4 text-3xl sm:text-4xl">
        <Bi line={title} subClassName="text-[0.5em]" />
      </h1>
      <Bi line={lead} as="p" className="mt-3 max-w-2xl text-muted-foreground" subClassName="text-xs" />
    </div>
  );
}
