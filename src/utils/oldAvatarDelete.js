import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "./ApiError.js";

/**
 * Extract public_id from Cloudinary URL
 */
const extractPublicId = (url) => {
    try {
        const parts = url.split("/");

        const uploadIndex = parts.findIndex(p => p === "upload");

        if (uploadIndex === -1) return null;

        const publicIdWithVersion = parts.slice(uploadIndex + 1).join("/");

        const withoutVersion = publicIdWithVersion.replace(/^v\d+\//, "");

        const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

        return publicId;
    } catch (error) {
        return null;
    }
};

/**
 * Delete image from Cloudinary using URL
 */
export const deleteFromCloudinary = asyncHandler(async (url) => {
    if (!url) {
        throw new ApiError(400, "Avatar URL is required for deletion");
    }

    const publicId = extractPublicId(url);

    if (!publicId) {
        throw new ApiError(400, "Invalid Cloudinary URL");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
        throw new ApiError(500, "Failed to delete old avatar");
    }

    return result;
});