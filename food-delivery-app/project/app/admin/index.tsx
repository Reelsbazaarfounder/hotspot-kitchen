import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Menu, ShoppingBag, Settings, Users, TrendingUp, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

export default function AdminDashboard() {
  const { state, dispatch } = useAppContext();

  const totalOrders = state.orders.length;
  const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
  const completedOrders = state.orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = state.orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'SET_ADMIN', payload: false });
            router.replace('/(tabs)/');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <ShoppingBag size={24} color="#DC2626" />
            </View>
            <Text style={styles.statNumber}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <CheckCircle size={24} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{completedOrders}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color="#3B82F6" />
            </View>
            <Text style={styles.statNumber}>₹{totalRevenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/admin/order-management')}
          >
            <View style={styles.actionIcon}>
              <ShoppingBag size={24} color="#DC2626" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Order Management</Text>
              <Text style={styles.actionSubtitle}>View and update order status</Text>
            </View>
            {pendingOrders > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingOrders}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/admin/menu-management')}
          >
            <View style={styles.actionIcon}>
              <Menu size={24} color="#DC2626" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Menu Management</Text>
              <Text style={styles.actionSubtitle}>Add, edit, or remove menu items</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/admin/settings')}
          >
            <View style={styles.actionIcon}>
              <Settings size={24} color="#DC2626" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionSubtitle}>Update contact, offers, and coupons</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Orders */}
        <View style={styles.recentOrders}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {state.orders.slice(0, 5).map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>#{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customerName}</Text>
                <Text style={styles.orderTime}>
                  {new Date(order.timestamp).toLocaleString()}
                </Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>₹{order.total}</Text>
                <View style={[styles.statusBadge, styles[`status${order.status}`]]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
            </View>
          ))}
          
          {state.orders.length === 0 && (
            <View style={styles.noOrders}>
              <Text style={styles.noOrdersText}>No orders yet</Text>
            </View>
          )}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  actionsSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  badge: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  recentOrders: {
    marginVertical: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  orderCustomer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  orderTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statuspending: {
    backgroundColor: '#FEF3C7',
  },
  statusconfirmed: {
    backgroundColor: '#D1FAE5',
  },
  statuspreparing: {
    backgroundColor: '#DBEAFE',
  },
  statusready: {
    backgroundColor: '#E0E7FF',
  },
  statusdelivered: {
    backgroundColor: '#D1FAE5',
  },
  noOrders: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noOrdersText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
});