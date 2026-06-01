import type { Deal, UserProfile } from "@/lib/types";

export const currentUser: UserProfile = {
  id: "user-1",
  name: "토라유저",
  email: "user@torahotdeal.kr",
  totalPoints: 4200,
  withdrawablePoints: 3000
};

export const deals: Deal[] = [
  {
    id: "deal-1",
    title: "무선 소음 차단 헤드폰",
    originalPrice: 329000,
    salePrice: 149000,
    url: "https://example.com/headphone",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "정가 대비 반값 수준의 무선 헤드폰 특가입니다.",
    mall: "ExampleMall",
    votes: 128,
    status: "approved",
    isTop: true,
    createdAt: "2026-06-02T07:00:00+09:00",
    authorId: "user-1"
  },
  {
    id: "deal-2",
    title: "로봇 청소기 프리미엄 모델",
    originalPrice: 799000,
    salePrice: 499000,
    url: "https://shop.example.com/robot",
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80",
    description: "쿠폰 적용 시 30만원 할인되는 청소기 딜입니다.",
    mall: "Shop",
    votes: 96,
    status: "approved",
    isTop: true,
    createdAt: "2026-06-02T06:30:00+09:00",
    authorId: "user-2"
  },
  {
    id: "deal-3",
    title: "4K 게이밍 모니터 27형",
    originalPrice: 549000,
    salePrice: 259000,
    url: "https://market.example.com/monitor",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    description: "고주사율 4K 모니터 재고 한정 특가입니다.",
    mall: "Market",
    votes: 88,
    status: "approved",
    isTop: true,
    createdAt: "2026-06-02T05:20:00+09:00",
    authorId: "user-3"
  },
  {
    id: "deal-4",
    title: "대용량 에어프라이어",
    originalPrice: 189000,
    salePrice: 79000,
    url: "https://kitchen.example.com/air",
    imageUrl: "https://images.unsplash.com/photo-1612201142854-bd549641765f?auto=format&fit=crop&w=900&q=80",
    description: "가정용 대용량 모델 58% 할인입니다.",
    mall: "Kitchen",
    votes: 64,
    status: "approved",
    isTop: true,
    createdAt: "2026-06-01T23:10:00+09:00",
    authorId: "user-4"
  },
  {
    id: "deal-5",
    title: "초경량 노트북 14형",
    originalPrice: 1299000,
    salePrice: 899000,
    url: "https://tech.example.com/laptop",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    description: "카드 할인 포함 40만원 절감 가능한 노트북입니다.",
    mall: "Tech",
    votes: 57,
    status: "approved",
    isTop: true,
    createdAt: "2026-06-01T22:20:00+09:00",
    authorId: "user-5"
  },
  {
    id: "deal-6",
    title: "스마트워치 셀룰러 모델",
    originalPrice: 459000,
    salePrice: 219000,
    url: "https://wear.example.com/watch",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "재입고 물량 한정 특가입니다.",
    mall: "Wear",
    votes: 41,
    status: "approved",
    isTop: false,
    createdAt: "2026-06-01T18:15:00+09:00",
    authorId: "user-1"
  },
  {
    id: "deal-7",
    title: "블루투스 스피커 방수형",
    originalPrice: 159000,
    salePrice: 69000,
    url: "https://audio.example.com/speaker",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    description: "캠핑 시즌용 방수 스피커 특가입니다.",
    mall: "Audio",
    votes: 35,
    status: "pending",
    isTop: false,
    createdAt: "2026-06-02T08:10:00+09:00",
    authorId: "user-1"
  },
  {
    id: "deal-8",
    title: "캡슐 커피머신 세트",
    originalPrice: 249000,
    salePrice: 129000,
    url: "https://coffee.example.com/machine",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80",
    description: "캡슐 번들 포함 구성입니다.",
    mall: "Coffee",
    votes: 12,
    status: "pending",
    isTop: false,
    createdAt: "2026-06-02T08:30:00+09:00",
    authorId: "user-6"
  }
];

export const approvedDeals = deals.filter((deal) => deal.status === "approved");
export const topDeals = approvedDeals.filter((deal) => deal.isTop).slice(0, 5);
export const latestDeals = [...approvedDeals].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const popularDeals = [...approvedDeals].sort((a, b) => b.votes - a.votes).slice(0, 5);
export const pendingDeals = deals.filter((deal) => deal.status === "pending");
export const myDeals = deals.filter((deal) => deal.authorId === currentUser.id);
