import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

type OrderStatusRouteProp = RouteProp<StackParamsList, 'OrderStatus'>;

export default function OrderStatus() {
  const route = useRoute<OrderStatusRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { number, order, total } = route.params;

  const handleOrderArrived = () => {
    navigation.navigate('Feedback');
  };

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Status do Pedido</Text>
        <Text style={styles.subtitle}>Mesa {number}</Text>
        <Text style={styles.info}>Pedido ID: {order.id}</Text>
        <Text style={styles.info}>Total: R$ {total.toFixed(2)}</Text>
        <Text style={styles.status}>Seu pedido está sendo preparado!</Text>
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
