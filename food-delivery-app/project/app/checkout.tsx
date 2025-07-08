import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Phone, MapPin, Check } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

export default function CheckoutScreen() {
  const { state, placeOrder } = useAppContext();
  const [customerName, setCustomerName] = useState(state.userProfile.name || '');
  const [customerPhone, setCustomerPhone] = useState(state.userProfile.phone || '');
  const [customerAddress, setCustomerAddress] = useState(state.userProfile.address || '');
  const [useProfileData, setUseProfileData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const validateForm = () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!customerPhone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (customerPhone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return false;
    }
    if (!customerAddress.trim()) {
      Alert.alert('Error', 'Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handleUseProfileData = () => {
    if (state.userProfile.name && state.userProfile.phone && state.userProfile.address) {
      setCustomerName(state.userProfile.name);
      setCustomerPhone(state.userProfile.phone);
      setCustomerAddress(state.userProfile.address);
      setUseProfileData(true);
      Alert.alert('Success', 'Profile data loaded successfully');
    } else {
      Alert.alert('Error', 'Please complete your profile first in the Profile section');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const order = {
        items: state.cart,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        total,
        status: 'pending' as const,
      };

      await placeOrder(order);
      
      Alert.alert(
        'Order Placed Successfully!',
        'Your order has been received and will be prepared shortly.',
        [
          {
            text: 'Track Order',
            onPress: () => router.replace('/order-tracking'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    // Only allow numbers and limit to 10 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setCustomerPhone(numericText);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {state.cart.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{total}</Text>
          </View>
        </View>

        {/* Use Profile Data Option */}
        {state.userProfile.name && state.userProfile.phone && state.userProfile.address && (
          <View style={styles.profileDataCard}>
            <Text style={styles.sectionTitle}>Quick Fill</Text>
            <TouchableOpacity 
              style={styles.useProfileButton} 
              onPress={handleUseProfileData}
            >
              <Check size={20} color="#10B981" />
              <Text style={styles.useProfileButtonText}>Use My Profile Details</Text>
            </TouchableOpacity>
            <Text style={styles.profilePreview}>
              {state.userProfile.name} • {state.userProfile.phone}
            </Text>
          </View>
        )}

        {/* Customer Details */}
        <View style={styles.customerDetails}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={20} color="#6B7280" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={customerName}
              onChangeText={setCustomerName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Phone size={20} color="#6B7280" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Phone Number (10 digits) *"
              value={customerPhone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <MapPin size={20} color="#6B7280" />
            </View>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Delivery Address *"
              value={customerAddress}
              onChangeText={setCustomerAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentInfo}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            <Text style={styles.paymentSubtext}>Pay when your order arrives</Text>
          </View>
        </View>

        {/* Order Notes */}
        <View style={styles.orderNotes}>
          <Text style={styles.notesTitle}>Important Notes:</Text>
          <Text style={styles.notesText}>• Please ensure someone is available at the delivery address</Text>
          <Text style={styles.notesText}>• Delivery time: 30-45 minutes</Text>
          <Text style={styles.notesText}>• For any issues, call {state.contactNumber}</Text>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.placeOrderContainer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, isLoading && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          <Text style={styles.placeOrderButtonText}>
            {isLoading ? 'Placing Order...' : `Place Order • ₹${total}`}
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
    fontSize: 20,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderSummary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  itemQuantity: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 12,
  },
  itemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#DC2626',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  totalAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#DC2626',
  },
  profileDataCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  useProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    marginBottom: 8,
  },
  useProfileButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#10B981',
    marginLeft: 8,
  },
  profilePreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  customerDetails: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
    paddingRight: 12,
  },
  addressInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  paymentInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentMethod: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  paymentText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  orderNotes: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
  },
  notesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#92400E',
    marginBottom: 8,
  },
  notesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  placeOrderContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  placeOrderButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  placeOrderButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});