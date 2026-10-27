import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PaymentCondition = 'pix' | 'parcelado';

export interface CartItem {
  key: string;
  productId: number;
  slug: string;
  name: string;
  brandName?: string | null;
  mainImage?: string | null;
  variantId?: number | null;
  variantLabel?: string | null;
  quantity: number;
  unitPricePix: number;
  unitPriceFull: number;
  condition: PaymentCondition;
  installments?: number | null;
  installmentMax?: number | null;
  installmentInterestFree?: boolean;
}

function itemKey(productId: number, variantId?: number | null): string {
  return `${productId}:${variantId ?? 'base'}`;
}

function unitPrice(item: CartItem): number {
  return item.condition === 'pix' ? item.unitPricePix : item.unitPriceFull;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'key'>) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  updateCondition: (key: string, condition: PaymentCondition, installments?: number | null) => void;
  clear: () => void;
  totalItems: () => number;
  totalValue: () => number;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const key = itemKey(item.productId, item.variantId);
        set((state) => {
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, key }] };
        });
      },

      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)),
        })),

      updateCondition: (key, condition, installments) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key ? { ...i, condition, installments: installments ?? i.installments } : i,
          ),
        })),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalValue: () => get().items.reduce((sum, i) => sum + unitPrice(i) * i.quantity, 0),
    }),
    {
      name: 'aki-cart',
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartItemUnitPrice(item: CartItem): number {
  return unitPrice(item);
}

export function cartItemLineTotal(item: CartItem): number {
  return unitPrice(item) * item.quantity;
}
