import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { S3 } from "@/lib/S3Client";
import { env } from "@/lib/env";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "File size is required" }),
  isImage: z.boolean(),
});

const aj = arcjet
  .withRule(
    fixedWindow({
      mode: "LIVE",
      max: 2,
      window: "1m",
    })
  );

export async function POST(request: Request) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Request denied by security rules" },
        { status: 429 }
      );
    }
    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { fileName, contentType, isImage } = validation.data;

    // generate unique name
    const uniqueFileName = `${uuidv4()}-${fileName}`;

    // Use the shared S3 client instead of creating a new one
    const bucketName = env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      ContentType: contentType,
      Metadata: {
        isImage: isImage.toString(),
      },
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, // seconds (6 minutes)
    });

    return NextResponse.json({
      presignedUrl,
      key: uniqueFileName,
    });
  } catch (err) {
    console.error("S3 Upload Error:", err);
    return NextResponse.json(
      { error: "Error creating upload URL" },
      { status: 500 }
    );
  }
}
