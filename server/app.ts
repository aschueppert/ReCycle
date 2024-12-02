import AuthenticatingConcept from "./concepts/authenticating";
import FriendingConcept from "./concepts/friending";
import GroupingConcept from "./concepts/grouping";
import LocatingConcept from "./concepts/locating";
import NotifyingConcept from "./concepts/notifying";
import PostingConcept from "./concepts/posting";
import ScoringConcept from "./concepts/scoring";
import SessioningConcept from "./concepts/sessioning";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const BinLocating = new LocatingConcept("bins");
export const CosmeticLocating = new LocatingConcept("cosmetics");
export const BadgeGrouping = new GroupingConcept("badges");
export const CosmeticGrouping = new GroupingConcept("cosmetics");
export const ClubGrouping = new GroupingConcept("clubs");
export const Streaks = new ScoringConcept("streaks");
export const Seeds = new ScoringConcept("seeds");
export const Points = new ScoringConcept("points");
export const Notifications = new NotifyingConcept("notifications");
