export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  ordering: number;
  isActive: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  link: string | null;
  ordering: number;
  isActive: boolean;
}

export interface ProductImage {
  id: number;
  productId: number;
  image: string;
  ordering: number;
}

export interface ProductVariant {
  id: number;
  productId: number;
  color: string | null;
  storage: string | null;
  priceOverride: string | null;
  isAvailable: boolean;
  ordering: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  brandId: number | null;
  categoryId: number | null;
  priceFrom: string | null;
  priceTo: string;
  pricePix: string | null;
  installmentMax: number | null;
  installmentInterestFree: boolean;
  installmentNote: string | null;
  badge: string | null;
  mainImage: string | null;
  ratingAvg: string | null;
  ratingCount: number;
  isDemo: boolean;
  isFeatured: boolean;
  status: 'draft' | 'published';
  ordering: number;
  seoTitle: string | null;
  seoDescription: string | null;
  brand: Brand | null;
  category: Category | null;
  images: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductDetailResponse {
  product: Product;
  related: Product[];
}

export interface Banner {
  id: number;
  internalName: string;
  title: string | null;
  subtitle: string | null;
  imageDesktop: string | null;
  imageMobile: string | null;
  ctaText: string | null;
  url: string | null;
  ordering: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}

export interface PromotionalBar {
  id: number;
  text: string;
  icon: string | null;
  ordering: number;
  isActive: boolean;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  isActive: boolean;
}

export type SiteSettings = Record<string, string>;

export interface Testimonial {
  id: number;
  authorName: string;
  rating: number;
  comment: string;
  context: string | null;
  isActive: boolean;
  ordering: number;
}

export type ServiceRequestType = 'reparo' | 'contato';
export type ServiceRequestStatus = 'novo' | 'em_andamento' | 'concluido';

export interface ServiceRequest {
  id: number;
  type: ServiceRequestType;
  name: string;
  phone: string;
  email: string | null;
  deviceModel: string | null;
  problemType: string | null;
  message: string | null;
  status: ServiceRequestStatus;
  createdAt: string;
}

export interface AdminInfo {
  id: number;
  username: string;
  name: string;
  email?: string;
}
