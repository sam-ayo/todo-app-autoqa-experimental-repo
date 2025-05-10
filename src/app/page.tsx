"use client";
import { useState, useEffect } from "react";

type Todo = {
  id: number;
  title: string;
  complete: boolean;
  dueDate: string | null;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data: Todo[]) => setTodos(data));
  }, []);

  const addTodo = async () => {
    if (!title) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate }),
    });
    const newTodo: Todo = await res.json();
    setTodos([...todos, newTodo]);
    setTitle("");
    setDueDate("");
  };

  const toggleTodo = async (todo: Todo) => {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        complete: !todo.complete,
        dueDate: todo.dueDate,
      }),
    });
    const updated: Todo = await res.json();
    setTodos(todos.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Todo List</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1"
          placeholder="New todo"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Due date"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4">
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={todo.complete}
              onChange={() => toggleTodo(todo)}
            />
            <span className={todo.complete ? "line-through" : ""}>
              {todo.title}
            </span>
            {todo.dueDate && (
              <span className="text-sm text-gray-500 ml-2">
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 ml-auto"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
