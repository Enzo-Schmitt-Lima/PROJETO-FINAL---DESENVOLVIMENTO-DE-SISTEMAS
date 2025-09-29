import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';

type OrderStatusRouteProp = RouteProp<StackParamsList, 'OrderStatus'>;

export default function OrderStatus() {
  const route = useRoute<OrderStatusRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const { number, order, total } = route.params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function sendOrder() {
      setLoading(true);
      try {
        const orderItems = order.items.map((item: any) => ({
          product_id: item.product.id,
          amount: item.amount,
        }));
        
        await api.post('/order/add', {
          order_id: order.id,
          items: orderItems,
        });

      } catch (err) {
        console.log("Erro ao enviar pedido:", err);
        Alert.alert('Erro', 'Ocorreu um erro ao enviar seu pedido. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    sendOrder();
  }, [order]);

  const handleNextStep = () => {
    navigation.navigate('Payment', {
      number,
      order,
      total,
    });
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancelar Pedido',
      'Você tem certeza que deseja cancelar o pedido?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido da Mesa {number}</Text>
      <Text style={styles.subTitle}>Itens selecionados:</Text>

      <FlatList
        data={order.items}
        keyExtractor={item => item.product.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>
              {item.product.name} x{item.amount}
            </Text>
            <Text style={styles.itemPrice}>
              R$ {(parseFloat(item.product.price) * item.amount).toFixed(2)}
            </Text>
          </View>
        )}
        style={styles.list}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total do Pedido: R$ {total.toFixed(2)}</Text>
      </View>
      
      {loading ? (
        <Text style={styles.loadingText}>Enviando pedido...</Text>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton]}
            onPress={handleCancelOrder}
          >
            <Text style={styles.footerText}>Cancelar Pedido</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerButton, styles.proceedButton]}
            onPress={handleNextStep}
          >
            <Text style={styles.footerText}>Ir para o Pagamento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d2e',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3b3b6b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#FFF',
    fontSize: 16,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#555',
    paddingTop: 10,
    marginTop: 10,
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3fffa3',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3F4B',
  },
  proceedButton: {
    backgroundColor: '#3fffa3',
  },
  footerText: {
    color: '#101026',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
});
