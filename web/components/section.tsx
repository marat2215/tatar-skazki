import { cn } from "@/lib/utils";

export function Section({ id, className, children, labelledBy }: { id?: string; className?: string; children: React.ReactNode; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("mx-auto w-full max-w-content px-4 py-12 sm:px-6 md:py-16 lg:px-8", className)}>
      {children}
    </section>
  );
}
