import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';

interface OrderData {
  id: string;
  items?: { product: { name: string; price: string }; amount: number }[];
  table?: { number: number };
  status?: number;
  pagamento?: any;
  statusText?: string;
}

type OrderStatusRouteProp = RouteProp<StackParamsList, 'OrderStatus'>;

export default function OrderStatus() {
  const route = useRoute<OrderStatusRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { number, order, total, order_id } = route.params || {};

  const [orderData, setOrderData] = useState<OrderData | null>(order || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!orderData && order_id) {
        try {
          setLoading(true);
          const resp = await api.get(`/order/detail?order_id=${order_id}`);
          setOrderData((resp.data as any).order || resp.data);
        } catch (err) {
          console.log('Erro ao buscar detalhes do pedido', err);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [order_id]);

  const handleOrderArrived = () => {
    (navigation as any).navigate('Feedback');
  };

  const statusText = (s?: number) => {
    switch (s) {
      case 0:
      case 1:
        return 'Em preparo';
      case 2:
        return 'Pronto';
      case 3:
        return 'Finalizado';
      default:
        return 'Desconhecido';
    }
  };

  const displayId = orderData?.id || order?.id || order_id || null;
  const displayTable = orderData?.table?.number || number || order?.table?.number || '—';
  const displayTotal = (() => {
    const items = orderData?.items || order?.items;
    if (!items) return 0;
  return items.reduce((sum: number, it: any) => sum + it.amount * parseFloat(it.product.price), 0);
  })();
  const displayStatus = orderData?.status ?? order?.status;
  const displayStatusText = orderData?.statusText || (order as any)?.statusText || (displayStatus !== undefined ? statusText(displayStatus) : 'Desconhecido');
  const paymentMethod = orderData?.pagamento && orderData.pagamento.length > 0 ? (orderData.pagamento[0].statusText || orderData.pagamento[0].metodo) : (order as any)?.pagamento && (order as any).pagamento.length > 0 ? ((order as any).pagamento[0].statusText || (order as any).pagamento[0].metodo) : null;

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
    <Text style={styles.title}>Status do Pedido</Text>
    <Text style={styles.subtitle}>Mesa {displayTable}</Text>
    {paymentMethod && <Text style={styles.info}>Pagamento: {paymentMethod}</Text>}
    <Text style={styles.info}>Total: R$ {displayTotal.toFixed(2)}</Text>
    <Text style={styles.status}>{loading ? 'Carregando status...' : displayStatusText}</Text>
        <TouchableOpacity style={styles.button} onPress={handleOrderArrived}>
          <Text style={styles.buttonText}>O pedido chegou?</Text>
        </TouchableOpacity>
        <Text style={styles.sacText}>SAC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: '#911F09',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A3A6B',
    marginBottom: 18,
    marginTop: 10,
    textAlign: 'center',
    width: '100%',
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 18,
    color: '#101026',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: '#101026',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: '#911F09',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F2CA85',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sacText: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
});
