// src/app/loading.tsx
export default function Loading() {
    return (
        <div className="container space-y-6">
            <div className="h-8 w-48 rounded bg-muted animate-pulse" />

            <div className="grid gap-4 md:grid-cols-[160px_1fr_auto] items-end">
                <div className="grid gap-2">
                    <div className="h-4 w-12 rounded bg-muted animate-pulse" />
                    <div className="h-9 rounded bg-muted animate-pulse" />
                </div>
                <div className="grid gap-2">
                    <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                    <div className="h-9 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-9 w-28 rounded bg-muted animate-pulse" />
            </div>

            <ul className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i} className="h-10 rounded bg-muted animate-pulse" />
                ))}
            </ul>
        </div>
    );
}
