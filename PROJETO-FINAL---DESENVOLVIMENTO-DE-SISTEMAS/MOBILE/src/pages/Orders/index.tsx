import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';
import { connectSocket, getSocket } from '../../services/socket';

interface Order {
  id: string;
  items: { product: { name: string; price: string }; amount: number }[];
  table?: { number: number };
  created_at: string;
  status?: number;
  statusText?: string;
  pagamento?: any;
}

export default function Orders() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const topOffset = (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 24) + 18;

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data as Order[]);
    } catch (err) {
      console.log('Erro ao atualizar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get('/orders');
        const fetchedOrders = response.data as Order[];
        // backend now returns statusText, table and pagamento with readable fields
        setOrders(fetchedOrders);
      } catch (err) {
        console.log('Erro ao carregar pedidos:', err);
        Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
    // conecta socket e registra listeners
    const s = connectSocket();

    const onOrderUpdate = (payload: any) => {
      // payload pode conter order_id, total, pagamento, status
      setOrders(prev => {
        const idx = prev.findIndex(o => o.id === payload.order_id || o.id === payload.id);
        if (idx === -1) {
          // se não existe, pode ser que o backend envie o pedido completo em order:create
          if (payload.id) return [payload, ...prev];
          return prev;
        }

        const updated = [...prev];
        const target = updated[idx];
        // mesclar campos relevantes
        updated[idx] = { ...target, ...payload, pagamento: payload.pagamento || target.pagamento };
        return updated;
      });
    };

    const onOrderCreate = (payload: any) => {
      // payload deve ser o order completo enviado pelo backend
      setOrders(prev => [payload, ...prev]);
    };

    s.on('order:update', onOrderUpdate);
    s.on('order:create', onOrderCreate);

    return () => {
      try { s.off('order:update', onOrderUpdate); s.off('order:create', onOrderCreate); } catch (e) { }
    };
  }, []);

  const calculateTotal = (items: Order['items']) => {
    return items.reduce((total, item) => total + item.amount * parseFloat(item.product.price), 0);
  };

  const getDesc = (items: Order['items']) => {
    return items.map(item => `${item.product.name} x${item.amount}`).join(' + ');
  };

  const statusText = (o?: Order) => {
    // Preferir texto do backend quando disponível
    if (o && o.statusText) return o.statusText;
    const s = o?.status;
    switch (s) {
      case 0:
      case 1:
        return 'em preparo';
      case 2:
        return 'pronto';
      case 3:
        return 'finalizado';
      default:
        return 'desconhecido';
    }
  };

  const statusColor = (s?: number) => {
    switch (s) {
      case 0:
      case 1:
        return '#FFA500'; // laranja - em preparo
      case 2:
        return '#3FFFA3'; // verde claro - pronto
      case 3:
        return '#888888'; // cinza - finalizado
      default:
        return '#CCCCCC';
    }
  };

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={[styles.backButton, { top: topOffset }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.refreshButton, { top: topOffset }]} onPress={handleRefresh}>
          <Ionicons name="refresh" size={18} color="#911F09" />
        </TouchableOpacity>
        <Text style={styles.logo}>RED HOT CHILLI</Text>
        <Text style={styles.title}>Meus pedidos</Text>
        <View style={styles.searchBar}>
          <TextInput style={styles.searchInput} placeholder="Buscar pedido..." />
        </View>
        <ScrollView style={{ width: '100%', flex: 1 }}>
          {loading ? (
            <Text style={styles.loadingText}>Carregando pedidos...</Text>
          ) : orders.length === 0 ? (
            <Text style={styles.noOrdersText}>Nenhum pedido encontrado.</Text>
          ) : (
            orders.map(order => (
              <TouchableOpacity key={order.id} style={styles.orderBox} onPress={() => (navigation as any).navigate('OrderStatus', { order_id: order.id })}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: statusColor(order.status), marginRight: 8 }} />
                    <Text style={styles.orderText}>{getDesc(order.items)}</Text>
                  </View>
                  <Text style={[styles.orderSub, { fontWeight: 'bold' }]}>{statusText(order)}</Text>
                </View>
                <Text style={styles.orderSub}>
                  Mesa: {order.table?.number ?? '—'} | Total: R$ {calculateTotal(order.items).toFixed(2)}
                </Text>
                {order.pagamento && order.pagamento.length > 0 && (
                  <Text style={[styles.orderSub, { marginTop: 6 }]}>Pagamento: {(order.pagamento[0].statusText) || order.pagamento[0].metodo || '—'}</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
        <Image 
          source={require('../../../assets/sac.png')} 
          style={styles.sacImage} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: { flex: 1, backgroundColor: '#911F09', alignItems: 'center' },
  cardContainer: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 30, padding: 28, width: '90%', maxWidth: 400, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 8, position: 'relative' },
  backButton: { position: 'absolute', top: 10, left: 18, padding: 10, zIndex: 10 },
  refreshButton: { position: 'absolute', top: 10, right: 10, padding: 8 },
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