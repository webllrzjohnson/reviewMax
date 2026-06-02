export type CategoryFaq = {
  question: string;
  answer: string;
};

export type CategoryGuideContent = {
  /** Intro paragraphs shown under the page title. */
  intro: string[];
  /** Short checklist of what we evaluate in this category. */
  tips: string[];
  faqs: CategoryFaq[];
};

type CategoryInput = {
  name: string;
  slug: string;
  description: string | null;
};

const GENERIC_TIPS = [
  "Build quality and materials that hold up to daily use",
  "Value for money at common price points on Amazon",
  "Real-world pros and cons—not just marketing claims",
  "Clear verdicts so you can decide quickly",
];

const GENERIC_FAQS: CategoryFaq[] = [
  {
    question: "How does Verdict rank products in this category?",
    answer:
      "We publish in-depth reviews with star ratings, pros and cons, and a bottom-line verdict. Our best-of roundups rank products by rating and editorial quality within the same category.",
  },
  {
    question: "Do your links affect the verdict?",
    answer:
      "No. Verdict earns commissions from qualifying Amazon purchases, but affiliate relationships do not change our ratings or recommendations. See our affiliate disclosure for details.",
  },
  {
    question: "How often are reviews updated?",
    answer:
      "We revisit reviews when products change, prices shift significantly, or newer models launch. Check the “Updated” date on each review for the latest pass.",
  },
  {
    question: "Can I compare two products side by side?",
    answer:
      "Yes. Use Compare on any category or blog page to pick two reviews, or open our best-of roundup and use the compare shortcut for the top two picks.",
  },
];

const SLUG_GUIDES: Record<
  string,
  Pick<CategoryGuideContent, "intro" | "tips" | "faqs">
> = {
  "kitchen-gadgets": {
    intro: [
      "The right kitchen tools save time and make cooking more consistent—from blenders and air fryers to small appliances you use every day.",
    ],
    tips: [
      "Ease of cleaning and dishwasher-safe parts",
      "Motor power, capacity, and noise for appliances",
      "Safety features and stable construction",
      "Whether accessories are included or sold separately",
      ...GENERIC_TIPS.slice(0, 2),
    ],
    faqs: [
      {
        question: "What kitchen gadgets are worth buying?",
        answer:
          "Prioritize tools you will use weekly, not novelty one-offs. Our top-rated picks highlight versatile appliances with strong owner feedback and clear tradeoffs.",
      },
      {
        question: "Should I buy the cheapest option on Amazon?",
        answer:
          "Not always. Budget models can work for light use, but weak motors, thin plastics, and short warranties often cost more over time. Our reviews call out where paying more—or less—makes sense.",
      },
      ...GENERIC_FAQS.slice(0, 2),
    ],
  },
  "home-tech": {
    intro: [
      "Home tech should simplify your space—not add friction. We review smart home gear, connectivity, and everyday electronics with setup, reliability, and privacy in mind.",
    ],
    tips: [
      "Setup steps and compatibility with your phone or ecosystem",
      "App quality, firmware updates, and privacy controls",
      "Real-world range, battery life, or throughput",
      "Whether subscriptions are required for core features",
      ...GENERIC_TIPS.slice(0, 2),
    ],
    faqs: [
      {
        question: "Do smart home devices need a hub?",
        answer:
          "It depends on the protocol. Many Wi-Fi devices work standalone; Matter, Zigbee, or Z-Wave gear may need a hub or compatible border router. We note requirements in each review.",
      },
      {
        question: "How do you score home tech products?",
        answer:
          "We weight everyday usability, reliability, and value. A feature-rich device that is hard to configure will score lower than a simpler product that works consistently.",
      },
      ...GENERIC_FAQS.slice(0, 2),
    ],
  },
  "fitness-gear": {
    intro: [
      "Fitness gear should match how you actually train—whether that is tracking workouts, recovering faster, or equipping a home gym without wasting money on hype.",
    ],
    tips: [
      "Comfort, fit, and sizing for wearables and apparel",
      "Accuracy of health metrics you care about most",
      "Durability under sweat, impact, or daily carry",
      "Battery life and companion app quality",
      ...GENERIC_TIPS.slice(0, 2),
    ],
    faqs: [
      {
        question: "Are expensive fitness trackers worth it?",
        answer:
          "Premium models help if you need advanced metrics, longer battery life, or better GPS. Casual users often do well with mid-range options—we break down who each product fits in every review.",
      },
      {
        question: "Can I trust heart-rate and calorie estimates?",
        answer:
          "Wrist-based sensors vary by activity. Treat numbers as trends, not medical readings. We note accuracy caveats when they matter for a product category.",
      },
      ...GENERIC_FAQS.slice(0, 2),
    ],
  },
  watches: {
    intro: [
      "Watches blend style, daily wear comfort, and tech features. We review fitness watches and everyday wearables with battery life, display readability, and app ecosystems in mind.",
    ],
    tips: [
      "Battery life in typical use (not just spec-sheet claims)",
      "Display visibility outdoors and always-on options",
      "GPS and workout tracking for your sports",
      "Band comfort and availability of replacements",
      ...GENERIC_TIPS.slice(0, 2),
    ],
    faqs: [
      {
        question: "Garmin vs Apple Watch—how do I choose?",
        answer:
          "Apple Watch fits iPhone users who want deep app integration. Garmin excels at battery life and outdoor sports metrics. Use our compare tool on two models you are considering.",
      },
      ...GENERIC_FAQS.slice(0, 3),
    ],
  },
};

export function getCategoryGuideContent(
  category: CategoryInput,
): CategoryGuideContent {
  const slugGuide = SLUG_GUIDES[category.slug];
  const intro: string[] = [];

  if (category.description?.trim()) {
    intro.push(category.description.trim());
  }

  if (slugGuide?.intro.length) {
    for (const paragraph of slugGuide.intro) {
      if (!intro.includes(paragraph)) intro.push(paragraph);
    }
  }

  if (intro.length === 0) {
    intro.push(
      `Shopping for ${category.name.toLowerCase()}? Our reviews cut through the noise with clear ratings, pros and cons, and verdicts you can trust before you buy on Amazon.`,
    );
  }

  return {
    intro,
    tips: slugGuide?.tips ?? GENERIC_TIPS,
    faqs: slugGuide?.faqs ?? GENERIC_FAQS,
  };
}
