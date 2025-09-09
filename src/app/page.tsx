import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AddProductForm } from './products/AddProductForm';
import { ProductItem } from './products/ProductItem';
import { SearchControls } from './products/SearchControl';

type Q = Record<string, string | string[] | undefined>;
const PAGE_SIZE = 10;
const SORT_FIELDS = new Set(['createdAt', 'sku', 'name'] as const);
const DIRS = new Set(['asc', 'desc'] as const);

export default async function Page({
                                       // ⬇️ у Next 15 searchParams — Promise
                                       searchParams,
                                   }: {
    searchParams: Promise<Q>;
}) {
    // ⬇️ спочатку чекаємо
    const sp = await searchParams;

    const q = typeof sp.q === 'string' ? sp.q : '';

    const sortRaw = typeof sp.sort === 'string' ? sp.sort : 'createdAt';
    const sort = SORT_FIELDS.has(sortRaw as any)
        ? (sortRaw as 'createdAt' | 'sku' | 'name')
        : 'createdAt';

    const dirRaw = typeof sp.dir === 'string' ? sp.dir : 'desc';
    const dir = DIRS.has(dirRaw as any) ? (dirRaw as 'asc' | 'desc') : 'desc';

    const pageStr = typeof sp.page === 'string' ? sp.page : '1';
    const page = Math.max(1, Number(pageStr));

    const where = q
        ? {
            OR: [
                { sku:  { contains: q, mode: 'insensitive' as const } },
                { name: { contains: q, mode: 'insensitive' as const } },
            ],
        }
        : {};

    const [total, products] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            orderBy: { [sort]: dir },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const qs = (p: number) => {
        const s = new URLSearchParams();
        if (q) s.set('q', q);
        if (sort !== 'createdAt') s.set('sort', sort);
        if (dir !== 'desc') s.set('dir', dir);
        s.set('page', String(p));
        return `/?${s.toString()}`;
    };

    return (
        <div className="container space-y-6">
            <h1 className="text-2xl font-semibold">Products</h1>

            <SearchControls />

            <AddProductForm />

            <ul className="divide-y">
                {products.map((p) => <ProductItem key={p.id} p={p} />)}
                {products.length === 0 && (
                    <li className="py-4 text-slate-500">Нічого не знайдено</li>
                )}
            </ul>

            <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-muted-foreground">
          Page {page} / {totalPages} · {total} items
        </span>
                <div className="flex gap-2">
                    <Link
                        href={page > 1 ? qs(page - 1) : '#'}
                        aria-disabled={page <= 1}
                        data-disabled={page <= 1}
                        className="h-9 px-3 rounded-md border bg-background data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                    >
                        ← Prev
                    </Link>
                    <Link
                        href={page < totalPages ? qs(page + 1) : '#'}
                        aria-disabled={page >= totalPages}
                        data-disabled={page >= totalPages}
                        className="h-9 px-3 rounded-md border bg-background data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                    >
                        Next →
                    </Link>
                </div>
            </div>
        </div>
    );
}
