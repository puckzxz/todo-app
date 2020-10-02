export interface ITodo {
  id?: number;
  title: string;
  description: string;
}

export async function GetTodos(): Promise<ITodo[] | undefined> {
  const resp = await fetch("/todo");
  if (resp.ok) {
    if (resp.status === 204) {
      return [];
    }
    return resp.json();
  }
}

export async function AddTodo(td: ITodo): Promise<ITodo | undefined> {
  const resp = await fetch("/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(td),
  });
  if (resp.ok) {
    return resp.json();
  }
}

export async function DeleteTodo(id: number): Promise<boolean> {
  const resp = await fetch(`/todo/${id}`, {
    method: "DELETE",
  });
  return resp.ok;
}

export async function UpdateTodo(td: ITodo): Promise<boolean> {
  const resp = await fetch(`/todo/${td.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(td),
  });
  return resp.ok;
}
