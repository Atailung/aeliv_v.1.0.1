import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";


const aj = arcjet.withRule(
        detectBot({
           mode: "LIVE" ,
           allow : []
          })
       ).withRule(
        fixedWindow({
          mode: "LIVE",
         max: 5,
          window: '1m',
        })
      )

export async function DELETE(request: Request) {


    const session = await requireAdmin();

    try {
      // Here you would add logic to delete the file from S3 using AWS SDK
      // For example, you might extract a file key from the request URL or body
      // and then call s3.deleteObject({ Bucket: 'your-bucket-name', Key: fileKey }).promise();

       const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string
    })

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Request denied by security rules" },
        { status: 429 }
      )
    }

      const body = await request.json();

      const key = body.key;
        if (!key) {
            return NextResponse.json(
                { error: "File key is required" },
                { status: 400 }
            );
        }
        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key
        });

        await S3.send(command);

        return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete file", details: error },
            { status: 500 }
        );
    }
}