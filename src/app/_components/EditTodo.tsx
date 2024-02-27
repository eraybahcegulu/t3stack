"use client";


import { useState } from "react";

import { api } from "app/trpc/react";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface Res {
    message?: string;
    error?: string;
}

export function EditTodo({ todoId, existName, setEditingTodoId }: { todoId: number | null, existName: string, setEditingTodoId: (newTodoId: number | null) => void }) {
    const ctx = api.useContext();
    const [name, setName] = useState(existName);

    const editTodo = api.todo.edit.useMutation({
        onSuccess: (res: Res) => {
            setEditingTodoId(null);
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
        <div >
            {
                todoId
                &&
                <div className="flex flex-col justify-center items-center gap-3">
                    <input
                        maxLength={200}
                        type="text"
                        defaultValue={existName}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-full md:rounded-none px-4 py-2 text-black border "

                    />

                    <div className="flex flex-row  justify-center items-center gap-3 p-2 xl:text-4xl">
                        {
                            editTodo.isLoading
                                ?
                                <span> Editing <LoadingOutlined /></span>
                                :
                                <>
                                    <span className="text-blue-500">
                                        <FontAwesomeIcon
                                            onClick={() => {
                                                editTodo.mutate({ todoId, name });
                                            }}
                                            style={{
                                                opacity: editTodo.isLoading || name.length === 0 || name === existName ? 0.3 : 1,
                                                pointerEvents: editTodo.isLoading || name.length === 0 || name === existName ? 'none' : 'auto'
                                            }}
                                            className={`  hover:scale-125 opacity-100 transition-all cursor-pointer
                                `} icon={faCheck} shake
                                        />
                                    </span>

                                    <span className="text-red-600 ">
                                        <CloseOutlined
                                            onClick={() => {
                                                setEditingTodoId(null);
                                            }}
                                            className={` hover:scale-125 opacity-100 transition-all cursor-pointer
                                    `}
                                        />
                                    </span>
                                </>
                        }
                    </div>

                </div>

            }


        </div>

    );
}