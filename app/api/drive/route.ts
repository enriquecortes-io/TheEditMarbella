import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return new NextResponse("Missing id", { status: 400 });

    const drive = google.drive({ version: "v3", auth });
    
    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    const contentType = response.headers["content-type"] || "image/jpeg";
    
    return new NextResponse(response.data as any, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e: any) {
    return new NextResponse("Error", { status: 500 });
  }
}
