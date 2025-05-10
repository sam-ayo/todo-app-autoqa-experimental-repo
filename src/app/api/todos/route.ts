import dbPromise from "@/lib/db";

export async function GET() {
  const db = await dbPromise;
  const todos = await db.all("SELECT * FROM todos");
  return new Response(JSON.stringify(todos), { status: 200 });
}

export async function POST(request: Request) {
  const { title } = await request.json();
  const db = await dbPromise;
  const result = await db.run(
    "INSERT INTO todos (title, complete) VALUES (?, ?)",
    title,
    0
  );
  const todo = { id: result.lastID, title, complete: 0 };
  return new Response(JSON.stringify(todo), { status: 201 });
}
