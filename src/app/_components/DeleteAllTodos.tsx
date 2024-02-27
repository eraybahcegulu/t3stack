"use client";

import { api } from "app/trpc/react";
import toast from "react-hot-toast";

interface Res {
    message?: string;
    error?: string;
}

export function DeleteAllTodos() {
    const ctx = api.useContext();

    const deleteAll = api.todo.deleteAll.useMutation({
        onSuccess: (res: Res) => {
            void ctx.todo.getAll.fetch();
            if (res.error) {
                toast.error(res.error)
            } else if (res.message) {
                toast.success(res.message)
            }
        },
        onError: (error) => {
            const errorMessage = error.data?.zodError?.fieldErrors.name;
            if (errorMessage?.[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error(error.message);
            }
        }
    });

    return (
        <span className="border border-w p-2 text-sm hover:scale-125 transition-all cursor-pointer"
            onClick={() => {
                deleteAll.mutate();
            }}
        >DELETE ALL
        </span>

    );
}