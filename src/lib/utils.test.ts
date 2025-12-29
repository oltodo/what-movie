import { describe, it, expect } from "vitest";
import { isSimilar } from "./utils";

describe("isSimilar", () => {
  describe("Exact matches", () => {
    it("should return true for exact match", () => {
      expect(isSimilar("Matrix", ["Matrix"], 0.8)).toBe(true);
    });

    it("should return true for exact match with different case", () => {
      expect(isSimilar("MATRIX", ["matrix"], 0.8)).toBe(true);
      expect(isSimilar("matrix", ["MATRIX"], 0.8)).toBe(true);
    });

    it("should return true for exact match with extra whitespace", () => {
      expect(isSimilar("  Matrix  ", ["Matrix"], 0.8)).toBe(true);
      expect(isSimilar("Matrix", ["  Matrix  "], 0.8)).toBe(true);
    });

    it("should return true when one of multiple targets matches exactly", () => {
      expect(
        isSimilar("Inception", ["Matrix", "Inception", "Avatar"], 0.8)
      ).toBe(true);
    });
  });

  describe("Approximate matches", () => {
    it("should return true for typo with 1 character difference (80% threshold)", () => {
      // "Matric" vs "Matrix" = 1 char difference, 6 chars max = ~83% similarity
      expect(isSimilar("Matric", ["Matrix"], 0.8)).toBe(true);
    });

    it("should return true for close approximation", () => {
      // "Incepion" vs "Inception" = 1 char difference, 9 chars max = ~89% similarity
      expect(isSimilar("Incepion", ["Inception"], 0.8)).toBe(true);
    });

    it("should return true for approximate match in array of targets", () => {
      expect(isSimilar("Matric", ["Inception", "Matrix", "Avatar"], 0.8)).toBe(
        true
      );
    });

    it("should return true with lower threshold allowing more differences", () => {
      // "Matrx" vs "Matrix" = 1 deletion, 5 chars max = 80% similarity
      expect(isSimilar("Matrx", ["Matrix"], 0.6)).toBe(true);

      // "Mtrix" vs "Matrix" = 1 char difference
      expect(isSimilar("Mtrix", ["Matrix"], 0.6)).toBe(true);
    });

    it("should handle multiple character differences based on threshold", () => {
      // "Matix" vs "Matrix" = 1 deletion, 6 chars = ~83% similarity
      expect(isSimilar("Matix", ["Matrix"], 0.8)).toBe(true);

      // "Mtix" vs "Matrix" = 2 deletions, 6 chars = ~67% similarity
      expect(isSimilar("Mtix", ["Matrix"], 0.6)).toBe(true);
      expect(isSimilar("Mtix", ["Matrix"], 0.7)).toBe(false);
    });
  });

  describe("Non-matches", () => {
    it("should return false for completely different strings", () => {
      expect(isSimilar("Matrix", ["Inception"], 0.8)).toBe(false);
    });

    it("should return false when similarity is below threshold", () => {
      // "Mat" vs "Matrix" = 3 char difference, 6 chars = 50% similarity
      expect(isSimilar("Mat", ["Matrix"], 0.8)).toBe(false);
    });

    it("should return false for empty input", () => {
      expect(isSimilar("", ["Matrix"], 0.8)).toBe(false);
    });

    it("should return false when no targets match", () => {
      expect(isSimilar("Avatar", ["Matrix", "Inception"], 0.8)).toBe(false);
    });

    it("should return false when all targets are too different", () => {
      expect(isSimilar("Xyz", ["Matrix", "Inception", "Avatar"], 0.8)).toBe(
        false
      );
    });
  });

  describe("Edge cases", () => {
    it("should return false for empty targets array", () => {
      expect(isSimilar("Matrix", [], 0.8)).toBe(false);
    });

    it("should handle empty strings in targets", () => {
      expect(isSimilar("Matrix", [""], 0.8)).toBe(false);
      expect(isSimilar("", [""], 1.0)).toBe(true);
    });

    it("should work with threshold of 1.0 (exact match only)", () => {
      expect(isSimilar("Matrix", ["Matrix"], 1.0)).toBe(true);
      expect(isSimilar("Matric", ["Matrix"], 1.0)).toBe(false);
    });

    it("should work with threshold of 0.0 (any string matches)", () => {
      expect(isSimilar("Anything", ["Completely Different"], 0.0)).toBe(true);
    });

    it("should handle accented characters", () => {
      expect(isSimilar("Amélie", ["Amelie"], 0.8)).toBe(true);
    });

    it("should handle special characters", () => {
      expect(isSimilar("The Matrix!", ["The Matrix"], 0.9)).toBe(true);
    });
  });

  describe("Real-world movie title scenarios", () => {
    it("should match common typos in movie titles", () => {
      expect(isSimilar("The Dark Knigt", ["The Dark Knight"], 0.9)).toBe(true);
      expect(isSimilar("Pulp Ficton", ["Pulp Fiction"], 0.85)).toBe(true);
      expect(
        isSimilar("The Shwshank Redemption", ["The Shawshank Redemption"], 0.85)
      ).toBe(true);
    });

    it("should match movie titles with articles variations", () => {
      const targets = ["Matrix", "The Matrix"];
      expect(isSimilar("Matrix", targets, 0.8)).toBe(true);
      expect(isSimilar("The Matrix", targets, 0.8)).toBe(true);
    });

    it("should handle subtitle differences", () => {
      const targets = ["Star Wars", "Star Wars: A New Hope"];
      expect(isSimilar("Star Wars", targets, 0.8)).toBe(true);
    });

    it("should match alternative titles", () => {
      const titles = ["Blade Runner", "Blade Runner: The Final Cut"];
      expect(isSimilar("Blade Runner", titles, 0.8)).toBe(true);
      expect(isSimilar("Blade Runner The Final Cut", titles, 0.8)).toBe(true);
    });
  });

  describe("Custom threshold behavior", () => {
    it("should respect custom threshold of 0.9 (90%)", () => {
      // "Matric" vs "Matrix" = ~83% similarity
      expect(isSimilar("Matric", ["Matrix"], 0.9)).toBe(false);
      expect(isSimilar("Matrix", ["Matrix"], 0.9)).toBe(true);
    });

    it("should respect custom threshold of 0.7 (70%)", () => {
      // "Matr" vs "Matrix" = 2 deletions, 6 chars = ~67% similarity
      expect(isSimilar("Matr", ["Matrix"], 0.7)).toBe(false);
      expect(isSimilar("Matr", ["Matrix"], 0.6)).toBe(true);
    });

    it("should use default threshold of 0.8 when not specified", () => {
      expect(isSimilar("Matric", ["Matrix"])).toBe(true);
      expect(isSimilar("Matr", ["Matrix"])).toBe(false);
    });
  });
});
