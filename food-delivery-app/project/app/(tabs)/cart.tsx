import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

export default function CartScreen() {
  const { state, dispatch } = useAppContext();
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? 
    state.coupons.find(c => c.code === appliedCoupon)?.discount || 0 : 0;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => dispatch({ type: 'CLEAR_CART' }) },
      ]
    );
  };

  const handleApplyCoupon = (couponCode: string) => {
    const coupon = state.coupons.find(c => c.code === couponCode);
    if (coupon) {
      setAppliedCoupon(couponCode);
      Alert.alert('Success', `Coupon applied! ${coupon.discount}% discount`);
    } else {
      Alert.alert('Error', 'Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (state.cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (state.cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyCart}>
          <ShoppingBag size={80} color="#D1D5DB" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Add some delicious items to get started</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/')}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cartContainer} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        {state.cart.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
            <View style={styles.itemActions}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={16} color="#DC2626" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Coupon Section */}
        <View style={styles.couponSection}>
          <Text style={styles.couponTitle}>Available Coupons</Text>
          {state.coupons.map((coupon) => (
            <TouchableOpacity
              key={coupon.code}
              style={[
                styles.couponItem,
                appliedCoupon === coupon.code && styles.couponItemActive,
              ]}
              onPress={() => handleApplyCoupon(coupon.code)}
              disabled={appliedCoupon === coupon.code}
            >
              <Text style={styles.couponCode}>{coupon.code}</Text>
              <Text style={styles.couponDiscount}>{coupon.discount}% OFF</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bill Summary */}
        <View style={styles.billSummary}>
          <Text style={styles.billTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          {appliedCoupon && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Discount ({appliedCoupon})</Text>
              <Text style={styles.billDiscount}>-₹{discountAmount}</Text>
            </View>
          )}
          <View style={[styles.billRow, styles.billTotal]}>
            <Text style={styles.billTotalLabel}>Total</Text>
            <Text style={styles.billTotalValue}>₹{total}</Text>
          </View>
        </View>
        
        {/* Extra spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout • ₹{total}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1F2937',
  },
  clearText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#DC2626',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: '#6B7280',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  cartContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#DC2626',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginRight: 12,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  couponSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  couponTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  couponItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  couponItemActive: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  couponCode: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1F2937',
  },
  couponDiscount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#DC2626',
  },
  billSummary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  billValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  billDiscount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#10B981',
  },
  billTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  billTotalLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  billTotalValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#DC2626',
  },
  bottomSpacing: {
    height: 120,
  },
  checkoutContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
  checkoutButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});