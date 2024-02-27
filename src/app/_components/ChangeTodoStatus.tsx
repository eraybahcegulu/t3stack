"use client";

import { api } from "app/trpc/react";
import { LoadingOutlined } from "@ant-design/icons";
import FilterTiltShiftIcon from '@mui/icons-material/FilterTiltShift';

export function ChangeTodoStatus({ todoId, inProgress, isFocused }: { todoId: number, inProgress: boolean, isFocused: boolean }) {
    const ctx = api.useContext();

    const changeStatus = api.todo.changeStatus.useMutation({
        onSuccess: ()=>{
            void ctx.todo.getAll.fetch();
        }
    });

    return (
        <div className='p-4 h-full'>
            {
                inProgress
                &&
                <span className="text-orange-500 ">
                    <LoadingOutlined
                    className={`xl:text-4xl transition-all cursor-pointer `}
                        onClick={() => {
                            changeStatus.mutate({ todoId });
                        }} />
                </span>

            }

            {
                isFocused
                &&
                <span className="text-red-500">
                    <FilterTiltShiftIcon
                        className=" xl:text-4xl hover:scale-125 transition-all cursor-pointer"
                        onClick={() => {
                            changeStatus.mutate({ todoId });
                        }} />
                </span>
            }

        </div>
    );
}