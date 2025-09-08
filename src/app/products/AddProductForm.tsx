'use client';

import { useActionState } from 'react';
import { createProduct } from './actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const initial = { ok: false, message: '' };

export function AddProductForm() {
    const [state, formAction, pending] = useActionState(createProduct, initial);

    return (
        <form action={formAction} className="grid gap-4 md:grid-cols-[160px_1fr_auto] items-end">
            <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" placeholder="SKU-001" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Назва</Label>
                <Input id="name" name="name" placeholder="Біла футболка" />
            </div>

            <Button type="submit" disabled={pending} aria-busy={pending} size="lg" className="shadow-sm">
                {pending ? 'Додаю…' : 'Додати'}
            </Button>

            {!!state.message && (
                <p className={`md:col-span-3 text-sm ${state.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}
