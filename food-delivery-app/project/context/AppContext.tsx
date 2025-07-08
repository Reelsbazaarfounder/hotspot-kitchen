import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useMenuItems, useOrders, useRestaurantSettings, useCoupons } from '@/hooks/useSupabaseData';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  description?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  timestamp: number;
}

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
}

export interface AppState {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  isAdmin: boolean;
  contactNumber: string;
  offerBanner: string;
  appNameImage?: string;
  coupons: { code: string; discount: number }[];
  userProfile: UserProfile;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_RESTAURANT_SETTINGS'; payload: { contactNumber: string; offerBanner: string; appNameImage?: string } }
  | { type: 'SET_COUPONS'; payload: { code: string; discount: number }[] }
  | { type: 'ADD_TO_CART'; payload: MenuItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'PLACE_ORDER'; payload: Omit<Order, 'id' | 'timestamp'> }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'SET_ADMIN'; payload: boolean }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: string }
  | { type: 'UPDATE_CONTACT'; payload: string }
  | { type: 'UPDATE_OFFER_BANNER'; payload: string }
  | { type: 'UPDATE_APP_NAME_IMAGE'; payload: string }
  | { type: 'ADD_COUPON'; payload: { code: string; discount: number } }
  | { type: 'UPDATE_USER_PROFILE'; payload: UserProfile };

const initialState: AppState = {
  menuItems: [],
  cart: [],
  orders: [],
  isAdmin: false,
  contactNumber: '9035698277',
  offerBanner: 'Special Offer: Get 20% off on orders above ₹500!',
  appNameImage: undefined,
  coupons: [],
  userProfile: {
    name: '',
    phone: '',
    address: '',
  },
  loading: true,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_RESTAURANT_SETTINGS':
      return { 
        ...state, 
        contactNumber: action.payload.contactNumber,
        offerBanner: action.payload.offerBanner,
        appNameImage: action.payload.appNameImage,
      };
    case 'SET_COUPONS':
      return { ...state, coupons: action.payload };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'PLACE_ORDER':
      return {
        ...state,
        cart: [],
      };
    case 'SET_ADMIN':
      return {
        ...state,
        isAdmin: action.payload,
      };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  placeOrder: (order: Omit<Order, 'id' | 'timestamp'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  updateRestaurantSettings: (settings: { contactNumber?: string; offerBanner?: string; appNameImage?: string }) => Promise<void>;
  addCoupon: (coupon: { code: string; discount: number }) => Promise<void>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const { menuItems, loading: menuLoading, error: menuError } = useMenuItems();
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();
  const { settings, loading: settingsLoading, error: settingsError } = useRestaurantSettings();
  const { coupons, loading: couponsLoading, error: couponsError } = useCoupons();

  useEffect(() => {
    if (menuItems) {
      dispatch({ type: 'SET_MENU_ITEMS', payload: menuItems });
    }
  }, [menuItems]);

  useEffect(() => {
    if (orders) {
      const transformedOrders = orders.map(order => ({
        id: order.id,
        items: order.items,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        total: order.total,
        status: order.status,
        timestamp: new Date(order.created_at).getTime(),
      }));
      dispatch({ type: 'SET_ORDERS', payload: transformedOrders });
    }
  }, [orders]);

  useEffect(() => {
    if (settings) {
      dispatch({ 
        type: 'SET_RESTAURANT_SETTINGS', 
        payload: {
          contactNumber: settings.contact_number,
          offerBanner: settings.offer_banner,
          appNameImage: settings.app_name_image,
        }
      });
    }
  }, [settings]);

  useEffect(() => {
    if (coupons) {
      const transformedCoupons = coupons.map(coupon => ({
        code: coupon.code,
        discount: coupon.discount,
      }));
      dispatch({ type: 'SET_COUPONS', payload: transformedCoupons });
    }
  }, [coupons]);

  useEffect(() => {
    const loading = menuLoading || ordersLoading || settingsLoading || couponsLoading;
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [menuLoading, ordersLoading, settingsLoading, couponsLoading]);

  useEffect(() => {
    const error = menuError || ordersError || settingsError || couponsError;
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [menuError, ordersError, settingsError, couponsError]);

  const placeOrder = async (order: Omit<Order, 'id' | 'timestamp'>) => {
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          customer_address: order.customerAddress,
          items: order.items,
          total: order.total,
          status: order.status,
        });

      if (error) throw error;
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          image: item.image,
          available: item.available,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const updateMenuItem = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          image: item.image,
          available: item.available,
        })
        .eq('id', item.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  const updateRestaurantSettings = async (settings: { contactNumber?: string; offerBanner?: string; appNameImage?: string }) => {
    try {
      const updateData: any = {};
      if (settings.contactNumber) updateData.contact_number = settings.contactNumber;
      if (settings.offerBanner) updateData.offer_banner = settings.offerBanner;
      if (settings.appNameImage !== undefined) updateData.app_name_image = settings.appNameImage;

      const { data: existingSettings } = await supabase
        .from('restaurant_settings')
        .select('id')
        .limit(1)
        .single();

      if (existingSettings) {
        const { error } = await supabase
          .from('restaurant_settings')
          .update(updateData)
          .eq('id', existingSettings.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating restaurant settings:', error);
      throw error;
    }
  };

  const addCoupon = async (coupon: { code: string; discount: number }) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: coupon.code.toUpperCase(),
          discount: coupon.discount,
          active: true,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding coupon:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch,
      placeOrder,
      updateOrderStatus,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      updateRestaurantSettings,
      addCoupon,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}