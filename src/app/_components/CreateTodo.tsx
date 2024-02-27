"use client";


import { useState } from "react";

import { api } from "app/trpc/react";
import { LoadingOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

interface Res {
  message?: string;
  error?: string;
}

export function CreateTodo() {

  const [name, setName] = useState("");
  const ctx = api.useContext();

  const createTodo = api.todo.create.useMutation({
    onSuccess: (res: Res) => {
      void ctx.todo.getAll.fetch();
      if (res.error) {
        toast.error(res.error)
      } else if (res.message) {
        toast.success(res.message)
      }
      setName("");
    },
    onError: (error) => {
      toast.error(error.message)
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTodo.mutate({ name });
      }}
      className="flex md:flex-row flex-col gap-2 md:gap-0 text-2xl"
    >
      <input
        maxLength={200}
        type="text"
        placeholder="Todo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full md:rounded-none px-4 py-2 text-black border "

      />



      <button
        type="submit"
        className="md:rounded-l rounded-full bg-white/10 text-xl  md:w-[200px] py-4 font-semibold transition hover:bg-white/20"
        disabled={createTodo.isLoading || name.length === 0}
      >
        {createTodo.isLoading ? (
          <span>Adding <LoadingOutlined /></span>
        ) : (
          <span>Add </span>
        )}
      </button>
    </form>
  );
}