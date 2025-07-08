import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, CircleCheck as CheckCircle, Truck, ChefHat } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: ChefHat,
  ready: Truck,
  delivered: CheckCircle,
};

const statusColors = {
  pending: '#F59E0B',
  confirmed: '#10B981',
  preparing: '#3B82F6',
  ready: '#8B5CF6',
  delivered: '#10B981',
};

const statusLabels = {
  pending: 'Order Received',
  confirmed: 'Order Confirmed',
  preparing: 'Being Prepared',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
};

export default function OrderTrackingScreen() {
  const { state } = useAppContext();

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    return statuses.indexOf(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {state.orders.length === 0 ? (
          <View style={styles.noOrders}>
            <Clock size={80} color="#D1D5DB" />
            <Text style={styles.noOrdersText}>No orders yet</Text>
            <Text style={styles.noOrdersSubtext}>Your orders will appear here once placed</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/')}
            >
              <Text style={styles.browseButtonText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          state.orders.map((order) => {
            const StatusIcon = statusIcons[order.status];
            const statusColor = statusColors[order.status];
            const currentStatusIndex = getStatusIndex(order.status);

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.orderTime}>{formatTime(order.timestamp)}</Text>
                </View>

                {/* Current Status */}
                <View style={styles.currentStatus}>
                  <View style={[styles.statusIcon, { backgroundColor: statusColor + '20' }]}>
                    <StatusIcon size={24} color={statusColor} />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text style={styles.statusLabel}>{statusLabels[order.status]}</Text>
                    <Text style={styles.statusSubtext}>
                      {order.status === 'delivered' 
                        ? 'Your order has been delivered successfully!'
                        : 'We\'ll update you when status changes'
                      }
                    </Text>
                  </View>
                </View>

                {/* Status Timeline */}
                <View style={styles.timeline}>
                  {Object.entries(statusLabels).map(([status, label], index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const TimelineIcon = statusIcons[status as keyof typeof statusIcons];
                    
                    return (
                      <View key={status} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                          <View style={[
                            styles.timelineIcon,
                            isCompleted && styles.timelineIconCompleted,
                            isCurrent && styles.timelineIconCurrent,
                          ]}>
                            <TimelineIcon 
                              size={16} 
                              color={isCompleted ? '#FFFFFF' : '#9CA3AF'} 
                            />
                          </View>
                          {index < Object.keys(statusLabels).length - 1 && (
                            <View style={[
                              styles.timelineLine,
                              isCompleted && styles.timelineLineCompleted,
                            ]} />
                          )}
                        </View>
                        <Text style={[
                          styles.timelineLabel,
                          isCompleted && styles.timelineLabelCompleted,
                        ]}>
                          {label}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Order Items */}
                <View style={styles.orderItems}>
                  <Text style={styles.itemsTitle}>Items ({order.items.length})</Text>
                  {order.items.map((item) => (
                    <View key={item.id} style={styles.orderItem}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                    </View>
                  ))}
                  <View style={styles.orderTotal}>
                    <Text style={styles.totalLabel}>Total: ₹{order.total}</Text>
                  </View>
                </View>

                {/* Customer Details */}
                <View style={styles.customerInfo}>
                  <Text style={styles.customerTitle}>Delivery Details</Text>
                  <Text style={styles.customerDetail}>Name: {order.customerName}</Text>
                  <Text style={styles.customerDetail}>Phone: {order.customerPhone}</Text>
                  <Text style={styles.customerDetail}>Address: {order.customerAddress}</Text>
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
  },
  orderId: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  orderTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  statusSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  timeline: {
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: '#10B981',
  },
  timelineIconCurrent: {
    backgroundColor: '#DC2626',
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#10B981',
  },
  timelineLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    paddingTop: 6,
  },
  timelineLabelCompleted: {
    color: '#1F2937',
    fontFamily: 'Inter-Medium',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginBottom: 16,
  },
  itemsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  orderTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'right',
  },
  customerInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  customerTitle: {
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
});