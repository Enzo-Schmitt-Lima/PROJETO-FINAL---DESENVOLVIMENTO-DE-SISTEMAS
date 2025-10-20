import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackParamsList } from '../../routes/app.routes';

type AcompanharRouteProp = RouteProp<StackParamsList, 'AcompanharPedido'>;

export default function AcompanharPedido() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const route = useRoute<AcompanharRouteProp>();
  const order_id = route.params?.order_id;

  function handleGoToOrders() {
    // Navega para a aba Meus pedidos
    (navigation as any).navigate('Orders');
  }

  function handleOpenStatus() {
    if (order_id) {
      (navigation as any).navigate('OrderStatus', { order_id });
    } else {
      (navigation as any).navigate('OrderStatus');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acompanhar pedido</Text>
      <Text style={styles.subtitle}>Seu pedido foi enviado ao restaurante.</Text>

      <TouchableOpacity style={styles.button} onPress={handleOpenStatus}>
        <Text style={styles.buttonText}>Acompanhar meu pedido</Text>
      </TouchableOpacity>
      <View style={{ height: 12 }} />
      <TouchableOpacity style={[styles.button, { backgroundColor: '#F2CA85' }]} onPress={handleGoToOrders}>
        <Text style={styles.buttonText}>Ir para Meus pedidos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    color: '#DDD',
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3FFFA3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#1d1d2e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
