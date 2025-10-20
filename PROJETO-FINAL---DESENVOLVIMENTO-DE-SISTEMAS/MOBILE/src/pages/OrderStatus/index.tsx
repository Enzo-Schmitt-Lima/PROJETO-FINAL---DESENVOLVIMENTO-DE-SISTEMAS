import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
        <Text style={styles.info}>Total: R$ {total.toFixed(2)}</Text>
        <Text style={styles.status}>Seu pedido está sendo preparado!</Text>
        <TouchableOpacity style={styles.button} onPress={handleOrderArrived}>
          <Text style={styles.buttonText}>O pedido chegou?</Text>
        </TouchableOpacity>
            <Image 
              source={require('../../../assets/sac.png')} 
              style={styles.sacImage} 
            />
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
    padding: 78,
    width: '95%',
    height: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1A3A6B',
    marginBottom: 18,
    marginTop: 100,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 25,
    color: '#101026',
    marginBottom: 22,
  },
  info: {
    fontSize: 20,
    color: '#101026',
    marginBottom: 30,
    marginTop: 8,
    textAlign: 'justify'
  },
  status: {
    fontSize: 20,
    color: '#911F09',
    fontWeight: 'bold',
    marginBottom: 34,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F2CA85',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 20,
  },
  sacImage: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
});