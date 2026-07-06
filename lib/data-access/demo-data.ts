// Compatibility facade for the existing clickable MVP.
// UI modules import from here instead of depending on the fixture module directly.
export {
  applications,
  documents,
  evidenceItems,
  posts,
  students,
} from "@/lib/data";
export type { Post, Student } from "@/lib/data";
