import fs from "fs";
import path from "path";
import { Result, err, ok } from "neverthrow";
import type { NotionError } from "./types";

/**
 * 画像をダウンロードして、publicディレクトリに保存する
 * @param url ダウンロードする画像のURL
 * @param articleId 記事ID
 * @returns 保存した画像のパス or NotionError
 */
export async function downloadImage(
  url: string,
  articleId: string,
): Promise<Result<string, NotionError>> {
  try {
    const urlObject = new URL(url);
    const pathnameParts = urlObject.pathname.split("/").filter(Boolean);
    const imageId =
      pathnameParts[pathnameParts.length - 2] || `image_${Date.now()}`;
    const originalFilename = pathnameParts[pathnameParts.length - 1];
    const extension = path.extname(originalFilename) || ".png";
    const imageName = `${imageId}${extension}`;

    const directoryPath = path.join(
      process.cwd(),
      "public",
      "images",
      "articles",
      articleId,
    );
    const imagePath = path.join(directoryPath, imageName);
    const publicPath = path.join("/images", "articles", articleId, imageName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    if (fs.existsSync(imagePath)) {
      return ok(publicPath);
    }

    const response = await fetch(url);
    if (!response.ok) {
      return err({
        type: "FETCH_ERROR",
        message: `Failed to fetch image: ${response.statusText}`,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(imagePath, buffer);

    return ok(publicPath);
  } catch (error) {
    console.error("Failed to download image", error);
    return err({
      type: "UNKNOWN",
      message: "Failed to download image",
      originalError: error,
    });
  }
}
