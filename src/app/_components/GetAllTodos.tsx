'use client';
import { api } from 'app/trpc/react';
import LoadingSpinner from './LoadingSpinner';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ChangeTodoStatus } from './ChangeTodoStatus';
import { CompleteTodo } from './CompleteTodo';
import { DeleteTodo } from './DeleteTodo';
import { Popover } from 'antd';
import { useState } from 'react';
import { EditTodo } from './EditTodo';

export function GetAllTodos() {
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const { data, isLoading: todosLoading } = api.todo.getAll.useQuery();

    const handleEditing = (id: number) => {
        setEditingTodoId(id);
    }
    return (
        <div className='h-full overflow-y-auto flex flex-col gap-9 pr-4'>
            {
                todosLoading && (
                    <LoadingSpinner />
                )
            }

            {
                !data
                &&
                !todosLoading
                &&
                <div>
                    <span>Something went wrong</span>
                </div>
            }

            {
                data?.length === 0
                &&
                <span className='flex justify-center text-2xl mt-2 text-white'> Todo not found. </span>
            }
            {
                data?.map(
                    (todo) => (
                        <div className='flex flex-row gap-2 justify-center border-b p-10 items-center text-center' key={todo.id}>

                            <div className='flex flex-row justify-center items-center'>
                                <CompleteTodo todoId={todo.id} isCompleted={todo.isCompleted} />

                                {
                                    todo.isCompleted
                                        ?
                                        <div className='p-4 h-full'>

                                            <span className="text-blue-600 ">
                                                <Popover placement="top" content={`Completed Date: ${todo.completedAt ? todo.completedAt.toLocaleString() : 'Not completed'}`}>
                                                    <InfoCircleOutlined
                                                        className={`xl:text-4xl  hover:scale-125 transition-all `} />
                                                </Popover>
                                            </span>
                                        </div>
                                        :

                                        <ChangeTodoStatus todoId={todo.id} inProgress={todo.inProgress} isFocused={todo.isFocused} />

                                }

                                <div className='p-4 h-full text-black'>
                                    <Popover placement="top" content={`Created Date: ${todo.createdAt.toLocaleString()}`}>
                                        <InfoCircleOutlined
                                            className={`xl:text-4xl  hover:scale-125 transition-all `} />
                                    </Popover>
                                </div>
                            </div>

                            <div className={`p-4 min-w-[200px] break-all border-r border-l mx-4 grow xl:text-xl 
                            ${todo.isCompleted && editingTodoId !==todo.id && 'opacity-25 text-2xl'}`}>

                                {
                                    editingTodoId === todo.id
                                        ?
                                        <EditTodo todoId={editingTodoId} existName={todo.name} setEditingTodoId={setEditingTodoId} />
                                        :
                                        todo.name

                                }

                            </div>

                            <DeleteTodo todoId={todo.id} />

                            <div className='p-4 h-full '>
                                <span className='text-blue-600'>
                                    {
                                        editingTodoId
                                            ?
                                            <EditOutlined className='xl:text-4xl opacity-25' />
                                            :
                                            <EditOutlined onClick={() => handleEditing(todo.id)} className='xl:text-4xl hover:scale-125 transition-all cursor-pointer' />
                                    }

                                </span>
                            </div>

                        </div>
                    ))
            }
        </div >
    );
};

export function TodosCount() {

    const { data } = api.todo.getAll.useQuery();
    return (
        <span>
            {data?.length}
        </span>
    )
}

export function CompletedTodosCount() {

    const { data } = api.todo.getAll.useQuery();
    const completedTodosCount = data?.filter(todo => todo.isCompleted).length;
    return (
        <span> {completedTodosCount} </span>
    )
}

export function FocusedTodosCount() {
    const { data } = api.todo.getAll.useQuery();
    const NotCompletedTodos = data?.filter(todo => !todo.isCompleted);
    const FocusedTodosCount = NotCompletedTodos?.filter(todo => todo.isFocused).length;

    return (
        <span>{FocusedTodosCount}</span>
    );
}
