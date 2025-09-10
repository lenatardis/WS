import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AddProductForm } from './products/AddProductForm';
import { ProductItem } from './products/ProductItem';
import { SearchControls } from './products/SearchControl';

type Q = Record<string, string | string[] | undefined>;
const PAGE_SIZE = 10;

const SearchSchema = z.object({
    q: z.string().trim().max(100).optional(),
    sort: z.enum(['createdAt', 'name', 'sku']).default('createdAt'),
    dir: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().min(1).default(1),
});

export default async function Page({
                                       // у Next 15 searchParams — Promise
                                       searchParams,
                                   }: {
    searchParams: Promise<Q>;
}) {
    // ✅ чекаємо, потім валідимо
    const sp = SearchSchema.parse(await searchParams);
    const q = sp.q ?? '';
    const { sort, dir, page } = sp;

    const where = q
        ? {
            OR: [
                { sku: { contains: q, mode: 'insensitive' as const } },
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
        return `/?${s.toString()}`; // 🔸 як і просила — без змін п.4
    };

    return (
        <div className="container space-y-6">
            <h1 className="text-2xl font-semibold">Products</h1>

            <SearchControls />
            <AddProductForm />

            <ul className="divide-y">
                {products.map((p) => (
                    <ProductItem key={p.id} p={p} />
                ))}
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
                        tabIndex={page <= 1 ? -1 : 0} // ✅ UX
                        className="h-9 px-3 rounded-md border bg-background data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 flex items-center"
                    >
                        <span>Prev</span>
                    </Link>
                    <Link
                        href={page < totalPages ? qs(page + 1) : '#'}
                        aria-disabled={page >= totalPages}
                        data-disabled={page >= totalPages}
                        tabIndex={page >= totalPages ? -1 : 0} // ✅ UX
                        className="h-9 px-3 rounded-md border bg-background data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 flex items-center"
                    >
                        <span>Next</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
