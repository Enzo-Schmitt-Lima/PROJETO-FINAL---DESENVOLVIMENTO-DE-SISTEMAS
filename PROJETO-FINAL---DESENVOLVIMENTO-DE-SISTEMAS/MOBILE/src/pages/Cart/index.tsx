import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";

type CartRouteProp = RouteProp<StackParamsList, "Cart">;

interface CartParams {
  number: number;
  order_id: string;
}

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: string;
  amount: number;
  description: string;
  banner: string | null;
  bannerUri: string | null;
  ingredients?: { id: string; name: string; removed: boolean }[];
  adicionais?: { id: string; name: string; price: number; quantity: number }[];
  memberIds?: string[];
}

export default function Cart() {
  const route = useRoute<CartRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const params = route.params as CartParams;
  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [expandedGroupIndex, setExpandedGroupIndex] = useState<number | null>(null);
  const [doNotGroupIds, setDoNotGroupIds] = useState<string[]>([]);

const areItemsEqual = (a: CartItem, b: CartItem): boolean => {
  if (a.product_id !== b.product_id) return false;

  if (a.ingredients?.length !== b.ingredients?.length) return false;
  if (a.adicionais?.length !== b.adicionais?.length) return false;

  const ingredientsEqual = a.ingredients?.every((ai: { id: string; removed: boolean }) => {
    const bi = b.ingredients?.find((bi: { id: string; removed: boolean }) => bi.id === ai.id && bi.removed === ai.removed);
    return !!bi;
  }) ?? false;
  if (!ingredientsEqual) return false;

  const adicionaisEqual = a.adicionais?.every((ad: { id: string; quantity: number }) => {
    const bd = b.adicionais?.find((bd: { id: string; quantity: number }) => bd.id === ad.id && bd.quantity === ad.quantity);
    return !!bd;
  }) ?? false;
  if (!adicionaisEqual) return false;

  return true;
};
  // Modified grouping logic: build groups but keep memberIds so we can edit individual instances
  const groupItems = (items: CartItem[], dontGroupIds: string[] = []): CartItem[] => {
    const groups: CartItem[] = [];
    items.forEach((item: CartItem) => {
      // If this exact item is marked to not group, always create its own group
      if (dontGroupIds.includes(item.id)) {
        groups.push({ ...item, memberIds: [item.id] });
        return;
      }

      const existingGroup = groups.find((group: CartItem) => {
        // If the existing group contains any id that should not be grouped, skip merging into it
        if (group.memberIds && group.memberIds.some(id => dontGroupIds.includes(id))) return false;
        if (dontGroupIds.includes(group.id)) return false;
        return areItemsEqual(group, item);
      });

      if (existingGroup) {
        existingGroup.amount += item.amount;
        existingGroup.memberIds = (existingGroup.memberIds || []).concat(item.id);
      } else {
        groups.push({ ...item, memberIds: [item.id] }); // track member ids for later edits
      }
    });
    return groups;
  };

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const token = user?.token || await AsyncStorage.getItem('@App:token');
      if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get(`/order/detail?order_id=${params.order_id}`);
      const items = (response.data as any).items || [];
      const isPaid = (response.data as any).pagamento?.some((p: any) => p.status === 1);

      if (isPaid) {
        setCartItems([]);
        setTotal(0);
      } else {
        const formattedItems = items.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.product.name,
          price: item.product.price,
          amount: item.amount,
          description: item.product.description,
          banner: item.product.banner,
          bannerUri: item.product.banner,
          ingredients: item.ingredients || [],
          adicionais: item.adicionais || [],
        }));

        console.log('loadCart: order.detail raw items count=', items.length);
        console.log('loadCart: order.detail raw items sample=', items.slice(0,5));
        console.log('loadCart: formattedItems=', formattedItems.map(i => ({ id: i.id, amount: i.amount, product_id: i.product_id })));

        // Check if a recently edited item exists so we can avoid regrouping it immediately
        let recentlyEditedId: string | null = null;
        try {
          recentlyEditedId = await AsyncStorage.getItem('@App:lastEditedItem');
          if (recentlyEditedId) {
            console.log('loadCart: found recentlyEditedId=', recentlyEditedId);
            setDoNotGroupIds(prev => [...prev, recentlyEditedId]);
            await AsyncStorage.removeItem('@App:lastEditedItem');
          }
        } catch (e) {
          console.log('Erro ao ler lastEditedItem do AsyncStorage', e);
        }

        if (expandedGroupId) {
          // Expanded group view: show items in that group individually
        const expandedGroupItems = formattedItems.filter((item: CartItem) => {
          const groupItem = formattedItems.find((g: CartItem) => g.id === expandedGroupId);
          return groupItem && areItemsEqual(groupItem, item);
        });
        setCartItems(expandedGroupItems);
        // Set expandedGroupIndex to help identify pizza indexes for UI
        const firstGroupItemIndex = formattedItems.findIndex((item: CartItem) => item.id === expandedGroupId);
        setExpandedGroupIndex(firstGroupItemIndex !== -1 ? firstGroupItemIndex : null);
      } else {
        // Normal grouped view
        console.log('loadCart: calling groupItems with dontGroupIds=', recentlyEditedId ? [recentlyEditedId] : doNotGroupIds);
        const groupedItems = groupItems(formattedItems, recentlyEditedId ? [recentlyEditedId] : doNotGroupIds);
        setCartItems(groupedItems);
        setExpandedGroupIndex(null);
      }

      // after grouping, clear transient doNotGroupIds so future loads behave normally
      setDoNotGroupIds([]);

        const newTotal = formattedItems.reduce((sum: number, item: CartItem) => {
          const itemBasePrice = item.amount * parseFloat(item.price);
          const adicionaisPrice = (item.adicionais || []).reduce((adicionalSum, adicional) => {
            return adicionalSum + (adicional.price * adicional.quantity);
          }, 0);
          return sum + itemBasePrice + adicionaisPrice;
        }, 0);
        setTotal(newTotal);
      }
    } catch (err) {
      console.log("Erro ao carregar carrinho:", err, (err as any)?.response?.data, (err as any)?.response?.status);
      Alert.alert('Erro', 'Não foi possível carregar os dados do carrinho.');
      setCartItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [params.order_id, user, expandedGroupId]);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  const increment = async (productId: string | undefined) => {
    if (!productId) {
      Alert.alert('Erro', 'ID do produto inválido para adicionar.');
      return;
    }
    try {
      await api.post('/order/add', {
        order_id: params.order_id,
        product_id: productId,
        amount: 1,
      });
      setExpandedGroupId(null); // reset grouping on modification
      loadCart();
    } catch (err: any) {
      console.log('Erro ao adicionar item:', err);
      if (err.response && err.response.status === 500) {
        Alert.alert('Erro no servidor', 'Ocorreu um erro ao tentar adicionar o item. Tente novamente.');
      } else if (err.response) {
        Alert.alert('Erro', `Falha ao adicionar item: ${err.response.status} - ${err.response.data?.message || ''}`);
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar o item.');
      }
    }
  };

  const decrement = async (itemId: string | undefined) => {
    if (!itemId) {
      Alert.alert('Erro', 'ID do item inválido para remoção.');
      return;
    }
    try {
      // If expanded group, the itemId may be of grouped item; find actual individual item ID to remove
      let itemIdToRemove = itemId;
      if (expandedGroupId && expandedGroupIndex !== null) {
        // Try to get item from expandedGroupItems currently shown for removal
        if (cartItems.length > 0) {
          // Here we expect cartItems in expanded mode to be ungrouped individual items
          const itemIndex = cartItems.findIndex(item => item.id === itemId);
          if (itemIndex !== -1) {
            itemIdToRemove = cartItems[itemIndex].id;
          }
        }
      }
      await api.delete('/order/remove', { params: { item_id: itemIdToRemove } });
      setExpandedGroupId(null); // reset grouping on modification
      loadCart();
    } catch (err: any) {
      console.log('Erro ao remover item:', err);
      if (err.response && err.response.status === 500) {
        Alert.alert('Erro no servidor', 'Ocorreu um erro ao tentar remover o item. Tente novamente.');
      } else if (err.response) {
        Alert.alert('Erro', `Falha ao remover item: ${err.response.status} - ${err.response.data?.message || ''}`);
      } else {
        Alert.alert('Erro', 'Não foi possível remover o item.');
      }
    }
  };

  const expandGroup = (item: CartItem) => {
    setExpandedGroupId(item.id);
  };

  const collapseGroup = () => {
    setExpandedGroupId(null);
  };

  const handleBackToOrder = () => {
    navigation.navigate('Order', { number: params.number, order_id: params.order_id });
  };

const handleEditIngredients = async (item: CartItem) => {
  // If this group already tracks the underlying member ids, use them directly
  if (item.memberIds && item.memberIds.length > 0) {
    // If the group tracks only one member id but the grouped amount > 1,
    // we need to split one unit so it can be edited individually.
    if (item.memberIds.length === 1 && item.amount > 1) {
      try {
        const representativeId = item.memberIds[0] || item.id;
        const splitResp = await api.post('/order/split', { item_id: representativeId, quantity: 1 });
        const newItem = splitResp.data;
        try { await AsyncStorage.setItem('@App:lastEditedItem', newItem.id); } catch (e) { /* ignore */ }
        navigation.navigate('CustomizeItem', { product_id: item.product_id, product_name: item.name, item_id: newItem.id });
        return;
      } catch (splitErr) {
        console.log('Erro ao solicitar split do item (via memberIds):', splitErr);
        // fallback to existing navigation behavior below
      }
    }

    if (item.memberIds.length > 1) {
      navigation.navigate('CustomizeItem', { product_id: item.product_id, product_name: item.name, item_ids: item.memberIds });
    } else {
      navigation.navigate('CustomizeItem', { product_id: item.product_id, product_name: item.name, item_id: item.memberIds[0] });
    }
    return;
  }

  // Fallback: query the backend and try to resolve individual item ids (keeps backward compatibility)
  try {
    const response = await api.get(`/order/detail?order_id=${params.order_id}`);
    const items = (response.data as any).items || [];
    const formattedItems = items.map((it: any) => ({
      id: it.id,
      product_id: it.product_id,
      name: it.product.name,
      price: it.product.price,
      amount: it.amount,
      description: it.product.description,
      banner: it.product.banner,
      bannerUri: it.product.banner,
      ingredients: it.ingredients || [],
      adicionais: it.adicionais || [],
    })) as CartItem[];

    const representative = formattedItems.find(fi => fi.product_id === item.product_id && areItemsEqual(fi, item));
    if (!representative) {
      navigation.navigate('CustomizeItem', { product_id: item.product_id, product_name: item.name, item_id: item.id });
      return;
    }

    // If the representative is an aggregated item (amount > 1), request the backend to split one unit
    // so we can edit a single-instance item. The Split API returns the newly created item.
    if (representative.amount > 1) {
      try {
        const splitResp = await api.post('/order/split', { item_id: representative.id, quantity: 1 });
        const newItem = splitResp.data;
        // Prevent immediate regrouping of the newly created item
        try { await AsyncStorage.setItem('@App:lastEditedItem', newItem.id); } catch (e) { /* ignore */ }
        navigation.navigate('CustomizeItem', { product_id: item.product_id, product_name: item.name, item_id: newItem.id });
        return;
      } catch (splitErr) {
        console.log('Erro ao solicitar split do item:', splitErr);
        // fallback to existing logic
      }
    }

    const matchingItemIds = formattedItems.filter(fi => areItemsEqual(fi, representative)).map(fi => fi.id);
    if (matchingItemIds.length > 1) {
      navigation.navigate('CustomizeItem', { product_id: item.product_id, product_name: item.name, item_ids: matchingItemIds });
    } else {
      navigation.navigate('CustomizeItem', { product_id: item.product_id, product_name: item.name, item_id: matchingItemIds[0] || item.id });
    }
  } catch (err) {
    console.log('Erro ao buscar itens para edição:', err);
    navigation.navigate('CustomizeItem', { product_id: item.product_id, product_name: item.name, item_id: item.id });
  }
};

const onReturnFromEdit = () => {
  setExpandedGroupId(null);
  loadCart();
};

  const handleBackFromExpandedGroup = () => {
    collapseGroup();
    loadCart();
  };

  const handleProceedToPayment = () => {
    if (total === 0) {
      Alert.alert('Carrinho Vazio', 'Não é possível finalizar um pedido sem itens.');
      return;
    }
    navigation.navigate('Payment', {
      number: params.number,
      order: { id: params.order_id },
      total: total,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#911F09" />
          <Text style={styles.loadingText}>Carregando carrinho...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#911F09" barStyle="light-content" />
      <View style={styles.header}>
        {expandedGroupId ? (
          <TouchableOpacity onPress={handleBackFromExpandedGroup} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5D3A2F" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleBackToOrder} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5D3A2F" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Carrinho</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          // Calculate pizza number for display when in expandedGroup mode
          const pizzaNumber = expandedGroupId && expandedGroupIndex !== null ? index + 1 : null;
          return (
            <View style={styles.cartItem}>
              {(item.bannerUri || item.banner) ? (
                <Image source={{ uri: `http://192.168.0.243:3333/files/${item.bannerUri ?? item.banner ?? ''}` }} style={styles.itemImage} resizeMode="cover" />
              ) : (
                <View style={[styles.itemImage, { backgroundColor: "#B72F14" }]} />
              )}
              <View style={styles.itemDetails}>
                {pizzaNumber && (
                  <View style={styles.pizzaNumberBar}>
                    <Text style={styles.pizzaNumberText}>Pizza {pizzaNumber}</Text>
                  </View>
                )}
                <Text style={styles.itemName}>{item.amount}x {item.name}</Text>
                <Text style={styles.itemPrice}>R$ {parseFloat(item.price).toFixed(2)} (un.)</Text>
                {item.ingredients?.filter((ing: { id: string; name: string; removed: boolean }) => ing.removed).map((ing: { id: string; name: string }) => (
                  <Text key={ing.id} style={styles.itemCustomization}>- {ing.name}</Text>
                ))}
                {item.adicionais?.map((ad: { id: string; name: string; price: number; quantity: number }) => (
                  <Text key={ad.id} style={styles.itemCustomization}>+ {ad.quantity}x {ad.name} (+ R$ {ad.price.toFixed(2)})</Text>
                ))}
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity style={styles.controlButton} onPress={() => decrement(item.id)}>
                  <Text style={styles.controlText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.amount}</Text>
                <TouchableOpacity style={styles.controlButton} onPress={() => increment(item.product_id)}>
                  <Text style={styles.controlText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditIngredients(item)}>
                  <Ionicons name="create-outline" size={20} color="#911F09" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Carrinho vazio</Text>}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.paymentButton} onPress={handleProceedToPayment}>
          <Text style={styles.paymentText}>Finalizar Pagamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D9D9D9" },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D9D9D9', paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#911F09', marginLeft: 10 },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', margin: 10, padding: 10, borderRadius: 6, elevation: 2 },
  itemImage: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
  itemDetails: { flex: 1 },
  pizzaNumberBar: { backgroundColor: '#F2CA85', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 4, alignSelf: 'flex-start' },
  pizzaNumberText: { fontWeight: 'bold', color: '#101026' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#101026' },
  itemDescription: { fontSize: 12, color: '#555', marginTop: 2 },
  itemCustomization: { fontSize: 12, color: '#444', marginTop: 4, fontStyle: 'italic' },
  itemPrice: { fontSize: 14, color: '#555', marginTop: 4 },
  quantityControls: { flexDirection: 'row', alignItems: 'center' },
  controlButton: { width: 35, height: 35, backgroundColor: "#F2CA85", justifyContent: "center", alignItems: "center", borderRadius: 6 },
  controlText: { fontWeight: "bold", color: "#101026", fontSize: 18 },
  quantity: { marginHorizontal: 12, fontSize: 16, fontWeight: 'bold' },
  editButton: { width: 35, height: 35, backgroundColor: "#F2CA85", justifyContent: "center", alignItems: "center", borderRadius: 6, marginLeft: 8 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 18, color: '#911F09' },
  footer: { padding: 20, backgroundColor: "#911F09", alignItems: 'center' },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  paymentButton: { backgroundColor: "#F2CA85", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6 },
  paymentText: { fontWeight: "bold", color: "#101026", fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#D9D9D9" },
  loadingText: { marginTop: 10, fontSize: 16, color: '#911F09', fontWeight: 'bold' },
});
