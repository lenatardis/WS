export default function NotFound() {
    return (
        <div className="container space-y-2">
            <h1 className="text-xl font-semibold">Продукт не знайдено</h1>
            <p className="text-sm text-muted-foreground">Можливо, його було видалено або ID некоректний.</p>
            <a href="/" className="inline-flex h-9 items-center rounded-md border bg-background px-3">← На головну</a>
        </div>
    );
}
