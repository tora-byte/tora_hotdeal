export type DealStatus = "pending" | "approved" | "rejected";

export type Deal = {
  id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  url: string;
  imageUrl: string;
  description: string;
  mall: string;
  votes: number;
  status: DealStatus;
  isTop: boolean;
  createdAt: string;
  authorId: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  withdrawablePoints: number;
};
