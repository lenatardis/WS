'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const CreateProduct = z.object({
    sku: z.string().trim().min(1, 'Вкажи SKU'),
    name: z.string().trim().min(1, 'Вкажи назву'),
});

export async function createProduct(_: any, formData: FormData) {
    const parsed = CreateProduct.safeParse({
        sku: formData.get('sku'),
        name: formData.get('name'),
    });
    if (!parsed.success) {
        return { ok: false, message: parsed.error.issues[0]?.message ?? 'Помилка валідації' };
    }

    const { sku, name } = parsed.data;

    // унікальний SKU? Prisma кине помилку, зловимо її красиво
    try {
        await prisma.product.create({ data: { sku, name } });
    } catch (e: any) {
        if (e?.code === 'P2002') {
            return { ok: false, message: 'Такий SKU вже існує' };
        }
        return { ok: false, message: 'Не вдалось створити продукт' };
    }

    // оновимо кеш сторінки /products
    revalidatePath('/products');
    return { ok: true, message: 'Створено' };
}
