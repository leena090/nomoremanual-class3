import type {
  Post,
  PostsBySession,
  AcksByPost,
  SessionStatus,
  StatusesBySession,
} from "@/lib/class-manage-db";
import type { PostKind } from "./data";

export type {
  Post,
  PostsBySession,
  AcksByPost,
  PostKind,
  SessionStatus,
  StatusesBySession,
};

export type Mode = "admin" | "student";
export type Layout = "top" | "side" | "stacked";
export type Accent = "orange" | "amber" | "walnut";
export type Density = "cozy" | "comfortable" | "compact";

export type ActiveView = "dashboard" | "students" | `s${number}`;

export interface ManageState {
  posts: PostsBySession;
  acks: AcksByPost;
  statuses: StatusesBySession;
}
