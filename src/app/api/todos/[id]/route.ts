import dbPromise from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await dbPromise;
  const t = await db.get<{
    id: number;
    title: string;
    complete: number;
    due_date: string | null;
  }>("SELECT * FROM todos WHERE id = ?", id);
  if (!t) return new Response(null, { status: 404 });
  const todo = {
    id: t.id,
    title: t.title,
    complete: t.complete === 1,
    dueDate: t.due_date || null,
  };
  return new Response(JSON.stringify(todo), { status: 200 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, complete, dueDate } = await request.json();
  const db = await dbPromise;
  await db.run(
    "UPDATE todos SET title = ?, complete = ?, due_date = ? WHERE id = ?",
    title,
    complete ? 1 : 0,
    dueDate || null,
    id
  );
  const t = await db.get<{
    id: number;
    title: string;
    complete: number;
    due_date: string | null;
  }>("SELECT * FROM todos WHERE id = ?", id);
  if (!t) return new Response(null, { status: 404 });
  const updated = {
    id: t.id,
    title: t.title,
    complete: t.complete === 1,
    dueDate: t.due_date || null,
  };
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await dbPromise;
  await db.run("DELETE FROM todos WHERE id = ?", id);
  return new Response(null, { status: 204 });
}
