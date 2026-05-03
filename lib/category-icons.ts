import {
  ChefHat,
  Cpu,
  Dumbbell,
  Home,
  LayoutGrid,
  Leaf,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/** Icons for category slugs (DB may define five or more; unknown slugs use LayoutGrid). */
const SLUG_ICONS: Record<string, LucideIcon> = {
  "kitchen-gadgets": ChefHat,
  "home-tech": Cpu,
  "fitness-gear": Dumbbell,
  "home-goods": Home,
  "home-garden": Leaf,
  "beauty-personal-care": Sparkles,
  beauty: Sparkles,
  outdoors: Leaf,
};

export function categoryIconForSlug(slug: string): LucideIcon {
  return SLUG_ICONS[slug] ?? LayoutGrid;
}
