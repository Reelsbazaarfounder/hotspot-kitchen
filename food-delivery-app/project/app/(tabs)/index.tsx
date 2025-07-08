import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Plus, Minus, Star, X } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

const categories = [
  'All',
  'Veg Starters',
  'Egg Starters',
  'Mutton Starters',
  'Non Veg Starters',
  'Tandoor',
  'Tandoor Rotties',
  'Rolls',
  'Shawarma',
  'Rice Items',
  'Veg Curries',
  'Non Veg Curries',
  'Non Veg Biryani',
  'Veg Biryani',
];

export default function HomeScreen() {
  const { state, dispatch } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const filteredItems = selectedCategory === 'All' 
    ? state.menuItems.filter(item => item.available)
    : state.menuItems.filter(item => item.category === selectedCategory && item.available);

  const cartTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item: any) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
  };

  const getItemQuantity = (id: string) => {
    const item = state.cart.find(cartItem => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  const handleCall = () => {
    Linking.openURL(`tel:${state.contactNumber}`);
  };

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const closeItemModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
  };

  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {state.error}</Text>
          <Text style={styles.errorSubtext}>Please check your internet connection and try again</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/1750605723842.jpg')}
          style={styles.logo}
        />
        <Image
          source={require('@/assets/images/1751554321283.jpg')}
          style={styles.appNameImage}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={handleCall} style={styles.callButton}>
          <Phone size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Offer Banner */}
      <View style={styles.offerBanner}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.offerImage}
        />
        <View style={styles.offerOverlay}>
          <Text style={styles.offerText}>🎉 {state.offerBanner} 🎉</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items Grid */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.menuGrid}>
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.cardImageContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>🍽️</Text>
                    </View>
                  )}
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>4.5</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description || 'Delicious and freshly prepared'}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardPrice}>₹{item.price}</Text>
                    {quantity > 0 ? (
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => handleUpdateQuantity(item.id, quantity - 1)}
                        >
                          <Minus size={14} color="#DC2626" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => handleUpdateQuantity(item.id, quantity + 1)}
                        >
                          <Plus size={14} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(item)}
                      >
                        <Plus size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Extra spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <TouchableOpacity
          style={styles.floatingCartButton}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <View style={styles.cartButtonContent}>
            <Text style={styles.cartButtonText}>
              {cartItemsCount} items | ₹{cartTotal}
            </Text>
            <Text style={styles.cartButtonSubtext}>View Cart</Text>
          </View>
          <View style={styles.cartButtonPulse} />
        </TouchableOpacity>
      )}

      {/* Item Detail Modal */}
      <Modal
        visible={showItemModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeItemModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <TouchableOpacity style={styles.closeButton} onPress={closeItemModal}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
                
                <View style={styles.modalImageContainer}>
                  {selectedItem.image ? (
                    <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
                  ) : (
                    <View style={styles.modalPlaceholderImage}>
                      <Text style={styles.modalPlaceholderText}>🍽️</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedItem.description || 'Delicious and freshly prepared dish made with finest ingredients'}
                  </Text>
                  <Text style={styles.modalPrice}>₹{selectedItem.price}</Text>
                  
                  <View style={styles.modalActions}>
                    {getItemQuantity(selectedItem.id) > 0 ? (
                      <View style={styles.modalQuantityControls}>
                        <TouchableOpacity
                          style={styles.modalQuantityButton}
                          onPress={() => handleUpdateQuantity(selectedItem.id, getItemQuantity(selectedItem.id) - 1)}
                        >
                          <Minus size={18} color="#DC2626" />
                        </TouchableOpacity>
                        <Text style={styles.modalQuantityText}>{getItemQuantity(selectedItem.id)}</Text>
                        <TouchableOpacity
                          style={styles.modalQuantityButton}
                          onPress={() => handleUpdateQuantity(selectedItem.id, getItemQuantity(selectedItem.id) + 1)}
                        >
                          <Plus size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.modalAddButton}
                        onPress={() => {
                          handleAddToCart(selectedItem);
                          closeItemModal();
                        }}
                      >
                        <Plus size={20} color="#FFFFFF" />
                        <Text style={styles.modalAddButtonText}>Add to Cart</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </>
            )}
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
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  appNameImage: {
    height: 50,
    flex: 1,
    marginHorizontal: 15,
  },
  callButton: {
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 25,
  },
  offerBanner: {
    height: 120,
    position: 'relative',
    marginBottom: 10,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  offerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  offerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    minWidth: 80,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#DC2626',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    position: 'relative',
    height: 120,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#1F2937',
    marginLeft: 2,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#DC2626',
  },
  addButton: {
    backgroundColor: '#DC2626',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    marginHorizontal: 8,
    minWidth: 16,
    textAlign: 'center',
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  cartButtonSubtext: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  cartButtonPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    opacity: 0.3,
  },
  bottomSpacing: {
    height: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  modalImageContainer: {
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalPlaceholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPlaceholderText: {
    fontSize: 64,
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
  },
  modalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  modalPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#DC2626',
    marginBottom: 24,
  },
  modalActions: {
    alignItems: 'center',
  },
  modalQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 8,
  },
  modalQuantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalQuantityText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  modalAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  modalAddButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});