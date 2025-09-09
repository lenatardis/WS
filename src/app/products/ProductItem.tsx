'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateProduct, deleteProduct } from './actions';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type P = { id: number; sku: string; name: string };
const initial = { ok: false, message: '' };

export function ProductItem({ p }: { p: P }) {
    const [editing, setEditing] = useState(false);
    const [state, formAction, pending] = useActionState(updateProduct, initial);

    useEffect(() => {
        if (!state.message) return;
        state.ok ? (toast.success(state.message), setEditing(false)) : toast.error(state.message);
    }, [state]);

    return (
        <li className="flex items-center justify-between gap-3 py-2">
            {editing ? (
                <form action={formAction} className="flex items-end gap-3 flex-1">
                    <input type="hidden" name="id" value={p.id} />
                    <div className="grid gap-1">
                        <Label htmlFor={`sku-${p.id}`}>SKU</Label>
                        <Input id={`sku-${p.id}`} name="sku" defaultValue={p.sku} className="md:w-40" />
                    </div>
                    <div className="grid gap-1 flex-1">
                        <Label htmlFor={`name-${p.id}`}>Назва</Label>
                        <Input id={`name-${p.id}`} name="name" defaultValue={p.name} />
                    </div>
                    <Button type="submit" disabled={pending} aria-busy={pending}>Зберегти</Button>
                    <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Скасувати</Button>
                </form>
            ) : (
                <>
                    <div className="flex-1"><span className="font-mono">{p.sku}</span> — {p.name}</div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEditing(true)}>Редагувати</Button>
                        <form action={deleteProduct.bind(null, p.id)} onSubmit={(e) => { if (!confirm('Видалити продукт?')) e.preventDefault(); }}>
                            <Button variant="destructive">Видалити</Button>
                        </form>
                    </div>
                </>
            )}
        </li>
    );
}
