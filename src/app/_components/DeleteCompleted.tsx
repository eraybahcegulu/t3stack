"use client";

import { api } from "app/trpc/react";
import toast from "react-hot-toast";

interface Res {
    message?: string;
    error?: string;
}

export function DeleteCompleted() {
    const ctx = api.useContext();

    const deleteCompleted = api.todo.deleteCompleted.useMutation({
        onSuccess: (res: Res) => {
            void ctx.todo.getAll.fetch();
            if (res.error) {
                toast.error(res.error)
            } else if (res.message) {
                toast.success(res.message)
            }
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return (
        <span className="border border-w p-2 text-sm hover:scale-125 transition-all cursor-pointer"
            onClick={() => {
                deleteCompleted.mutate();
            }}
        > DELETE COMPLETED
        </span>

    );
}