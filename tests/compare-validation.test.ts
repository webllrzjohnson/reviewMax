import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateComparisonPair } from "../lib/compare-validation";
import type { PostWithCategory } from "../types";

function mockPost(overrides: Partial<PostWithCategory> = {}): PostWithCategory {
  return {
    id: "1",
    title: "Product A",
    slug: "product-a",
    excerpt: "Excerpt",
    body: "Body",
    category_id: "cat-1",
    rating: 4.5,
    pros: [],
    cons: [],
    verdict: "Good",
    amazon_url: "https://amazon.com/dp/123",
    image_url: null,
    gallery_urls: [],
    badge: null,
    faqs: [],
    price_at_review: null,
    specs: {},
    is_published: true,
    published_at: "2026-01-01T00:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    category: {
      id: "cat-1",
      name: "Kitchen",
      slug: "kitchen",
      description: null,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    ...overrides,
  };
}

describe("validateComparisonPair", () => {
  it("returns not_found when either post is missing", () => {
    const a = mockPost();
    assert.deepEqual(validateComparisonPair(a, null), {
      ok: false,
      reason: "not_found",
    });
    assert.deepEqual(validateComparisonPair(null, a), {
      ok: false,
      reason: "not_found",
    });
  });

  it("returns same_slug when both slugs match", () => {
    const a = mockPost({ slug: "same-slug" });
    const b = mockPost({ id: "2", slug: "same-slug", title: "Product B" });
    assert.deepEqual(validateComparisonPair(a, b), {
      ok: false,
      reason: "same_slug",
    });
  });

  it("returns different_category when category ids differ", () => {
    const a = mockPost({ category_id: "cat-1" });
    const b = mockPost({
      id: "2",
      slug: "product-b",
      title: "Product B",
      category_id: "cat-2",
    });
    assert.deepEqual(validateComparisonPair(a, b), {
      ok: false,
      reason: "different_category",
    });
  });

  it("returns ok with both posts when valid", () => {
    const a = mockPost();
    const b = mockPost({
      id: "2",
      slug: "product-b",
      title: "Product B",
    });
    const result = validateComparisonPair(a, b);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.posts, [a, b]);
    }
  });
});
