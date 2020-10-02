import React, { createContext, useEffect, useState } from "react";
import { AddTodo, DeleteTodo, GetTodos, ITodo, UpdateTodo } from "./api";

interface ITodoContext {
  Todos: ITodo[];
  AddTodo: (td: ITodo) => Promise<boolean>;
  DeleteTodo: (td: number) => Promise<boolean>;
  UpdateTodo: (td: ITodo) => Promise<boolean>;
}

export const TodoContext = createContext<ITodoContext | null>(null);

const TodoProvider = (props: any) => {
  const [todos, setTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const resp = await GetTodos();
      if (resp) {
        setTodos(resp);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (td: ITodo): Promise<boolean> => {
    const ok = await AddTodo(td);
    if (!ok) {
      return false;
    }
    setTodos([ok, ...todos]);
    return true;
  };

  const deleteTodo = async (id: number): Promise<boolean> => {
    const ok = await DeleteTodo(id);
    if (ok) {
      setTodos(todos.filter((x) => x.id !== id));
      return true;
    }
    return false;
  };

  const updateTodo = async (td: ITodo): Promise<boolean> => {
    if (!td.id) {
      return false;
    }

    const ok = await UpdateTodo(td);

    if (!ok) {
      return false;
    }

    const index = todos.findIndex((x) => x.id === td.id);

    if (index === -1) {
      return false;
    }

    todos[index].title = td.title;
    todos[index].description = td.description;

    setTodos([...todos]);

    return true;
  };

  return (
    <TodoContext.Provider
      value={{
        Todos: todos,
        AddTodo: addTodo,
        DeleteTodo: deleteTodo,
        UpdateTodo: updateTodo,
      }}
      {...props}
    />
  );
};

export default TodoProvider;
