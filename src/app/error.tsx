
'use client';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="container space-y-4">
            <h1 className="text-xl font-semibold">Щось пішло не так</h1>
            <p className="text-sm text-muted-foreground">
                {error.message || 'Невідома помилка'}
            </p>
            <button
                onClick={reset}
                className="inline-flex h-9 items-center rounded-md border bg-background px-3"
            >
                Спробувати ще раз
            </button>
        </div>
    );
}
