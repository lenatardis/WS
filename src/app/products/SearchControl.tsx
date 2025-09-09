'use client';

import { useTransition, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type Sort = 'createdAt' | 'sku' | 'name';
type Dir = 'asc' | 'desc';

const normalizeSort = (v: string | null): Sort =>
    v === 'sku' || v === 'name' || v === 'createdAt' ? v : 'createdAt';
const normalizeDir = (v: string | null): Dir => (v === 'asc' ? 'asc' : 'desc');

export function SearchControls() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    // ініціалізуємося з URL
    const [q, setQ] = useState<string>(sp.get('q') ?? '');
    const [sort, setSort] = useState<Sort>(normalizeSort(sp.get('sort')));
    const [dir, setDir] = useState<Dir>(normalizeDir(sp.get('dir')));
    const [isPending, startTransition] = useTransition();

    const replaceUrl = (next: Partial<{ q: string; sort: Sort; dir: Dir; page: number }>) => {
        const nextSp = new URLSearchParams(sp.toString());
        if (next.q !== undefined) {
            if (next.q) nextSp.set('q', next.q);
            else nextSp.delete('q');
        }
        if (next.sort) nextSp.set('sort', next.sort);
        if (next.dir) nextSp.set('dir', next.dir);
        // при зміні q/sort/dir — завжди page=1
        nextSp.set('page', String(next.page ?? 1));
        const query = nextSp.toString();
        startTransition(() => {
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        });
    };

    // ✅ дебаунс через use-debounce
    const applyQ = useDebouncedCallback((nextQ: string) => {
        replaceUrl({ q: nextQ, sort, dir, page: 1 });
    }, 300);

    // sync, якщо URL змінився ззовні (back/forward)
    useEffect(() => {
        setQ(sp.get('q') ?? '');
        setSort(normalizeSort(sp.get('sort')));
        setDir(normalizeDir(sp.get('dir')));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sp]);

    const onSortChange = (v: string) => {
        const s = normalizeSort(v);
        setSort(s);
        replaceUrl({ q, sort: s, dir, page: 1 });
    };
    const onDirChange = (v: string) => {
        const d = normalizeDir(v);
        setDir(d);
        replaceUrl({ q, sort, dir: d, page: 1 });
    };

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1">
                <label htmlFor="q" className="text-sm text-muted-foreground">
                    Search
                </label>
                <input
                    id="q"
                    placeholder="sku or name…"
                    value={q}
                    onChange={(e) => {
                        const v = e.target.value;
                        setQ(v);
                        applyQ(v); // ✅ дебаунс навігації
                    }}
                    className="h-9 rounded-md border px-3 bg-background"
                />
            </div>

            <div className="grid gap-1">
                <label htmlFor="sort" className="text-sm text-muted-foreground">
                    Sort by
                </label>
                <select
                    id="sort"
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="h-9 rounded-md border bg-background px-2"
                >
                    <option value="createdAt">Created</option>
                    <option value="sku">SKU</option>
                    <option value="name">Name</option>
                </select>
            </div>

            <div className="grid gap-1">
                <label htmlFor="dir" className="text-sm text-muted-foreground">
                    Direction
                </label>
                <select
                    id="dir"
                    value={dir}
                    onChange={(e) => onDirChange(e.target.value)}
                    className="h-9 rounded-md border bg-background px-2"
                >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                </select>
            </div>

            {isPending && <span className="text-sm text-muted-foreground">Updating…</span>}
        </div>
    );
}
