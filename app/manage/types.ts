import type {
  Post,
  PostsBySession,
  AcksByPost,
  SessionStatus,
  StatusesBySession,
  Lesson,
  SessionMetaOverride,
  OverridesBySession,
} from "@/lib/class-manage-db";
import type { PostKind, SessionMeta } from "./data";

export type {
  Post,
  PostsBySession,
  AcksByPost,
  PostKind,
  SessionStatus,
  StatusesBySession,
  Lesson,
  SessionMetaOverride,
  OverridesBySession,
  SessionMeta,
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
  sessions: SessionMeta[];
}
