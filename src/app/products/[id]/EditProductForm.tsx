'use client';

import { useActionState, useEffect } from 'react';
import { updateProduct, deleteProduct } from '../actions';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const initial = { ok: false, message: '' };

export function EditProductForm({ id, sku, name }: { id: number; sku: string; name: string }) {
    const [state, formAction, pending] = useActionState(updateProduct, initial);

    useEffect(() => {
        if (!state.message) return;
        state.ok ? toast.success(state.message) : toast.error(state.message);
    }, [state]);

    return (
        <div className="space-y-4">
            <form action={formAction} className="grid gap-4 max-w-xl">
                <input type="hidden" name="id" value={id} />

                <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" name="sku" defaultValue={sku} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Назва</Label>
                    <Input id="name" name="name" defaultValue={name} />
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={pending} aria-busy={pending}>
                        {pending ? 'Зберігаю…' : 'Зберегти'}
                    </Button>

                    <Button
                        variant="destructive"
                        formAction={deleteProduct.bind(null, id)}
                        onClick={(e) => {
                            if (!confirm('Видалити продукт?')) e.preventDefault();
                        }}
                    >
                        Видалити
                    </Button>
                </div>

                {!!state.message && (
                    <p className={`text-sm ${state.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </div>
    );
}
