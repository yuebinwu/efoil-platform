import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定義商品型別
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      
      // 添加商品：如果已存在則數量 +1，否則新增
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),

      // 移除商品
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),

      // 清空購物車
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // 這會將購物車資料存入瀏覽器的 LocalStorage，重整頁面也不會遺失
    }
  )
);