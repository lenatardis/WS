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
        return { ok: false, message: parsed.error.issues[0]?.message ?? 'Помилка' };
    }

    try {
        await prisma.product.create({ data: parsed.data });
    } catch (e: any) {
        if (e?.code === 'P2002') return { ok: false, message: 'Такий SKU вже існує' };
        return { ok: false, message: 'Не вдалось створити продукт' };
    }

    revalidatePath('/products');
    return { ok: true, message: 'Створено' };
}

const UpdateProduct = z.object({
    id: z.coerce.number().int().positive(),
    sku: z.string().trim().min(1, 'Вкажи SKU'),
    name: z.string().trim().min(1, 'Вкажи назву'),
});

export async function updateProduct(_: any, formData: FormData) {
    const parsed = UpdateProduct.safeParse({
        id: formData.get('id'),
        sku: formData.get('sku'),
        name: formData.get('name'),
    });
    if (!parsed.success) {
        return { ok: false, message: parsed.error.issues[0]?.message ?? 'Помилка' };
    }

    const { id, sku, name } = parsed.data;

    try {
        await prisma.product.update({
            where: { id },
            data: { sku, name },
        });
    } catch (e: any) {
        if (e?.code === 'P2002') return { ok: false, message: 'SKU має бути унікальним' };
        return { ok: false, message: 'Не вдалось оновити' };
    }

    revalidatePath('/products');
    return { ok: true, message: 'Збережено' };
}

export async function deleteProduct(id: number) {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/products');
}
