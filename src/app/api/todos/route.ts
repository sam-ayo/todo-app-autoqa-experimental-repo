import dbPromise from "@/lib/db";

export async function GET() {
  const db = await dbPromise;
  const rows = await db.all("SELECT * FROM todos");
  const todos = rows.map(
    (t: {
      id: number;
      title: string;
      complete: number;
      due_date: string | null;
    }) => ({
      id: t.id,
      title: t.title,
      complete: t.complete === 1,
      dueDate: t.due_date || null,
    })
  );
  return new Response(JSON.stringify(todos), { status: 200 });
}

export async function POST(request: Request) {
  const { title, dueDate } = await request.json();
  const db = await dbPromise;
  const result = await db.run(
    "INSERT INTO todos (title, complete, due_date) VALUES (?, ?, ?)",
    title,
    0,
    dueDate || null
  );
  const todo = {
    id: result.lastID,
    title,
    complete: false,
    dueDate: dueDate || null,
  };
  return new Response(JSON.stringify(todo), { status: 201 });
}
