import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';

interface Order {
  id: string;
  items: { product: { name: string; price: string }; amount: number }[];
  table: { number: number };
  created_at: string;
}

export default function Orders() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        console.log('Erro ao carregar pedidos:', err);
        Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const calculateTotal = (items: Order['items']) => {
    return items.reduce((total, item) => total + item.amount * parseFloat(item.product.price), 0);
  };

  const getDesc = (items: Order['items']) => {
    return items.map(item => `${item.product.name} x${item.amount}`).join(' + ');
  };

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ChooseTable')}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>RED HOT CHILLI</Text>
        <Text style={styles.title}>Meus pedidos</Text>
        <View style={styles.searchBar}><TextInput style={styles.searchInput} placeholder="" /></View>
        <ScrollView style={{ width: '100%', flex: 1 }}>
          {loading ? (
            <Text style={styles.loadingText}>Carregando pedidos...</Text>
          ) : orders.length === 0 ? (
            <Text style={styles.noOrdersText}>Nenhum pedido encontrado.</Text>
          ) : (
            orders.map(order => (
              <TouchableOpacity key={order.id} style={styles.orderBox}>
                <Text style={styles.orderText}>#{order.id} {getDesc(order.items)}</Text>
                <Text style={styles.orderSub}>Mesa: {order.table.number} | Total: R$ {calculateTotal(order.items).toFixed(2)}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
        <Text style={styles.sacText}>SAC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: { flex: 1, backgroundColor: '#911F09', alignItems: 'center' },
  cardContainer: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 30, padding: 28, width: '90%', maxWidth: 400, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 8, position: 'relative' },
  backButton: { position: 'absolute', top: 10, left: 10, padding: 10 },
  backText: { color: '#911F09', fontSize: 16, fontWeight: 'bold' },
  logo: { color: '#B72F14', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A3A6B', marginBottom: 18, marginTop: 10, textAlign: 'center', width: '100%' },
  searchBar: { backgroundColor: '#EEE', borderRadius: 8, padding: 6, width: '100%', marginBottom: 12 },
  searchInput: { fontSize: 16, color: '#1A3A6B', padding: 4 },
  orderBox: { backgroundColor: '#B72F14', borderRadius: 8, padding: 14, marginBottom: 12 },
  orderText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  orderSub: { color: '#FFF', fontSize: 13, marginTop: 4 },
  loadingText: { textAlign: 'center', fontSize: 16, color: '#1A3A6B', marginTop: 20 },
  noOrdersText: { textAlign: 'center', fontSize: 16, color: '#1A3A6B', marginTop: 20 },
  sacText: { color: '#911F09', fontWeight: 'bold', fontSize: 14, marginTop: 10, alignSelf: 'flex-end' },
});
