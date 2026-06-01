import { resolveAmazonProductImageUrl } from "../lib/amazon-image";

const url = process.argv[2] ?? "https://a.co/d/0hoVlPOG";

resolveAmazonProductImageUrl(url).then((img) => {
  console.log("input:", url);
  console.log("resolved:", img ?? "(none)");
});
