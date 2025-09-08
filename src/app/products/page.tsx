import { prisma } from '@/lib/prisma';
import { AddProductForm } from './AddProductForm';

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container space-y-6">
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Products</h1>
                <AddProductForm />
                <ul className="list-disc pl-5 space-y-1">
                    {products.map(p => (
                        <li key={p.id}>
                            <span className="font-mono">{p.sku}</span> — {p.name}
                        </li>
                    ))}
                    {products.length === 0 && <li>Поки порожньо</li>}
                </ul>
            </div>
        </div>

    );
}
