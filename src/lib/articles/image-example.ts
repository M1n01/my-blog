import { downloadImage, downloadThumbnail } from "./image-downloader";
import {
  getOptimizationSettings,
  calculateCompressionRatio,
} from "./image-utils";

/**
 * 記事の画像を処理する例
 */
export async function processArticleImages(articleId: string) {
  const imageUrl = "https://example.com/article-image.jpg";

  try {
    // 1. 通常の画像ダウンロード（元の形式）
    console.log("Downloading original image...");
    const originalResult = await downloadImage(imageUrl, articleId);

    if (originalResult.isErr()) {
      console.error("Failed to download original image:", originalResult.error);
      return;
    }

    console.log("Original image saved:", originalResult.value);

    // 2. WebP形式でダウンロード（高品質）
    console.log("Downloading WebP version...");
    const webpResult = await downloadImage(imageUrl, articleId, {
      convertToWebP: true,
      quality: 90,
      width: 1200,
      height: 800,
    });

    if (webpResult.isErr()) {
      console.error("Failed to download WebP image:", webpResult.error);
      return;
    }

    console.log("WebP image saved:", webpResult.value);

    // 3. サムネイル画像のダウンロード
    console.log("Downloading thumbnail...");
    const thumbnailResult = await downloadThumbnail(
      imageUrl,
      articleId,
      400,
      300,
    );

    if (thumbnailResult.isErr()) {
      console.error("Failed to download thumbnail:", thumbnailResult.error);
      return;
    }

    console.log("Thumbnail saved:", thumbnailResult.value);
  } catch (error) {
    console.error("Error processing article images:", error);
  }
}

/**
 * 異なる画像タイプに応じた最適化設定の例
 */
export function demonstrateOptimizationSettings() {
  console.log("Optimization settings for different image types:");

  const imageTypes = ["thumbnail", "hero", "content"] as const;

  imageTypes.forEach((type) => {
    const settings = getOptimizationSettings(type);
    console.log(`${type}:`, {
      quality: settings.quality,
      effort: settings.effort,
      maxWidth: settings.maxWidth,
      maxHeight: settings.maxHeight,
    });
  });
}

/**
 * 圧縮率の計算例
 */
export function demonstrateCompressionRatio() {
  const examples = [
    { original: 1000000, compressed: 300000 }, // 70% 圧縮
    { original: 500000, compressed: 400000 }, // 20% 圧縮
    { original: 200000, compressed: 200000 }, // 0% 圧縮
  ];

  console.log("Compression ratio examples:");
  examples.forEach(({ original, compressed }) => {
    const ratio = calculateCompressionRatio(original, compressed);
    console.log(
      `${original} bytes → ${compressed} bytes = ${ratio}% compression`,
    );
  });
}

/**
 * 記事の画像を一括処理する例
 */
export async function batchProcessArticleImages(
  articleId: string,
  imageUrls: string[],
) {
  console.log(
    `Processing ${imageUrls.length} images for article ${articleId}...`,
  );

  const results = await Promise.allSettled(
    imageUrls.map(async (url, index) => {
      // メイン画像（高品質WebP）
      const mainResult = await downloadImage(url, articleId, {
        convertToWebP: true,
        quality: 90,
        width: 1200,
        height: 800,
      });

      // サムネイル画像
      const thumbnailResult = await downloadThumbnail(url, articleId, 400, 300);

      return {
        index,
        url,
        main: mainResult,
        thumbnail: thumbnailResult,
      };
    }),
  );

  // 結果の集計
  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(
    `Batch processing completed: ${successful} successful, ${failed} failed`,
  );

  return results;
}
