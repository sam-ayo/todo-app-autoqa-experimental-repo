import dbPromise from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await dbPromise;
  const todo = await db.get("SELECT * FROM todos WHERE id = ?", id);
  return new Response(JSON.stringify(todo), { status: 200 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, complete } = await request.json();
  const db = await dbPromise;
  await db.run(
    "UPDATE todos SET title = ?, complete = ? WHERE id = ?",
    title,
    complete ? 1 : 0,
    id
  );
  const updated = await db.get("SELECT * FROM todos WHERE id = ?", id);
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
