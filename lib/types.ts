// export type UserRole = "user" | "creator";

// export type OrderStatus =
//   | "pending"
//   | "confirmed"
//   | "in_progress"
//   | "completed"
//   | "cancelled";

// export type CreatorLink = {
//   label: string;
//   url: string;
// };

// export type Profile = {
//   id: string;
//   role: UserRole;
//   full_name: string;
//   email: string;
//   avatar_url: string | null;
//   banner_url: string | null;
//   bio: string | null;
//   craft: string | null;
//   store_name: string | null;
//   city: string | null;
//   state: string | null;
//   whatsapp: string | null;
//   years_experience: number | null;
//   available_for_commissions: boolean;
//   onboarding_complete: boolean | null;
//   created_at: string;
// };

// export type PortfolioItem = {
//   id: string;
//   creator_id: string;
//   image_url: string;
//   title: string | null;
//   caption: string | null;
//   created_at: string;
// };

// export type Product = {
//   id: string;
//   creator_id: string;
//   name: string;
//   description: string;
//   price_inr: number;
//   category: string;
//   image_url: string;
//   is_active: boolean;
//   created_at: string;
//   creator?: Pick<
//     Profile,
//     "id" | "full_name" | "store_name" | "craft" | "city" | "state" | "avatar_url" | "available_for_commissions"
//   >;
// };

// export type Conversation = {
//   id: string;
//   user_id: string;
//   creator_id: string;
//   product_id: string | null;
//   created_at: string;
//   updated_at: string;
//   other_party?: Pick<Profile, "id" | "full_name" | "avatar_url" | "store_name">;
//   product?: Pick<Product, "id" | "name" | "image_url"> | null;
//   last_message?: { body: string; created_at: string; image_url?: string | null } | null;
//   unread_count?: number;
// };

// export type Message = {
//   id: string;
//   conversation_id: string;
//   sender_id: string;
//   body: string;
//   image_url: string | null;
//   read_at: string | null;
//   created_at: string;
// };

// export type ConversationRead = {
//   conversation_id: string;
//   user_id: string;
//   last_read_at: string;
// };

// export type OrderCancelledBy = "customer" | "creator";

// export type CreatorCancelReason =
//   | "Cannot fulfill order"
//   | "Materials unavailable"
//   | "Personal reasons"
//   | "Other";

// export const CREATOR_CANCEL_REASONS: CreatorCancelReason[] = [
//   "Cannot fulfill order",
//   "Materials unavailable",
//   "Personal reasons",
//   "Other",
// ];

// export type Order = {
//   id: string;
//   user_id: string;
//   creator_id: string;
//   product_id: string | null;
//   status: OrderStatus;
//   notes: string | null;
//   custom_request: string | null;
//   /** Snapshot captured at order-placement time — reliable even after product deletion. */
//   product_name_snapshot: string | null;
//   product_image_snapshot: string | null;
//   /** Who cancelled the order — null if not cancelled. */
//   cancelled_by: OrderCancelledBy | null;
//   /** Reason given when a creator cancels. */
//   cancel_reason: string | null;
//   created_at: string;
//   updated_at: string;
//   /** Milestone timestamps — set by DB trigger when status changes. */
//   confirmed_at: string | null;
//   in_progress_at: string | null;
//   completed_at: string | null;
//   cancelled_at: string | null;
//   /** Creator progress updates for this order — joined separately. */
//   order_updates?: OrderUpdate[];
//   /** Joined product row — may be null if product was hard-deleted (legacy) or not joined. */
//   product?: (Pick<Product, "id" | "name" | "image_url" | "price_inr"> & { is_active?: boolean }) | null;
//   customer?: Pick<Profile, "id" | "full_name" | "email"> | null;
// };

// export const PRODUCT_CATEGORIES = [
//   "Pottery & Terracotta",
//   "Textiles & Weaving",
//   "Wood & Carving",
//   "Metal & Brass",
//   "Jewelry & Accessories",
//   "Paper & Folk Art",
//   "Home Décor",
//   "Paintings & Art",
//   "Other",
// ] as const;

// export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

// export const INDIAN_STATES = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Delhi",
//   "Jammu and Kashmir",
//   "Ladakh",
//   "Puducherry",
// ] as const;

// // ── Shared server action return type ────────────────────────
// export type ActionState = {
//   error?: string;
//   success?: boolean;
//   alreadyExists?: boolean;
//   redirectTo?: string;
// };

// // ── Order update (creator progress note) ────────────────────────
// export type OrderUpdate = {
//   id: string;
//   order_id: string;
//   creator_id: string;
//   body: string;
//   created_at: string;
// };

// // ── Notifications ─────────────────────────────────────────────────
// export type NotificationType =
//   | "new_message"
//   | "order_placed"
//   | "order_accepted"
//   | "order_update"
//   | "order_completed"
//   | "order_cancelled";

// export type Notification = {
//   id: string;
//   user_id: string;
//   type: NotificationType;
//   title: string;
//   body: string;
//   is_read: boolean;
//   href: string | null;
//   created_at: string;
// };



// export type UserRole = "user" | "creator";

// export type OrderStatus =
//   | "pending"
//   | "confirmed"
//   | "in_progress"
//   | "completed"
//   | "cancelled";

// export type Profile = {
//   id: string;
//   role: UserRole;
//   full_name: string;
//   email: string;
//   avatar_url: string | null;
//   banner_url: string | null;
//   bio: string | null;
//   craft: string | null;
//   store_name: string | null;
//   city: string | null;
//   state: string | null;
//   whatsapp: string | null;
//   years_experience: number | null;
//   available_for_commissions: boolean;
//   onboarding_complete: boolean | null;
//   created_at: string;
// };

// export type PortfolioItem = {
//   id: string;
//   creator_id: string;
//   image_url: string;
//   title: string | null;
//   caption: string | null;
//   created_at: string;
// };

// export type Product = {
//   id: string;
//   creator_id: string;
//   name: string;
//   description: string;
//   price_inr: number;
//   category: string;
//   image_url: string;
//   is_active: boolean;
//   created_at: string;
//   creator?: Pick<
//     Profile,
//     "id" | "full_name" | "store_name" | "craft" | "city" | "state" | "avatar_url" | "available_for_commissions"
//   >;
// };

// export type Conversation = {
//   id: string;
//   user_id: string;
//   creator_id: string;
//   product_id: string | null;
//   created_at: string;
//   updated_at: string;
//   other_party?: Pick<Profile, "id" | "full_name" | "avatar_url" | "store_name">;
//   product?: Pick<Product, "id" | "name" | "image_url"> | null;
//   last_message?: { body: string; created_at: string; image_url?: string | null } | null;
//   unread_count?: number;
// };

// export type Message = {
//   id: string;
//   conversation_id: string;
//   sender_id: string;
//   body: string;
//   image_url: string | null;
//   read_at: string | null;
//   created_at: string;
// };

// export type ConversationRead = {
//   conversation_id: string;
//   user_id: string;
//   last_read_at: string;
// };

// export type OrderCancelledBy = "customer" | "creator";

// export type CreatorCancelReason =
//   | "Cannot fulfill order"
//   | "Materials unavailable"
//   | "Personal reasons"
//   | "Other";

// export const CREATOR_CANCEL_REASONS: CreatorCancelReason[] = [
//   "Cannot fulfill order",
//   "Materials unavailable",
//   "Personal reasons",
//   "Other",
// ];

// export type Order = {
//   id: string;
//   user_id: string;
//   creator_id: string;
//   product_id: string | null;
//   status: OrderStatus;
//   notes: string | null;
//   custom_request: string | null;
//   /** Snapshot captured at order-placement time — reliable even after product deletion. */
//   product_name_snapshot: string | null;
//   product_image_snapshot: string | null;
//   /** Who cancelled the order — null if not cancelled. */
//   cancelled_by: OrderCancelledBy | null;
//   /** Reason given when a creator cancels. */
//   cancel_reason: string | null;
//   created_at: string;
//   updated_at: string;
//   /** Milestone timestamps — set by DB trigger when status changes. */
//   confirmed_at: string | null;
//   in_progress_at: string | null;
//   completed_at: string | null;
//   cancelled_at: string | null;
//   /** Creator progress updates for this order — joined separately. */
//   order_updates?: OrderUpdate[];
//   /** Joined product row — may be null if product was hard-deleted (legacy) or not joined. */
//   product?: (Pick<Product, "id" | "name" | "image_url" | "price_inr"> & { is_active?: boolean }) | null;
//   customer?: Pick<Profile, "id" | "full_name" | "email"> | null;
// };

// export const PRODUCT_CATEGORIES = [
//   "Pottery & Terracotta",
//   "Textiles & Weaving",
//   "Wood & Carving",
//   "Metal & Brass",
//   "Jewelry & Accessories",
//   "Paper & Folk Art",
//   "Home Décor",
//   "Paintings & Art",
//   "Other",
// ] as const;

// export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

// export const INDIAN_STATES = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Delhi",
//   "Jammu and Kashmir",
//   "Ladakh",
//   "Puducherry",
// ] as const;

// // ── Shared server action return type ────────────────────────
// export type ActionState = {
//   error?: string;
//   success?: boolean;
//   alreadyExists?: boolean;
//   redirectTo?: string;
// };

// // ── Order update (creator progress note) ────────────────────────
// export type OrderUpdate = {
//   id: string;
//   order_id: string;
//   creator_id: string;
//   body: string;
//   created_at: string;
// };

// // ── Notifications ─────────────────────────────────────────────────
// export type NotificationType =
//   | "new_message"
//   | "order_placed"
//   | "order_accepted"
//   | "order_update"
//   | "order_completed"
//   | "order_cancelled";

// export type Notification = {
//   id: string;
//   user_id: string;
//   type: NotificationType;
//   title: string;
//   body: string;
//   is_read: boolean;
//   href: string | null;
//   created_at: string;
// };

// // ── Artisan Stories (home page magazine feature) ──────────────
// export type ArtisanStory = {
//   id: string;
//   artisan_name: string;
//   craft: string;
//   location: string;
//   quote: string;
//   story: string;
//   image_url: string;
//   creator_id: string | null;
//   is_featured: boolean;
//   display_order: number;
//   created_at: string;
//   updated_at: string;
// };

export type CreatorLink = {
  label: string;
  url: string;
};

export type UserRole = "user" | "creator";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  craft: string | null;
  store_name: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  instagram_url: string | null;
  website_url: string | null;
  youtube_url: string | null;
  links: CreatorLink[] | null;
  years_experience: number | null;
  available_for_commissions: boolean;
  onboarding_complete: boolean | null;
  created_at: string;
};

export type PortfolioItem = {
  id: string;
  creator_id: string;
  image_url: string;
  title: string | null;
  caption: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  price_inr: number;
  category: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  creator?: Pick<
    Profile,
    "id" | "full_name" | "store_name" | "craft" | "city" | "state" | "avatar_url" | "available_for_commissions"
  >;
};

export type Conversation = {
  id: string;
  user_id: string;
  creator_id: string;
  product_id: string | null;
  created_at: string;
  updated_at: string;
  other_party?: Pick<Profile, "id" | "full_name" | "avatar_url" | "store_name">;
  product?: Pick<Product, "id" | "name" | "image_url"> | null;
  last_message?: { body: string; created_at: string; image_url?: string | null } | null;
  unread_count?: number;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  image_url: string | null;
  read_at: string | null;
  created_at: string;
};

export type ConversationRead = {
  conversation_id: string;
  user_id: string;
  last_read_at: string;
};

export type OrderCancelledBy = "customer" | "creator";

export type CreatorCancelReason =
  | "Cannot fulfill order"
  | "Materials unavailable"
  | "Personal reasons"
  | "Other";

export const CREATOR_CANCEL_REASONS: CreatorCancelReason[] = [
  "Cannot fulfill order",
  "Materials unavailable",
  "Personal reasons",
  "Other",
];

export type Order = {
  id: string;
  user_id: string;
  creator_id: string;
  product_id: string | null;
  status: OrderStatus;
  notes: string | null;
  custom_request: string | null;
  /** Snapshot captured at order-placement time — reliable even after product deletion. */
  product_name_snapshot: string | null;
  product_image_snapshot: string | null;
  /** Who cancelled the order — null if not cancelled. */
  cancelled_by: OrderCancelledBy | null;
  /** Reason given when a creator cancels. */
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
  /** Milestone timestamps — set by DB trigger when status changes. */
  confirmed_at: string | null;
  in_progress_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  /** Creator progress updates for this order — joined separately. */
  order_updates?: OrderUpdate[];
  /** Joined product row — may be null if product was hard-deleted (legacy) or not joined. */
  product?: (Pick<Product, "id" | "name" | "image_url" | "price_inr"> & { is_active?: boolean }) | null;
  customer?: Pick<Profile, "id" | "full_name" | "email"> | null;
};

export const PRODUCT_CATEGORIES = [
  "Pottery & Terracotta",
  "Textiles & Weaving",
  "Wood & Carving",
  "Metal & Brass",
  "Jewelry & Accessories",
  "Paper & Folk Art",
  "Home Décor",
  "Paintings & Art",
  "Other",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
] as const;

// ── Shared server action return type ────────────────────────
export type ActionState = {
  error?: string;
  success?: boolean;
  alreadyExists?: boolean;
  redirectTo?: string;
};

// ── Order update (creator progress note) ────────────────────────
export type OrderUpdate = {
  id: string;
  order_id: string;
  creator_id: string;
  body: string;
  created_at: string;
};

// ── Notifications ─────────────────────────────────────────────────
export type NotificationType =
  | "new_message"
  | "order_placed"
  | "order_accepted"
  | "order_update"
  | "order_completed"
  | "order_cancelled";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  href: string | null;
  created_at: string;
};

// ── Artisan Stories (home page magazine feature) ──────────────
export type ArtisanStory = {
  id: string;
  artisan_name: string;
  craft: string;
  location: string;
  quote: string;
  story: string;
  image_url: string;
  creator_id: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// ── Home page stats ───────────────────────────────────────────
export type HomeStats = {
  artisanCount: number;
  stateCount: number;
  productCount: number;
};