import type {
  AdminInfo,
  Banner,
  Brand,
  Category,
  Product,
  ProductDetailResponse,
  ProductListResponse,
  ProductVariant,
  PromotionalBar,
  ServiceRequest,
  ServiceRequestType,
  SiteSettings,
  SocialLink,
  Testimonial,
} from './types';

function baseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3012';
  }
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3012';
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

interface FetchOptions extends RequestInit {
  revalidate?: number | false;
  /** Forwards the incoming request's cookies when running on the server (admin/session-dependent calls only — marks the route dynamic). */
  auth?: boolean;
}

async function serverCookieHeader(): Promise<Record<string, string>> {
  if (typeof window !== 'undefined') return {};
  const { cookies } = await import('next/headers');
  const jar = await cookies();
  const value = jar.toString();
  return value ? { cookie: value } : {};
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { revalidate, headers, auth: needsAuth, ...rest } = options;
  const cookieHeader = needsAuth ? await serverCookieHeader() : {};
  const res = await fetch(`${baseUrl()}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...cookieHeader,
      ...headers,
    },
    ...(revalidate !== undefined ? { next: { revalidate: revalidate === false ? 0 : revalidate } } : {}),
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(res.status, Array.isArray(message) ? message.join(', ') : message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function apiUpload<T>(path: string, file: File, method: 'POST' | 'PATCH' = 'POST'): Promise<T> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    credentials: 'include',
    body: form,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, Array.isArray(message) ? message.join(', ') : message);
  }
  return res.json() as Promise<T>;
}

function qs(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : '';
}

// ---------------------------------------------------------------
// auth
// ---------------------------------------------------------------
export const auth = {
  login: (username: string, password: string) =>
    apiFetch<{ admin: AdminInfo }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => apiFetch<{ ok: boolean }>('/auth/logout', { method: 'POST' }),
  me: () => apiFetch<{ admin: AdminInfo }>('/auth/me', { revalidate: false, auth: true }),
};

// ---------------------------------------------------------------
// categories
// ---------------------------------------------------------------
export const categories = {
  list: () => apiFetch<Category[]>('/categories', { revalidate: 60 }),
  listAdmin: () => apiFetch<Category[]>('/categories/admin', { revalidate: false, auth: true }),
  create: (data: Partial<Category>) =>
    apiFetch<Category>('/categories', { method: 'POST', body: JSON.stringify(data), auth: true }),
  update: (id: number, data: Partial<Category>) =>
    apiFetch<Category>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),
  remove: (id: number) => apiFetch<{ ok: boolean }>(`/categories/${id}`, { method: 'DELETE', auth: true }),
};

// ---------------------------------------------------------------
// brands
// ---------------------------------------------------------------
export const brands = {
  list: () => apiFetch<Brand[]>('/brands', { revalidate: 60 }),
  listAdmin: () => apiFetch<Brand[]>('/brands/admin', { revalidate: false, auth: true }),
  create: (data: Partial<Brand>) => apiFetch<Brand>('/brands', { method: 'POST', body: JSON.stringify(data), auth: true }),
  update: (id: number, data: Partial<Brand>) =>
    apiFetch<Brand>(`/brands/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),
  uploadLogo: (id: number, file: File) => apiUpload<Brand>(`/brands/${id}/logo`, file),
  remove: (id: number) => apiFetch<{ ok: boolean }>(`/brands/${id}`, { method: 'DELETE', auth: true }),
};

// ---------------------------------------------------------------
// products
// ---------------------------------------------------------------
export interface ProductQuery {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  featured?: boolean;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'name';
  page?: number;
  pageSize?: number;
}

export interface VariantInput {
  color?: string;
  storage?: string;
  priceOverride?: number;
  isAvailable?: boolean;
  ordering?: number;
}

export const products = {
  list: (query: ProductQuery = {}) =>
    apiFetch<ProductListResponse>(`/products${qs(query)}`, { revalidate: 30 }),
  bySlug: (slug: string) => apiFetch<ProductDetailResponse>(`/products/${slug}`, { revalidate: 30 }),
  listAdmin: () => apiFetch<Product[]>('/products/admin', { revalidate: false, auth: true }),
  getAdmin: (id: number) => apiFetch<Product>(`/products/admin/${id}`, { revalidate: false, auth: true }),
  create: (data: Record<string, unknown>) =>
    apiFetch<Product>('/products', { method: 'POST', body: JSON.stringify(data), auth: true }),
  update: (id: number, data: Record<string, unknown>) =>
    apiFetch<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),
  remove: (id: number) => apiFetch<{ ok: boolean }>(`/products/${id}`, { method: 'DELETE', auth: true }),
  uploadMainImage: (id: number, file: File) => apiUpload<Product>(`/products/${id}/main-image`, file),
  addImage: (id: number, file: File) => apiUpload<Product>(`/products/${id}/images`, file),
  removeImage: (imageId: number) => apiFetch<{ ok: boolean }>(`/products/images/${imageId}`, { method: 'DELETE', auth: true }),
  addVariant: (id: number, data: VariantInput) =>
    apiFetch<ProductVariant>(`/products/${id}/variants`, { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateVariant: (variantId: number, data: VariantInput) =>
    apiFetch<ProductVariant>(`/products/variants/${variantId}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),
  removeVariant: (variantId: number) =>
    apiFetch<{ ok: boolean }>(`/products/variants/${variantId}`, { method: 'DELETE', auth: true }),
};

// ---------------------------------------------------------------
// banners
// ---------------------------------------------------------------
export const banners = {
  list: () => apiFetch<Banner[]>('/banners', { revalidate: 60 }),
  listAdmin: () => apiFetch<Banner[]>('/banners/admin', { revalidate: false, auth: true }),
  create: (data: Partial<Banner>) => apiFetch<Banner>('/banners', { method: 'POST', body: JSON.stringify(data), auth: true }),
  update: (id: number, data: Partial<Banner>) =>
    apiFetch<Banner>(`/banners/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),
  uploadDesktop: (id: number, file: File) => apiUpload<Banner>(`/banners/${id}/image-desktop`, file),
  uploadMobile: (id: number, file: File) => apiUpload<Banner>(`/banners/${id}/image-mobile`, file),
  remove: (id: number) => apiFetch<{ ok: boolean }>(`/banners/${id}`, { method: 'DELETE', auth: true }),
};

// ---------------------------------------------------------------
// promotional bars
// ---------------------------------------------------------------
export const promotionalBars = {
  list: () => apiFetch<PromotionalBar[]>('/promotional-bars', { revalidate: 60 }),
  listAdmin: () => apiFetch<PromotionalBar[]>('/promotional-bars/admin', { revalidate: false, auth: true }),
  create: (data: Partial<PromotionalBar>) =>
    apiFetch<PromotionalBar>('/promotional-bars', { method: 'POST', body: JSON.stringify(data), auth: true }),
  update: (id: number, data: Partial<PromotionalBar>) =>
    apiFetch<PromotionalBar>(`/promotional-bars/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),
  remove: (id: number) => apiFetch<{ ok: boolean }>(`/promotional-bars/${id}`, { method: 'DELETE', auth: true }),
};

// ---------------------------------------------------------------
// social links
// ---------------------------------------------------------------
export const socialLinks = {
  list: () => apiFetch<SocialLink[]>('/social-links', { revalidate: 60 }),
  listAdmin: () => apiFetch<SocialLink[]>('/social-links/admin', { revalidate: false, auth: true }),
  create: (data: Partial<SocialLink>) =>
    apiFetch<SocialLink>('/social-links', { method: 'POST', body: JSON.stringify(data), auth: true }),
  update: (id: number, data: Partial<SocialLink>) =>
    apiFetch<SocialLink>(`/social-links/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),
  remove: (id: number) => apiFetch<{ ok: boolean }>(`/social-links/${id}`, { method: 'DELETE', auth: true }),
};

// ---------------------------------------------------------------
// settings
// ---------------------------------------------------------------
export const settings = {
  get: () => apiFetch<SiteSettings>('/settings', { revalidate: 60 }),
  update: (values: Record<string, string>) =>
    apiFetch<SiteSettings>('/settings', { method: 'PATCH', body: JSON.stringify({ values }), auth: true }),
  uploadImage: (key: string, file: File) => apiUpload<SiteSettings>(`/settings/upload/${key}`, file),
  uploadVideo: (key: string, file: File) => apiUpload<SiteSettings>(`/settings/upload-video/${key}`, file),
};

// ---------------------------------------------------------------
// testimonials
// ---------------------------------------------------------------
export const testimonials = {
  list: () => apiFetch<Testimonial[]>('/testimonials', { revalidate: 60 }),
  listAdmin: () => apiFetch<Testimonial[]>('/testimonials/admin', { revalidate: false, auth: true }),
  create: (data: Partial<Testimonial>) =>
    apiFetch<Testimonial>('/testimonials', { method: 'POST', body: JSON.stringify(data), auth: true }),
  update: (id: number, data: Partial<Testimonial>) =>
    apiFetch<Testimonial>(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),
  remove: (id: number) => apiFetch<{ ok: boolean }>(`/testimonials/${id}`, { method: 'DELETE', auth: true }),
};

// ---------------------------------------------------------------
// service requests
// ---------------------------------------------------------------
export const serviceRequests = {
  create: (data: {
    type: ServiceRequestType;
    name: string;
    phone: string;
    email?: string;
    deviceModel?: string;
    problemType?: string;
    message?: string;
  }) => apiFetch<ServiceRequest>('/service-requests', { method: 'POST', body: JSON.stringify(data) }),
  list: () => apiFetch<ServiceRequest[]>('/service-requests', { revalidate: false, auth: true }),
  updateStatus: (id: number, status: ServiceRequest['status']) =>
    apiFetch<ServiceRequest>(`/service-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      auth: true,
    }),
};

// ---------------------------------------------------------------
// analytics
// ---------------------------------------------------------------
export const analytics = {
  track: (data: {
    eventType: 'page_view' | 'product_view' | 'whatsapp_click' | 'banner_click';
    productId?: number;
    bannerId?: number;
    page?: string;
  }) =>
    apiFetch<{ ok: boolean }>('/analytics/track', { method: 'POST', body: JSON.stringify(data) }).catch(() => {
      // analytics failures should never break the UI
    }),
};
