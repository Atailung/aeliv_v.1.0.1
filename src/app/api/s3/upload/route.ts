
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import z from "zod"
import { v4 as uuidv4 } from "uuid"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "File size is required" }),
  isImage: z.boolean(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = fileUploadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      )
    }

    const { fileName, contentType, isImage } = validation.data

    // generate unique name
    const uniqueFileName = `${uuidv4()}-${fileName}`

    // ensure region is set
    if (!process.env.AWS_REGION) {
      throw new Error("AWS_REGION is not set")
    }

    const s3Client = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    })

    // choose bucket (adjust logic if needed)
    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 360, // seconds (6 minutes)
    })

    return NextResponse.json({
      presignedUrl,
      key: uniqueFileName,
    })
  } catch (err) {
    console.error("S3 Upload Error:", err)
    return NextResponse.json(
      { error: "Error creating upload URL" },
      { status: 500 }
    )
  }
}
