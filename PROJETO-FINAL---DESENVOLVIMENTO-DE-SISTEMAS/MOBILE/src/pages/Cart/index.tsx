import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
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
}

export default function Cart() {
  const route = useRoute<CartRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const params = route.params as CartParams;
  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    try {
      // prefere token do contexto (mais rápido) e faz fallback no AsyncStorage
      const token = user?.token || await AsyncStorage.getItem('@App:token');
      if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.get(`/order/detail?order_id=${params.order_id}`);
      const items = (response.data as any).items || [];
      const isPaid = (response.data as any).pagamento && (response.data as any).pagamento.some((p: any) => p.status === 1);
      if (isPaid) {
        // Clear the cart if the order is paid
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
        }));
        setCartItems(formattedItems);
        const newTotal = formattedItems.reduce((sum: number, item: CartItem) => sum + item.amount * parseFloat(item.price), 0);
        setTotal(newTotal);
      }
    } catch (err) {
      console.log("Erro ao carregar carrinho:", err, (err as any)?.response?.data, (err as any)?.response?.status);
      const status = (err as any)?.response?.status;
      // Se 401, não navega automaticamente — mostra opção para o usuário
      if (status === 401) {
        // tenta recarregar token do AsyncStorage e refazer a requisição uma vez (corrige casos de race condition)
        try {
          const stored = await AsyncStorage.getItem('@App:token');
          if (stored) {
            api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
            const retryResp = await api.get(`/order/detail?order_id=${params.order_id}`);
            const retryItems = (retryResp.data as any).items || [];
            const formattedItems = retryItems.map((item: any) => ({
              id: item.id,
              product_id: item.product_id,
              name: item.product.name,
              price: item.product.price,
              amount: item.amount,
              description: item.product.description,
              banner: item.product.banner,
              bannerUri: item.product.banner,
            }));
            setCartItems(formattedItems);
            const newTotal = formattedItems.reduce((sum: number, item: CartItem) => sum + item.amount * parseFloat(item.price), 0);
            setTotal(newTotal);
            return;
          }
        } catch (retryErr) {
          console.log('Retry erro:', retryErr);
        }

        Alert.alert(
          'Sessão expirada',
          'Sua sessão expirou. Deseja fazer login novamente?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ir para login', onPress: () => navigation.navigate('SignIn') }
          ]
        );
        return;
      }
      // Para outros erros, limpa o carrinho localmente
      setCartItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [params.order_id]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const increment = async (productId: string) => {
    try {
      await api.post('/order/add', {
        order_id: params.order_id,
        product_id: productId,
        amount: 1,
      });
      loadCart();
    } catch (err) {
      console.log('Erro ao adicionar item:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o item.');
    }
  };

  const decrement = async (itemId: string) => {
    try {
      await api.delete('/order/remove', { params: { item_id: itemId } });
      loadCart();
    } catch (err) {
      console.log('Erro ao remover item:', err);
      Alert.alert('Erro', 'Não foi possível remover o item.');
    }
  };

  const handleBackToOrder = () => {
    navigation.navigate('ChooseTable');
  };

  const handleEditIngredients = (item: CartItem) => {
    navigation.navigate('EditProductIngredients', { product_id: item.product_id, product_name: item.name, item_id: item.id });
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
        <TouchableOpacity onPress={handleBackToOrder} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5D3A2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {(item.bannerUri || item.banner) ? (
              <Image source={{ uri: item.bannerUri ?? item.banner ?? '' }} style={styles.itemImage} resizeMode="cover" />
            ) : (
              <View style={[styles.itemImage, { backgroundColor: "#B72F14" }]} />
            )}
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>R$ {parseFloat(item.price).toFixed(2)}</Text>
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
        )}
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
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#101026' },
  itemDescription: { fontSize: 12, color: '#555', marginTop: 2 },
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
