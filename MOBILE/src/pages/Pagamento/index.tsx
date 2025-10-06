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

  console.log('Payment page - route params:', { number, order, total });
  console.log('Payment page - order object:', order);
  console.log('Payment page - order.id:', order?.id);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      Alert.alert('Forma de Pagamento', 'Por favor, selecione uma forma de pagamento.');
      return;
    }

    setLoading(true);

    try {
      // Mapear método para número conforme enum do backend
      const metodoMap: { [key: string]: number } = {
        dinheiro: 3,
        cartao: 1,
        pix: 0,
      };
      const metodoNum = metodoMap[paymentMethod];

      let pagamentoId;

      // Verificar se o pedido já tem pagamento
      if (order.pagamento && order.pagamento.length > 0) {
        pagamentoId = order.pagamento[0].id;
      } else {
        // Criar um novo pagamento para o pedido
        try {
          const createPaymentResponse = await api.post('/pagamento', {
            order_id: order.id,
            amount: total,
            metodo: metodoNum,
          });
          pagamentoId = createPaymentResponse.data.id;
        } catch (createError: any) {
          // Se já existe pagamento, buscar o ID existente
          if (createError.response?.status === 500 && createError.response?.data?.error?.includes('Pagamento já existe')) {
            const orderDetailResponse = await api.get(`/order/detail?order_id=${order.id}`);
            if (orderDetailResponse.data.pagamento && orderDetailResponse.data.pagamento.length > 0) {
              pagamentoId = orderDetailResponse.data.pagamento[0].id;
            } else {
              throw new Error('Não foi possível obter o ID do pagamento existente');
            }
          } else {
            throw createError;
          }
        }
      }

      // Atualiza método de pagamento
      await api.put('/pagamento/metodo', {
        pagamento_id: pagamentoId,
        metodo: metodoNum,
      });

      // Atualiza status do pagamento para PAID (1)
      await api.put('/pagamento/status', {
        pagamento_id: pagamentoId,
        status: 1,
      });

      // Finaliza o pedido
      await api.put('/order/finish', {
        order_id: order.id,
      });

      Alert.alert('Pagamento Concluído!', `O pedido na mesa ${number} foi pago com sucesso.`);
      navigation.popToTop(); // volta para a tela inicial
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err);
      console.error('Detalhes do erro:', err.response?.data);
      console.error('Status:', err.response?.status);
      console.error('URL:', err.config?.url);

      let errorMessage = 'Ocorreu um erro ao processar o pagamento. Tente novamente.';
      if (err.response?.data?.error) {
        errorMessage += `\n\nDetalhes: ${err.response.data.error}`;
      }

      Alert.alert('Erro', errorMessage);
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
