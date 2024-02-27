import { unstable_noStore as noStore } from "next/cache";


import { CreateTodo } from "app/app/_components/CreateTodo";
import { getServerAuthSession } from "app/server/auth";


import SignIn from "./_components/Buttons/SignIn";
import { CompletedTodosCount, FocusedTodosCount, GetAllTodos, TodosCount } from "./_components/GetAllTodos";
import { DeleteAllTodos } from "./_components/DeleteAllTodos";
import { DeleteCompleted } from "./_components/DeleteCompleted";
import SignOut from "./_components/Buttons/SignOut";


export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  return (

    <main className="flex min-h-screen max-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1f1331] to-[#8a6fbe] text-white">
      {

        session
          ?
          <div className="flex flex-col min-h-screen min-w-[50%] max-w-[400px] justify-start m-10 p-10 gap-10">

            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl"> TODO APP</h1>
              <h4 > <span className="opacity-25">{session.user.email} </span> welcome</h4>
              <div className="flex justify-center ">
                <SignOut />
              </div>
            </div>

            <CreateTodo />

            <GetAllTodos />

            <div className="flex mt-auto flex-col xl:flex-row justify-between items-center  gap-5 text-center">
              <div className="flex flex-row justify-center items-center gap-2">
                <div className="border border-w p-2 text-sm">
                  <span>TOTAL TODO: <TodosCount /> </span>
                </div>
                <div className="border border-w p-2 text-sm">
                  <span>TOTAL FOCUSED: <FocusedTodosCount /> </span>
                </div>
                <div className="border border-w p-2 text-sm">
                  <span>TOTAL COMPLETED: <CompletedTodosCount /> </span>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center gap-6 text-sm">
                <DeleteAllTodos />
                <DeleteCompleted />
              </div>
            </div>

          </div>
          :
          <SignIn />

      }

    </main >
  );
}
