/** Tailwind classes for category-specific accents on cards and badges. */
export type CategoryAccent = {
  badge: string;
  badgeHover: string;
  tile: string;
  tileIcon: string;
  cardBorder: string;
  cardHover: string;
};

const DEFAULT_ACCENT: CategoryAccent = {
  badge:
    "border-primary/25 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15",
  badgeHover: "group-hover:bg-primary/15",
  tile: "hover:border-primary/40 hover:bg-primary/5",
  tileIcon: "bg-primary/10 text-primary group-hover:bg-primary/20",
  cardBorder: "border-l-primary/50",
  cardHover: "hover:border-primary/30 hover:shadow-md",
};

const SLUG_ACCENTS: Record<string, CategoryAccent> = {
  "kitchen-gadgets": {
    badge:
      "border-orange-300/60 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-200",
    badgeHover: "group-hover:bg-orange-100 dark:group-hover:bg-orange-950/70",
    tile: "hover:border-orange-400/40 hover:bg-orange-50/50 dark:hover:bg-orange-950/20",
    tileIcon:
      "bg-orange-100 text-orange-700 group-hover:bg-orange-200 dark:bg-orange-950/60 dark:text-orange-300",
    cardBorder: "border-l-orange-500/70",
    cardHover: "hover:border-orange-300/50 hover:shadow-orange-100/50 dark:hover:shadow-none",
  },
  "home-tech": {
    badge:
      "border-sky-300/60 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200",
    badgeHover: "group-hover:bg-sky-100 dark:group-hover:bg-sky-950/70",
    tile: "hover:border-sky-400/40 hover:bg-sky-50/50 dark:hover:bg-sky-950/20",
    tileIcon:
      "bg-sky-100 text-sky-700 group-hover:bg-sky-200 dark:bg-sky-950/60 dark:text-sky-300",
    cardBorder: "border-l-sky-500/70",
    cardHover: "hover:border-sky-300/50 hover:shadow-sky-100/50 dark:hover:shadow-none",
  },
  "fitness-gear": {
    badge:
      "border-emerald-300/60 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
    badgeHover: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/70",
    tile: "hover:border-emerald-400/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
    tileIcon:
      "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300",
    cardBorder: "border-l-emerald-500/70",
    cardHover:
      "hover:border-emerald-300/50 hover:shadow-emerald-100/50 dark:hover:shadow-none",
  },
  "home-goods": {
    badge:
      "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
    badgeHover: "group-hover:bg-amber-100 dark:group-hover:bg-amber-950/70",
    tile: "hover:border-amber-400/40 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
    tileIcon:
      "bg-amber-100 text-amber-700 group-hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300",
    cardBorder: "border-l-amber-500/70",
    cardHover: "hover:border-amber-300/50 hover:shadow-amber-100/50 dark:hover:shadow-none",
  },
  "home-garden": {
    badge:
      "border-lime-300/60 bg-lime-50 text-lime-900 dark:border-lime-800 dark:bg-lime-950/50 dark:text-lime-200",
    badgeHover: "group-hover:bg-lime-100 dark:group-hover:bg-lime-950/70",
    tile: "hover:border-lime-400/40 hover:bg-lime-50/50 dark:hover:bg-lime-950/20",
    tileIcon:
      "bg-lime-100 text-lime-700 group-hover:bg-lime-200 dark:bg-lime-950/60 dark:text-lime-300",
    cardBorder: "border-l-lime-500/70",
    cardHover: "hover:border-lime-300/50 hover:shadow-lime-100/50 dark:hover:shadow-none",
  },
  "beauty-personal-care": {
    badge:
      "border-fuchsia-300/60 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-800 dark:bg-fuchsia-950/50 dark:text-fuchsia-200",
    badgeHover: "group-hover:bg-fuchsia-100 dark:group-hover:bg-fuchsia-950/70",
    tile: "hover:border-fuchsia-400/40 hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-950/20",
    tileIcon:
      "bg-fuchsia-100 text-fuchsia-700 group-hover:bg-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-300",
    cardBorder: "border-l-fuchsia-500/70",
    cardHover:
      "hover:border-fuchsia-300/50 hover:shadow-fuchsia-100/50 dark:hover:shadow-none",
  },
  beauty: {
    badge:
      "border-fuchsia-300/60 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-800 dark:bg-fuchsia-950/50 dark:text-fuchsia-200",
    badgeHover: "group-hover:bg-fuchsia-100 dark:group-hover:bg-fuchsia-950/70",
    tile: "hover:border-fuchsia-400/40 hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-950/20",
    tileIcon:
      "bg-fuchsia-100 text-fuchsia-700 group-hover:bg-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-300",
    cardBorder: "border-l-fuchsia-500/70",
    cardHover:
      "hover:border-fuchsia-300/50 hover:shadow-fuchsia-100/50 dark:hover:shadow-none",
  },
  watches: {
    badge:
      "border-violet-300/60 bg-violet-50 text-violet-900 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200",
    badgeHover: "group-hover:bg-violet-100 dark:group-hover:bg-violet-950/70",
    tile: "hover:border-violet-400/40 hover:bg-violet-50/50 dark:hover:bg-violet-950/20",
    tileIcon:
      "bg-violet-100 text-violet-700 group-hover:bg-violet-200 dark:bg-violet-950/60 dark:text-violet-300",
    cardBorder: "border-l-violet-500/70",
    cardHover:
      "hover:border-violet-300/50 hover:shadow-violet-100/50 dark:hover:shadow-none",
  },
  outdoors: {
    badge:
      "border-teal-300/60 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200",
    badgeHover: "group-hover:bg-teal-100 dark:group-hover:bg-teal-950/70",
    tile: "hover:border-teal-400/40 hover:bg-teal-50/50 dark:hover:bg-teal-950/20",
    tileIcon:
      "bg-teal-100 text-teal-700 group-hover:bg-teal-200 dark:bg-teal-950/60 dark:text-teal-300",
    cardBorder: "border-l-teal-500/70",
    cardHover: "hover:border-teal-300/50 hover:shadow-teal-100/50 dark:hover:shadow-none",
  },
};

export function categoryAccentForSlug(slug: string): CategoryAccent {
  return SLUG_ACCENTS[slug] ?? DEFAULT_ACCENT;
}

/** Formats category names for hero copy: "A, B, and C". */
export function formatCategoryList(names: string[]): string {
  const filtered = names.map((n) => n.trim()).filter(Boolean);
  if (filtered.length === 0) {
    return "kitchen, tech, fitness, and home";
  }
  if (filtered.length === 1) return filtered[0]!;
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(", ")}, and ${filtered.at(-1)}`;
}
