import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  categories,
  newsletterSubscribers,
  posts,
  users,
} from "@/lib/db/schema";

const CATEGORY_SEED = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    name: "Kitchen Gadgets",
    slug: "kitchen-gadgets",
    description:
      "Small appliances, knives, organizers, and clever tools for the kitchen.",
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    name: "Home Tech",
    slug: "home-tech",
    description: "Smart home gear, audio, lighting, and everyday electronics.",
  },
  {
    id: "11111111-1111-1111-1111-111111111103",
    name: "Fitness Gear",
    slug: "fitness-gear",
    description:
      "Recovery tools, wearables, weights, and training accessories.",
  },
] as const;

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@reviewmax.local")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD;

  if (!password) {
    console.warn(
      "Skipping admin seed: set ADMIN_INITIAL_PASSWORD to create the first admin user.",
    );
    return;
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    console.log(`Admin user already exists for ${email}`);
    return;
  }

  const passwordHash = await hash(password, 12);
  await db.insert(users).values({
    email,
    passwordHash,
    role: "admin",
    fullName: "ReviewMax Admin",
  });

  console.log(`Created admin user: ${email}`);
}

async function seedCategories() {
  for (const category of CATEGORY_SEED) {
    await db
      .insert(categories)
      .values(category)
      .onConflictDoNothing({ target: categories.slug });
  }
  console.log("Seeded categories");
}

async function seedPosts() {
  const samplePosts = [
    {
      title:
        "ThermoBlend Pro Immersion Blender Review: soups without the splatter",
      slug: "thermoblend-pro-immersion-blender-review",
      excerpt:
        "A powerful immersion blender that handles hot soups, smoothies, and baby food with less mess—here is how it performed in real-world tests.",
      body: `After two weeks of daily use, the ThermoBlend Pro felt like the rare kitchen gadget that earns its drawer space. The motor has two steady speeds plus a pulse mode, and the shaft is long enough for a deep stock pot without feeling top-heavy.

**What we tested**

- Hot butternut squash soup (2 liters)
- Peanut butter smoothie with frozen fruit
- Small-batch pesto and chimichurri

Blending hot liquids can be scary; the blade guard and angled bell kept splash-back surprisingly low compared with older models I have used. Cleanup is simple: twist off the shaft, rinse, and run the dishwasher-safe parts on the top rack.

Noise is moderate—not whisper quiet, but not “wake the baby” loud either. The handle stayed cool during extended blending, and the cord length is generous for countertop work.`,
      categoryId: "11111111-1111-1111-1111-111111111101",
      rating: "4.5",
      pros: [
        "Strong motor; smooth results on tough ingredients",
        "Thoughtful design reduces splatter with hot liquids",
        "Easy-to-clean shaft; dishwasher-safe parts",
        "Comfortable grip for longer blending sessions",
      ],
      cons: [
        "Heavier than basic immersion blenders",
        "No cordless option",
        "Premium price versus entry-level models",
      ],
      verdict:
        "A standout immersion blender for cooks who blend hot soups often. If you only need occasional smoothies, a cheaper model may suffice; for frequent use, this one is worth it.",
      amazonUrl: "https://www.amazon.com/dp/B0PLACEHOLD1",
      imageUrl:
        "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=1200&q=80",
      isPublished: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "PulseBand Air Fitness Tracker Review: lightweight motivation",
      slug: "pulseband-air-fitness-tracker-review",
      excerpt:
        "A slim fitness tracker focused on steps, sleep, and heart rate alerts—see whether it is accurate enough to replace a smartwatch for daily training.",
      body: `The PulseBand Air targets people who want tracking without a bulky screen. In practice, the band is comfortable enough to sleep in, and the clasp stayed secure during runs and kettlebell sessions. Pairing took under a minute using the companion app.

**Accuracy**

Step counts were within ~3% of a control treadmill tally across five-mile sessions. Resting heart rate matched a chest strap within a beat on most mornings. Sleep staging felt directionally helpful—deep sleep aligned with how groggy I felt—even if it is not medical-grade.

**Battery and app**

Battery landed around six days with nightly sleep tracking and daytime notifications disabled. The app is clean but not flashy; you get trends for activity, sleep debt, and HRV-style stress prompts if you enable them.

If you need GPS for outdoor routes without your phone, you will want a different device. For daily accountability and gentle nudges, the PulseBand Air is a compelling mid-range pick.`,
      categoryId: "11111111-1111-1111-1111-111111111103",
      rating: "4.2",
      pros: [
        "Lightweight, low-profile design",
        "Solid battery life for its size",
        "Heart rate alerts felt responsive",
        "Straightforward app with clear trends",
      ],
      cons: [
        "No built-in GPS",
        "Screen is readable but not premium AMOLED",
        "Limited third-party integrations",
      ],
      verdict:
        "Best for walkers, gym-goers, and sleep trackers who do not need a full smartwatch. Serious athletes may still prefer GPS-first hardware.",
      amazonUrl: "https://www.amazon.com/dp/B0PLACEHOLD2",
      imageUrl:
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=80",
      isPublished: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const post of samplePosts) {
    await db.insert(posts).values(post).onConflictDoNothing({ target: posts.slug });
  }

  console.log("Seeded sample posts");
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  await seedAdmin();
  await seedCategories();
  await seedPosts();

  // Touch import so newsletter table exists in schema graph during future seeds.
  void newsletterSubscribers;
}

main()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
