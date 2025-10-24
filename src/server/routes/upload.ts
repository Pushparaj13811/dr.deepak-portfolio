import { mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = "./uploads";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// POST /api/upload
export async function uploadImage(req: Request): Promise<Response> {
  try {
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Save file using Bun's file writer
    const arrayBuffer = await file.arrayBuffer();
    await Bun.write(filepath, arrayBuffer);

    // Return URL path
    const url = `/uploads/${filename}`;

    return Response.json({
      success: true,
      data: { url, filename },
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// DELETE /api/upload/:filename
export async function deleteImage(req: Request & { params?: { filename?: string } }): Promise<Response> {
  try {
    const filename = req.params?.filename;

    if (!filename) {
      return Response.json(
        { success: false, error: "Filename required" },
        { status: 400 }
      );
    }

    const filepath = join(UPLOAD_DIR, filename);

    // Check if file exists and delete it
    try {
      const file = Bun.file(filepath);
      const exists = await file.exists();

      if (!exists) {
        return Response.json(
          { success: false, error: "File not found" },
          { status: 404 }
        );
      }

      // Use Bun's unlink to delete the file
      await import("fs/promises").then(fs => fs.unlink(filepath));

      return Response.json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json(
      { success: false, error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
