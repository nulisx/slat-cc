import { NextRequest } from "next/server";
import { ofetch } from "ofetch";
import { SlatServerError, successResponse } from "@/lib/services/api";
import { withAuth } from "@/lib/auth/middleware";

// app/api/account/upload

interface XoaAPIResponse {
  data: {
    cdn_url: string;
    key: string;
  };
}

const sanitizeFileName = (name: string) =>
  name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_.-]/g, "");

async function handler(req: NextRequest, userId: number) {
  const formData = await req.formData();

  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    throw new SlatServerError({
      code: "bad_request",
      message: "No file found in request",
    });
  }

  const uploadFormData = new FormData();
  uploadFormData.append("file", file, "file");
  uploadFormData.append("original_name", sanitizeFileName(file.name));

  const options = {
    method: "POST",
    headers: {
      Authorization: "",
    },
    body: uploadFormData,
  };

  const {
    data: { cdn_url: url },
  } = await ofetch<XoaAPIResponse>("https://api.xoa.me/v1/upload", {
    ...options,
    onResponseError({ response }) {
      throw new Error(response._data?.message || "Xoa API error");
    },
  });

  if (!url) {
    throw new SlatServerError({
      code: "internal_server_error",
      message: "Failed to upload file",
    });
  }

  return successResponse({
    message: "File uploaded successfully",
    data: url,
  });
}

export const POST = withAuth(handler);
