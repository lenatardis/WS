// src/app/products/AddProductForm.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createProduct } from './actions';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const initial = { ok: false, message: '' };

export function AddProductForm() {
    const [state, formAction, pending] = useActionState(createProduct, initial);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!state.message) return;
        state.ok ? toast.success(state.message) : toast.error(state.message);
        if (state.ok) formRef.current?.reset();
    }, [state]);

    return (
        <form
            ref={formRef}
            action={formAction}
            className="grid gap-4 md:grid-cols-[160px_1fr_auto] items-end"
        >
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
