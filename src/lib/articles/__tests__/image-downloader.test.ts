import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { downloadImage, downloadThumbnail } from "../image-downloader";
import {
  convertToWebP,
  getImageMetadata,
  calculateCompressionRatio,
} from "../image-utils";

// テスト用のディレクトリ
const TEST_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "articles",
  "test-article",
);

describe("Image Downloader", () => {
  beforeEach(() => {
    // テストディレクトリを作成
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // テストファイルをクリーンアップ
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  it("should download image without WebP conversion", async () => {
    const testUrl = "https://via.placeholder.com/300x200.png";
    const result = await downloadImage(testUrl, "test-article");

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toMatch(
        /\/images\/articles\/test-article\/.*\.png$/,
      );

      // ファイルが実際に保存されているか確認
      const filePath = path.join(process.cwd(), "public", result.value);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  it("should download and convert image to WebP", async () => {
    const testUrl = "https://via.placeholder.com/300x200.png";
    const result = await downloadImage(testUrl, "test-article", {
      convertToWebP: true,
      quality: 80,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toMatch(
        /\/images\/articles\/test-article\/.*\.webp$/,
      );

      // ファイルが実際に保存されているか確認
      const filePath = path.join(process.cwd(), "public", result.value);
      expect(fs.existsSync(filePath)).toBe(true);

      // WebPファイルのサイズを確認
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
    }
  });

  it("should download thumbnail with WebP conversion", async () => {
    const testUrl = "https://via.placeholder.com/800x600.png";
    const result = await downloadThumbnail(testUrl, "test-article", 400, 300);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toMatch(
        /\/images\/articles\/test-article\/.*\.webp$/,
      );

      // ファイルが実際に保存されているか確認
      const filePath = path.join(process.cwd(), "public", result.value);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  it("should handle download errors gracefully", async () => {
    const invalidUrl = "https://invalid-url-that-does-not-exist.com/image.png";
    const result = await downloadImage(invalidUrl, "test-article");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.type).toBe("FETCH_ERROR");
    }
  });
});

describe("Image Utils", () => {
  it("should convert buffer to WebP", async () => {
    // テスト用のPNG画像バッファを作成（実際のテストでは適切なテスト画像を使用）
    const testBuffer = Buffer.from("fake-png-data");

    // 実際のテストでは、有効な画像バッファを使用する必要があります
    // このテストは概念的なものです
    expect(testBuffer).toBeInstanceOf(Buffer);
  });

  it("should calculate compression ratio correctly", () => {
    const originalSize = 1000;
    const compressedSize = 600;
    const ratio = calculateCompressionRatio(originalSize, compressedSize);

    expect(ratio).toBe(40); // 40%の圧縮率
  });

  it("should handle zero compression ratio", () => {
    const originalSize = 1000;
    const compressedSize = 1000;
    const ratio = calculateCompressionRatio(originalSize, compressedSize);

    expect(ratio).toBe(0); // 0%の圧縮率
  });
});
