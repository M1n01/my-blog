import sharp from "sharp";
import { Result, err, ok } from "neverthrow";
import type { NotionError } from "./types";

/**
 * 画像のメタデータを取得する
 * @param buffer 画像バッファ
 * @returns 画像のメタデータ or NotionError
 */
export async function getImageMetadata(
  buffer: Buffer,
): Promise<Result<sharp.Metadata, NotionError>> {
  try {
    const metadata = await sharp(buffer).metadata();
    return ok(metadata);
  } catch (error) {
    console.error("Failed to get image metadata", error);
    return err({
      type: "UNKNOWN",
      message: "Failed to get image metadata",
      originalError: error,
    });
  }
}

/**
 * 画像をWebP形式に変換する
 * @param buffer 元の画像バッファ
 * @param options 変換オプション
 * @returns 変換された画像バッファ or NotionError
 */
export async function convertToWebP(
  buffer: Buffer,
  options: {
    quality?: number;
    width?: number;
    height?: number;
    effort?: number;
  } = {},
): Promise<Result<Buffer, NotionError>> {
  try {
    let sharpInstance = sharp(buffer);

    // リサイズオプション
    if (options.width || options.height) {
      sharpInstance = sharpInstance.resize(options.width, options.height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // WebP変換
    const webpBuffer = await sharpInstance
      .webp({
        quality: options.quality || 80,
        effort: options.effort || 4,
      })
      .toBuffer();

    return ok(webpBuffer);
  } catch (error) {
    console.error("Failed to convert image to WebP", error);
    return err({
      type: "UNKNOWN",
      message: "Failed to convert image to WebP",
      originalError: error,
    });
  }
}

/**
 * 画像の最適化設定を取得する
 * @param imageType 画像タイプ（'thumbnail' | 'hero' | 'content'）
 * @returns 最適化設定
 */
export function getOptimizationSettings(
  imageType: "thumbnail" | "hero" | "content" = "content",
) {
  const settings = {
    thumbnail: {
      quality: 85,
      effort: 4,
      maxWidth: 400,
      maxHeight: 300,
    },
    hero: {
      quality: 90,
      effort: 5,
      maxWidth: 1200,
      maxHeight: 800,
    },
    content: {
      quality: 80,
      effort: 4,
      maxWidth: 800,
      maxHeight: 600,
    },
  };

  return settings[imageType];
}

/**
 * 画像の圧縮率を計算する
 * @param originalSize 元のファイルサイズ（バイト）
 * @param compressedSize 圧縮後のファイルサイズ（バイト）
 * @returns 圧縮率（パーセント）
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number,
): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
