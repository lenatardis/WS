import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { EditProductForm } from './EditProductForm';

export default async function ProductDetails({
                                                 params,
                                             }: {
    params: Promise<{ id: string }>; // ⬅️ у Next 15 це Promise
}) {
    const { id: idStr } = await params;          // ⬅️ чекаємо
    const id = Number(idStr);
    if (!Number.isInteger(id) || id <= 0) notFound();

    const product = await prisma.product.findUnique({
        where: { id },
    });
    if (!product) notFound();

    const created = new Intl.DateTimeFormat('uk-UA', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(product.createdAt);

    return (
        <div className="container space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Product #{product.id}</h1>
                <Link
                    href="/"
                    className="inline-flex h-9 items-center rounded-md border bg-background px-3"
                >
                    ← Back
                </Link>
            </div>

            <div className="text-sm text-muted-foreground">
                Створено: <span className="font-mono">{created}</span>
            </div>

            <EditProductForm id={product.id} sku={product.sku} name={product.name} />
        </div>
    );
}
