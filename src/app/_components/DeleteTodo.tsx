"use client";

import { api } from "app/trpc/react";
import { DeleteOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

interface Res {
    message?: string;
    error?: string;
}

export function DeleteTodo({ todoId }: { todoId: number }) {
    const ctx = api.useContext();

    const deleteTodo = api.todo.delete.useMutation({
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
        <div className='p-4 h-full'>
            <span className="text-red-600 ">
                <DeleteOutlined
                    className="xl:text-4xl hover:scale-125  transition-all cursor-pointer"
                    onClick={() => {
                        deleteTodo.mutate({ todoId });
                    }} />
            </span>
        </div>
    );
}