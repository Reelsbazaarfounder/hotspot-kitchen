import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, CircleCheck as CheckCircle, ChefHat, Truck } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: '#F59E0B' },
  { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: '#10B981' },
  { value: 'preparing', label: 'Preparing', icon: ChefHat, color: '#3B82F6' },
  { value: 'ready', label: 'Ready', icon: Truck, color: '#8B5CF6' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: '#10B981' },
];

export default function OrderManagement() {
  const { state, updateOrderStatus } = useAppContext();

  const handleStatusUpdate = async (orderId: string, newStatus: any) => {
    Alert.alert(
      'Update Status',
      `Change order status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            try {
              await updateOrderStatus(orderId, newStatus);
              Alert.alert('Success', 'Order status updated successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to update order status');
            }
          },
        },
      ]
    );
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Management</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading orders...</Text>
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
        <Text style={styles.headerTitle}>Order Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {state.orders.length === 0 ? (
          <View style={styles.noOrders}>
            <Clock size={80} color="#D1D5DB" />
            <Text style={styles.noOrdersText}>No orders yet</Text>
            <Text style={styles.noOrdersSubtext}>Orders will appear here when customers place them</Text>
          </View>
        ) : (
          state.orders.map((order) => {
            const currentStatus = statusOptions.find(s => s.value === order.status);
            const StatusIcon = currentStatus?.icon || Clock;

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>Order #{order.id.slice(-8)}</Text>
                    <Text style={styles.orderTime}>{formatTime(order.timestamp)}</Text>
                  </View>
                  <View style={styles.orderAmount}>
                    <Text style={styles.amountText}>₹{order.total}</Text>
                  </View>
                </View>

                {/* Customer Details */}
                <View style={styles.customerSection}>
                  <Text style={styles.sectionTitle}>Customer Details</Text>
                  <Text style={styles.customerDetail}>Name: {order.customerName}</Text>
                  <Text style={styles.customerDetail}>Phone: {order.customerPhone}</Text>
                  <Text style={styles.customerDetail}>Address: {order.customerAddress}</Text>
                </View>

                {/* Order Items */}
                <View style={styles.itemsSection}>
                  <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
                  {order.items.map((item) => (
                    <View key={item.id} style={styles.orderItem}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                    </View>
                  ))}
                </View>

                {/* Current Status */}
                <View style={styles.statusSection}>
                  <Text style={styles.sectionTitle}>Current Status</Text>
                  <View style={styles.currentStatus}>
                    <View style={[styles.statusIcon, { backgroundColor: currentStatus?.color + '20' }]}>
                      <StatusIcon size={20} color={currentStatus?.color} />
                    </View>
                    <Text style={styles.statusText}>{currentStatus?.label}</Text>
                  </View>
                </View>

                {/* Status Update Buttons */}
                <View style={styles.statusButtons}>
                  <Text style={styles.sectionTitle}>Update Status</Text>
                  <View style={styles.buttonGrid}>
                    {statusOptions.map((status) => (
                      <TouchableOpacity
                        key={status.value}
                        style={[
                          styles.statusButton,
                          order.status === status.value && styles.statusButtonActive,
                        ]}
                        onPress={() => handleStatusUpdate(order.id, status.value)}
                        disabled={order.status === status.value}
                      >
                        <status.icon size={16} color={
                          order.status === status.value ? '#FFFFFF' : status.color
                        } />
                        <Text style={[
                          styles.statusButtonText,
                          order.status === status.value && styles.statusButtonTextActive,
                        ]}>
                          {status.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            );
          })
        )}
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
  noOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noOrdersText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: '#6B7280',
    marginTop: 20,
    marginBottom: 8,
  },
  noOrdersSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 4,
  },
  orderTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  orderAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#DC2626',
  },
  customerSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  customerDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemsSection: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  statusSection: {
    marginBottom: 16,
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  statusButtons: {
    marginTop: 8,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  statusButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  statusButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
});