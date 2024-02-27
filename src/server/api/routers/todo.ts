import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "app/server/api/trpc";

export const todoRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ name: z.string().min(1, { message: 'Cannot be empty' }).max(200, { message: 'Max length 200 characters' }) }))
        .mutation(async ({ ctx, input }) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await ctx.db.todo.create({
                data: {
                    name: input.name,
                    createdBy: { connect: { id: ctx.session.user.id } },
                },
            });

            return { message: 'Todo created' };
        }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
        const todos = await ctx.db.todo.findMany({
            orderBy: { createdAt: "desc" },
        });
        return todos;
    }),

    changeStatus: protectedProcedure
        .input(z.object({ todoId: z.number().min(1) }))
        .mutation(async ({ ctx, input }) => {

            const todo = await ctx.db.todo.findUnique({
                where: {
                    createdById: ctx.session.user.id,
                    id: input.todoId
                }
            })

            if (!todo) {
                return { error: 'Todo not found' };
            }

            if (todo.inProgress) {
                await ctx.db.todo.update({
                    where: {
                        createdById: ctx.session.user.id,
                        id: input.todoId
                    },
                    data: {
                        inProgress: false,
                        isFocused: true
                    }
                })
            }

            if (todo.isFocused) {
                await ctx.db.todo.update({
                    where: {
                        createdById: ctx.session.user.id,
                        id: input.todoId
                    },
                    data: {
                        inProgress: true,
                        isFocused: false
                    }
                })
            }

            return { message: `status changed` };
        }),

    complete: protectedProcedure
        .input(z.object({ todoId: z.number().min(1) }))
        .mutation(async ({ ctx, input }) => {

            const todo = await ctx.db.todo.findUnique({
                where: {
                    createdById: ctx.session.user.id,
                    id: input.todoId
                }
            })

            if (!todo) {
                return { error: 'Todo not found' };
            }

            if (!todo.isCompleted) {
                await ctx.db.todo.update({
                    where: {
                        createdById: ctx.session.user.id,
                        id: input.todoId
                    },
                    data: {
                        isCompleted: true,
                        completedAt: new Date(),
                    }
                })
            }

            if (todo.isCompleted) {
                await ctx.db.todo.update({
                    where: {
                        createdById: ctx.session.user.id,
                        id: input.todoId
                    },
                    data: {
                        isCompleted: false
                    }
                })
            }

            return { message: `updated` };
        }),

    delete: protectedProcedure
        .input(z.object({ todoId: z.number().min(1) }))
        .mutation(async ({ ctx, input }) => {

            const todo = await ctx.db.todo.findUnique({
                where: {
                    createdById: ctx.session.user.id,
                    id: input.todoId
                }
            })

            if (!todo) {
                return { error: 'Todo not found' };
            }

            await ctx.db.todo.delete({
                where: {
                    createdById: ctx.session.user.id,
                    id: input.todoId
                },
            });

            return { message: `Todo deleted` };
        }),

    deleteAll: protectedProcedure
        .mutation(async ({ ctx }) => {

            const todos = await ctx.db.todo.findMany({
                where: {
                    createdById: ctx.session.user.id,
                }
            })

            if (todos.length === 0) {
                return { error: `Todo not found` };
            }

            await ctx.db.todo.deleteMany({
                where: {
                    createdById: ctx.session.user.id
                },
            });
            return { message: `All todos deleted` };
        }),

    deleteCompleted: protectedProcedure
        .mutation(async ({ ctx }) => {

            const todos = await ctx.db.todo.findMany({
                where: {
                    createdById: ctx.session.user.id,
                    isCompleted: true
                }
            })

            if (todos.length === 0) {
                return { error: `Completed todo not found` };
            }

            await ctx.db.todo.deleteMany({
                where: {
                    createdById: ctx.session.user.id,
                    isCompleted: true
                },
            });
            return { message: `Completed todos deleted` };
        }),

    edit: protectedProcedure
        .input(z.object({ todoId: z.number().min(1) }))
        .input(z.object({ name: z.string().min(1, { message: 'Cannot be empty' }).max(200, { message: 'Max length 200 characters' }) }))
        .mutation(async ({ ctx, input }) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const todo = await ctx.db.todo.findFirst({
                where: {
                    createdById: ctx.session.user.id,
                    id: input.todoId
                }
            })

            if (!todo) {
                return { error: `Todo not found` };
            }

            await ctx.db.todo.update({
                where: {
                    createdById: ctx.session.user.id,
                    id: input.todoId
                },
                data: {
                    name: input.name
                }
            })

            return { message: `Todo edited` };
        }),
});