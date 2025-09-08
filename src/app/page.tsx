import { prisma } from '@/lib/prisma';
import { AddProductForm } from './products/AddProductForm';
import { ProductItem } from './products/ProductItem';

export default async function ProductsPage() {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

    return (
        <div className="container space-y-6">
            <h1 className="text-2xl font-semibold">Products</h1>
            <AddProductForm />
            <ul className="space-y-0">
                {products.map((p) => <ProductItem key={p.id} p={p} />)}
                {products.length === 0 && <li className="text-slate-500">Поки порожньо</li>}
            </ul>
        </div>
    );
}
