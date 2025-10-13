import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

type Params = Promise<{ id: string }>;
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const utapi = new UTApi();
    const { id } = await params;
    await utapi.deleteFiles(id);

    return Response.json({ message: "ok" });
  } catch (error) {
    if (error instanceof Error) {
      console.log(`${error.message}`);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Couldn't delete image" },
      { status: 500 }
    );
  }
}
