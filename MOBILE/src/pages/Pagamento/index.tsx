import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';

type PaymentRouteProp = RouteProp<StackParamsList, 'Payment'>;

export default function Payment() {
  const route = useRoute<PaymentRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { number, order, total } = route.params;

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      Alert.alert('Forma de Pagamento', 'Por favor, selecione uma forma de pagamento.');
      return;
    }

    setLoading(true);

    try {
      // Converte o método em número: dinheiro=0, cartão=1, pix=2
      const metodoNum = paymentMethod === 'dinheiro' ? 0 : paymentMethod === 'cartao' ? 1 : 2;

      const response = await api.put(`/order/payment/${order.id}`, {
        paymentMethod: metodoNum,
        total, // total calculado no frontend
      });

      if (response.status === 200) {
        Alert.alert('Pagamento Concluído!', `O pedido na mesa ${number} foi pago com sucesso.`);
        navigation.popToTop(); // volta para a tela inicial
      } else {
        throw new Error('Erro ao finalizar o pedido');
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      Alert.alert('Erro', 'Ocorreu um erro ao processar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mesa {number}</Text>
      <Text style={styles.subTitle}>Total: R$ {total.toFixed(2)}</Text>

      <View style={styles.paymentMethods}>
        <Text style={styles.paymentTitle}>Selecione a forma de pagamento:</Text>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'dinheiro' && styles.selectedButton]}
          onPress={() => setPaymentMethod('dinheiro')}
        >
          <Text style={styles.buttonText}>Dinheiro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'cartao' && styles.selectedButton]}
          onPress={() => setPaymentMethod('cartao')}
        >
          <Text style={styles.buttonText}>Cartão de Crédito/Débito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'pix' && styles.selectedButton]}
          onPress={() => setPaymentMethod('pix')}
        >
          <Text style={styles.buttonText}>Pix</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.payButtonText}>
          {loading ? 'Processando...' : 'Finalizar Pagamento'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1d1d2e', padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  subTitle: { fontSize: 20, color: '#FFF', marginBottom: 30 },
  paymentMethods: { width: '100%', alignItems: 'center' },
  paymentTitle: { fontSize: 18, color: '#FFF', marginBottom: 15 },
  paymentButton: {
    backgroundColor: '#29295c',
    width: '90%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedButton: { backgroundColor: '#3fffa3' },
  buttonText: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
  payButton: {
    backgroundColor: '#3fffa3',
    width: '90%',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  payButtonText: { fontSize: 20, color: '#101026', fontWeight: 'bold' },
});
