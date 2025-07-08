import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Tag, Gift, Image as ImageIcon } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

export default function AdminSettings() {
  const { state, updateRestaurantSettings, addCoupon } = useAppContext();
  const [contactNumber, setContactNumber] = useState(state.contactNumber);
  const [offerBanner, setOfferBanner] = useState(state.offerBanner);
  const [appNameImage, setAppNameImage] = useState(state.appNameImage || '');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  const handleUpdateContact = async () => {
    if (!contactNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid contact number');
      return;
    }
    try {
      await updateRestaurantSettings({ contactNumber: contactNumber.trim() });
      Alert.alert('Success', 'Contact number updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update contact number');
    }
  };

  const handleUpdateOfferBanner = async () => {
    if (!offerBanner.trim()) {
      Alert.alert('Error', 'Please enter offer banner text');
      return;
    }
    try {
      await updateRestaurantSettings({ offerBanner: offerBanner.trim() });
      Alert.alert('Success', 'Offer banner updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update offer banner');
    }
  };

  const handleUpdateAppNameImage = async () => {
    try {
      await updateRestaurantSettings({ appNameImage: appNameImage.trim() });
      Alert.alert('Success', 'App name image updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update app name image');
    }
  };

  const handleAddCoupon = async () => {
    if (!newCouponCode.trim() || !newCouponDiscount.trim()) {
      Alert.alert('Error', 'Please fill all coupon fields');
      return;
    }

    const discount = parseInt(newCouponDiscount);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      Alert.alert('Error', 'Please enter a valid discount percentage (1-100)');
      return;
    }

    const existingCoupon = state.coupons.find(c => c.code === newCouponCode.trim().toUpperCase());
    if (existingCoupon) {
      Alert.alert('Error', 'Coupon code already exists');
      return;
    }

    try {
      await addCoupon({
        code: newCouponCode.trim().toUpperCase(),
        discount,
      });

      setNewCouponCode('');
      setNewCouponDiscount('');
      Alert.alert('Success', 'Coupon added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add coupon');
    }
  };

  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Number */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <Phone size={24} color="#DC2626" />
            <Text style={styles.settingTitle}>Contact Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateContact}>
            <Text style={styles.updateButtonText}>Update Contact</Text>
          </TouchableOpacity>
        </View>

        {/* App Name Image */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <ImageIcon size={24} color="#DC2626" />
            <Text style={styles.settingTitle}>App Name Image</Text>
          </View>
          <TextInput
            style={styles.input}
            value={appNameImage}
            onChangeText={setAppNameImage}
            placeholder="Enter app name image URL"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateAppNameImage}>
            <Text style={styles.updateButtonText}>Update App Name Image</Text>
          </TouchableOpacity>
        </View>

        {/* Offer Banner */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <Tag size={24} color="#DC2626" />
            <Text style={styles.settingTitle}>Offer Banner</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={offerBanner}
            onChangeText={setOfferBanner}
            placeholder="Enter offer banner text"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateOfferBanner}>
            <Text style={styles.updateButtonText}>Update Banner</Text>
          </TouchableOpacity>
        </View>

        {/* Coupons */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <Gift size={24} color="#DC2626" />
            <Text style={styles.settingTitle}>Coupons</Text>
          </View>

          {/* Existing Coupons */}
          <View style={styles.couponsSection}>
            <Text style={styles.subsectionTitle}>Active Coupons</Text>
            {state.coupons.map((coupon, index) => (
              <View key={index} style={styles.couponItem}>
                <Text style={styles.couponCode}>{coupon.code}</Text>
                <Text style={styles.couponDiscount}>{coupon.discount}% OFF</Text>
              </View>
            ))}
          </View>

          {/* Add New Coupon */}
          <View style={styles.addCouponSection}>
            <Text style={styles.subsectionTitle}>Add New Coupon</Text>
            <TextInput
              style={styles.input}
              value={newCouponCode}
              onChangeText={setNewCouponCode}
              placeholder="Coupon Code (e.g., SAVE20)"
              autoCapitalize="characters"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              value={newCouponDiscount}
              onChangeText={setNewCouponDiscount}
              placeholder="Discount Percentage (e.g., 20)"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddCoupon}>
              <Text style={styles.addButtonText}>Add Coupon</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.settingCard}>
          <Text style={styles.settingTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Restaurant Name:</Text>
            <Text style={styles.infoValue}>Hotspot Kitchen</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Menu Items:</Text>
            <Text style={styles.infoValue}>{state.menuItems.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Orders:</Text>
            <Text style={styles.infoValue}>{state.orders.length}</Text>
          </View>
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  settingCard: {
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
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginLeft: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  couponsSection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  couponItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 8,
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
  addCouponSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1F2937',
  },
});