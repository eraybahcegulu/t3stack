"use client";

import { api } from "app/trpc/react";
import { BorderOutlined, CheckSquareOutlined, } from "@ant-design/icons";



export function CompleteTodo({ todoId, isCompleted }: { todoId: number, isCompleted: boolean }) {
    const ctx = api.useContext();

    const complete = api.todo.complete.useMutation({
        onSuccess: () => {
            void ctx.todo.getAll.fetch();
        }
    });

    return (
        <div className='p-4 h-full'>
            {
                !isCompleted
                &&
                <span className="text-black">
                    <BorderOutlined
                        className="xl:text-4xl text-black hover:scale-125 transition-all cursor-pointer"
                        onClick={() => {
                            complete.mutate({ todoId });
                        }} />
                </span>

            }

            {
                isCompleted
                &&
                <span className="text-green-600">
                    <CheckSquareOutlined
                        className=" xl:text-4xl hover:scale-125 transition-all cursor-pointer "
                        onClick={() => {
                            complete.mutate({ todoId });
                        }} />
                </span>
            }

        </div>
    );
}