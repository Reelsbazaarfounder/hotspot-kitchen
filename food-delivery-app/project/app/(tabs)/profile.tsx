import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MapPin, Clock, Star, ShoppingBag, User, CreditCard as Edit3, LogIn } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { state, dispatch } = useAppContext();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    id: '',
    password: '',
  });
  const [profileData, setProfileData] = useState({
    name: state.userProfile.name,
    phone: state.userProfile.phone,
    address: state.userProfile.address,
  });

  const handleCall = () => {
    Linking.openURL(`tel:${state.contactNumber}`);
  };

  const handleOrderTracking = () => {
    router.push('/order-tracking');
  };

  const handleAdminLogin = () => {
    if (adminCredentials.id === 'mruthyunnjaya@143' && adminCredentials.password === 'Raj@14321') {
      dispatch({ type: 'SET_ADMIN', payload: true });
      setShowAdminLogin(false);
      setAdminCredentials({ id: '', password: '' });
      router.push('/admin');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const handleSaveProfile = () => {
    if (profileData.phone && profileData.phone.length !== 10) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits');
      return;
    }
    
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: profileData });
    setShowEditProfile(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const openEditProfile = () => {
    setProfileData({
      name: state.userProfile.name,
      phone: state.userProfile.phone,
      address: state.userProfile.address,
    });
    setShowEditProfile(true);
  };

  const openAdminLogin = () => {
    setAdminCredentials({ id: '', password: '' });
    setShowAdminLogin(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileIcon}>
              <User size={32} color="#DC2626" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {state.userProfile.name || 'Guest User'}
              </Text>
              <Text style={styles.profileSubtext}>
                {state.userProfile.phone || 'No phone number'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={openEditProfile}>
              <Edit3 size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
          
          {state.userProfile.address && (
            <View style={styles.addressSection}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.addressText}>{state.userProfile.address}</Text>
            </View>
          )}
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantCard}>
          <Text style={styles.restaurantName}>Hotspot Kitchen</Text>
          <Text style={styles.restaurantSubtitle}>A Hotel & Restaurant</Text>
          
          <View style={styles.infoRow}>
            <Phone size={16} color="#6B7280" />
            <Text style={styles.infoText}>{state.contactNumber}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.infoText}>Karatagi, City</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.infoText}>Open: 10:00 AM - 11:00 PM</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Star size={16} color="#F59E0B" />
            <Text style={styles.infoText}>4.5 Rating • 1000+ Reviews</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleCall}>
            <View style={styles.actionIcon}>
              <Phone size={20} color="#DC2626" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Call Restaurant</Text>
              <Text style={styles.actionSubtitle}>Get in touch directly</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleOrderTracking}>
            <View style={styles.actionIcon}>
              <ShoppingBag size={20} color="#DC2626" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Track Orders</Text>
              <Text style={styles.actionSubtitle}>Check your order status</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Orders</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{state.orders.length}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {state.orders.filter(o => o.status === 'delivered').length}
              </Text>
              <Text style={styles.statLabel}>Delivered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {state.orders.filter(o => o.status !== 'delivered').length}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.cardTitle}>About Hotspot Kitchen</Text>
          <Text style={styles.aboutText}>
            Welcome to Hotspot Kitchen, your premier destination for authentic and delicious cuisine. 
            We pride ourselves on serving fresh, high-quality dishes prepared with love and care. 
            From traditional favorites to modern fusion, our extensive menu has something for everyone.
          </Text>
          <Text style={styles.aboutText}>
            Our commitment to excellence extends beyond just great food - we strive to provide 
            exceptional service and a memorable dining experience for all our customers.
          </Text>
        </View>

        {/* App Info */}
        <View style={styles.appInfoCard}>
          <Text style={styles.cardTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>January 2025</Text>
          </View>
        </View>

        {/* Admin Login Button */}
        <View style={styles.adminSection}>
          <TouchableOpacity 
            style={styles.adminLoginButton} 
            onPress={openAdminLogin}
          >
            <LogIn size={16} color="#92400E" />
            <Text style={styles.adminLoginText}>Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Extra spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Full Name"
              value={profileData.name}
              onChangeText={(text) => setProfileData({ ...profileData, name: text })}
              placeholderTextColor="#9CA3AF"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Phone Number (10 digits)"
              value={profileData.phone}
              onChangeText={(text) => {
                // Only allow numbers and limit to 10 digits
                const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
                setProfileData({ ...profileData, phone: numericText });
              }}
              keyboardType="numeric"
              maxLength={10}
              placeholderTextColor="#9CA3AF"
            />
            
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder="Address"
              value={profileData.address}
              onChangeText={(text) => setProfileData({ ...profileData, address: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowEditProfile(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Admin Login Modal */}
      <Modal
        visible={showAdminLogin}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAdminLogin(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.adminModalContent}>
            <Text style={styles.adminModalTitle}>Admin Login</Text>
            
            <TextInput
              style={styles.adminInput}
              placeholder="Admin ID"
              value={adminCredentials.id}
              onChangeText={(text) => setAdminCredentials({ ...adminCredentials, id: text })}
              placeholderTextColor="#92400E"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.adminInput}
              placeholder="Password"
              value={adminCredentials.password}
              onChangeText={(text) => setAdminCredentials({ ...adminCredentials, password: text })}
              placeholderTextColor="#92400E"
              secureTextEntry
            />
            
            <View style={styles.adminModalButtons}>
              <TouchableOpacity 
                style={styles.adminCancelButton} 
                onPress={() => {
                  setShowAdminLogin(false);
                  setAdminCredentials({ id: '', password: '' });
                }}
              >
                <Text style={styles.adminCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adminLoginButtonModal} onPress={handleAdminLogin}>
                <Text style={styles.adminLoginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 4,
  },
  profileSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    padding: 8,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  addressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  restaurantCard: {
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
  restaurantName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 4,
  },
  restaurantSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  actionsCard: {
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
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#DC2626',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  aboutCard: {
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
  aboutText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  appInfoCard: {
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
  infoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1F2937',
  },
  adminSection: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  adminLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  adminLoginText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#92400E',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  adminModalContent: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  adminModalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#92400E',
    marginBottom: 20,
    textAlign: 'center',
  },
  adminInput: {
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#92400E',
    marginBottom: 16,
    backgroundColor: '#FFFBEB',
  },
  adminModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  adminCancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  adminCancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#92400E',
  },
  adminLoginButtonModal: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
  },
  adminLoginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});