import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import sharp from "sharp";

function getAuth() {
 return new google.auth.GoogleAuth({
   credentials: {
     type: "service_account",
     project_id: process.env.GOOGLE_PROJECT_ID,
     private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
     private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
     client_email: process.env.GOOGLE_CLIENT_EMAIL,
     client_id: process.env.GOOGLE_CLIENT_ID,
   },
   scopes: ["https://www.googleapis.com/auth/drive.readonly"],
 });
}

export async function GET(req: NextRequest) {
 try {
   const { searchParams } = req.nextUrl;
   const id = searchParams.get("id");
   const w = parseInt(searchParams.get("w") || "1200");
   const q = parseInt(searchParams.get("q") || "80");

   if (!id) return new NextResponse("Missing id", { status: 400 });

   const auth = getAuth();
   const drive = google.drive({ version: "v3", auth });

   const response = await drive.files.get(
     { fileId: id, alt: "media" },
     { responseType: "arraybuffer" }
   );

   const buffer = Buffer.from(response.data as ArrayBuffer);

   const optimized = await sharp(buffer)
     .resize(w, undefined, { withoutEnlargement: true, fit: "inside" })
     .webp({ quality: q })
     .toBuffer();

   return new NextResponse(optimized, {
     headers: {
       "Content-Type": "image/webp",
       "Cache-Control": "public, max-age=31536000, immutable",
       "CDN-Cache-Control": "public, max-age=31536000",
       "Vercel-CDN-Cache-Control": "public, max-age=31536000",
     },
   });

 } catch (e: any) {
   console.error(e);
   return new NextResponse("Error: " + e.message, { status: 500 });
 }
}
