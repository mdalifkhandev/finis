type UploadFileAsset = {
  uri: string;
  name?: string | null;
  type?: string | null;
};

type AppendImageOptions = {
  fileName?: string;
  mimeType?: string;
};

export const DEFAULT_IMAGE_UPLOAD_QUALITY = 0.8;
export const TASK_REPORT_IMAGE_UPLOAD_QUALITY = 0.35;

function normalizeImageExtension(extension?: string | null) {
  const normalized = (extension ?? "").trim().toLowerCase().replace(/^\./, "");

  if (normalized === "jpg" || normalized === "jpeg") {
    return { extension: "jpg", mimeType: "image/jpeg" };
  }

  if (normalized === "png") {
    return { extension: "png", mimeType: "image/png" };
  }

  if (normalized === "webp") {
    return { extension: "webp", mimeType: "image/webp" };
  }

  if (normalized === "heic") {
    return { extension: "heic", mimeType: "image/heic" };
  }

  return { extension: "jpg", mimeType: "image/jpeg" };
}

function getExtensionFromValue(value?: string | null) {
  if (!value) return null;
  const cleanValue = value.split("?")[0];
  const parts = cleanValue.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

export function isLocalUploadUri(uri?: string | null) {
  return Boolean(uri && !uri.startsWith("http") && !uri.startsWith("/"));
}

export function buildImageUploadFile(
  asset: UploadFileAsset,
  options: AppendImageOptions = {},
) {
  const inferred = normalizeImageExtension(
    getExtensionFromValue(asset.name) ||
      getExtensionFromValue(options.fileName) ||
      getExtensionFromValue(asset.uri),
  );

  return {
    uri: asset.uri,
    name: asset.name || options.fileName || `image.${inferred.extension}`,
    type: asset.type || options.mimeType || inferred.mimeType,
  };
}

export function appendImageToFormData(
  formData: FormData,
  fieldName: string,
  asset?: UploadFileAsset | null,
  options: AppendImageOptions = {},
) {
  if (!asset?.uri || !isLocalUploadUri(asset.uri)) {
    return;
  }

  formData.append(fieldName, buildImageUploadFile(asset, options) as any);
}
