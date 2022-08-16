import { makeAutoObservable } from "mobx";
import { message } from 'ant-design-vue';
import apiClient from "@/api/api.client";
import { Todo } from '@/store/entities';
import { createGlobalObservable, useLocalObservable } from "mobx-vue-lite";

class TodoStore {
  todos = [];

  constructor() {
    makeAutoObservable(this);
  }

  get completedTodos() {
    return this.todos.filter(todo => todo.completed);
  }

  get plannedTodos() {
    return this.todos.filter(todo => !todo.completed);
  }

  getTodos = async () => {
    const response = await apiClient.get('/todos');
    this.todos = response.data.map(todo => new Todo(todo));
  }

  addTodo = async (description) => {
    if (!description || !description.length) {
      message.error("Todo can't be empty!!!");
      return;
    }
    const response = await apiClient.post('/todos', new Todo({ description }));
    this.todos = [...this.todos, new Todo(response.data)];
  }

  removeTodo = async (todoID) => {
    await apiClient.delete(`/todos/${todoID}`);
    await this.getTodos();
    message.success("Todo removed!");
  }

  toggleTodo = async (todoID) => {
    const todo = this.todos.find((todo) => todo.id === todoID);

    if (todo) {
      const response = await apiClient.put(`/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed,
      })
      this.todos = this.todos.map(todo => {
        if (todo.id === todoID) {
          return new Todo(response.data);
        }

        return new Todo(todo);
      })
    }
  }

  completeAllTodos = async () => {
    const updatedTodosRequests = this.todos.filter(todo => !todo.completed)
      .map(todo => apiClient.put(`/todos/${todo.id}`, new Todo({
        ...todo,
        completed: true,
      })));

    await Promise.all(updatedTodosRequests);
    await this.getTodos();
    message.success("All todos completed!");
  }

  clearCompletedTodos = async () => {
    const toRemoveRequests = this.todos.filter(todo => todo.completed)
      .map((todo) => apiClient.delete(`/todos/${todo.id}`));

    await Promise.all(toRemoveRequests);
    this.todos = this.todos.filter(todo => !todo.completed)
    message.success("All todos removed!");
  }
}

export const todoStore = createGlobalObservable(() => {
  return useLocalObservable(() => new TodoStore);
});