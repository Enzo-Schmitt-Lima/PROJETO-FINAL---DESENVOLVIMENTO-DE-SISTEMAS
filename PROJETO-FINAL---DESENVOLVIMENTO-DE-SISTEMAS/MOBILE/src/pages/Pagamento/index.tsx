import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';

type PaymentRouteProp = RouteProp<StackParamsList, 'Payment'>;

export default function Payment() {
  console.log('[Payment] Componente renderizado');
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

      // SEMPRE buscar dados atualizados do pedido
      const orderDetailResponse = await api.get(`/order/detail?order_id=${order.id}`);
      const pagamentoArray = orderDetailResponse.data.pagamento || [];

      if (pagamentoArray.length > 0) {
        // Já existe pagamento, usar o ID existente
        pagamentoId = pagamentoArray[0].id;
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
          if (
            createError.response?.status === 409 &&
            createError.response?.data?.error?.includes('Pagamento já existe')
          ) {
            Alert.alert('Pagamento já existe', 'Já existe um pagamento para este pedido. O status será atualizado.');
            const orderDetailRetry = await api.get(`/order/detail?order_id=${order.id}`);
            if (orderDetailRetry.data.pagamento && orderDetailRetry.data.pagamento.length > 0) {
              pagamentoId = orderDetailRetry.data.pagamento[0].id;
            } else {
              throw new Error('Não foi possível obter o ID do pagamento existente');
            }
          } else {
            let errorMessage = 'Ocorreu um erro ao processar o pagamento. Tente novamente.';
            if (createError.response?.data?.error) {
              errorMessage += `\n\nDetalhes: ${createError.response.data.error}`;
            }
            Alert.alert('Erro', errorMessage);
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
  navigation.navigate('OrderStatus', { number, order, total });
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

  // Campos extras para cada método
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [walletCode, setWalletCode] = useState('');

  // Função para renderizar campos extras
  const renderExtraFields = () => {
    if (paymentMethod === 'cartao') {
      return (
        <View style={styles.extraFieldsCard}>
          <Text style={styles.extraLabel}>Preencha (caso não tenha cartão online):</Text>
          <TextInput style={styles.input} placeholder="Número do cartão" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Nome no cartão" value={cardName} onChangeText={setCardName} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Validade (MM/AA)" value={cardExpiry} onChangeText={setCardExpiry} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="CVV" value={cardCVV} onChangeText={setCardCVV} keyboardType="numeric" />
          </View>
        </View>
      );
    }
    if (paymentMethod === 'pix') {
      return (
        <View style={styles.extraFieldsPix}>
          <Text style={styles.extraLabel}>PIX: copie e cole</Text>
          <TextInput style={styles.input} placeholder="Código PIX" value={pixCode} onChangeText={setPixCode} />
        </View>
      );
    }
    if (paymentMethod === 'carteira') {
      return (
        <View style={styles.extraFieldsWallet}>
          <Text style={styles.extraLabel}>Preencha (cartão online):</Text>
          <TextInput style={styles.input} placeholder="Código da carteira" value={walletCode} onChangeText={setWalletCode} />
        </View>
      );
    }
    if (paymentMethod === 'dinheiro') {
      return (
        <View style={styles.extraFieldsMoney}>
          <Text style={styles.extraLabel}>Por favor, espere o garçom se dirigir à sua mesa</Text>
        </View>
      );
    }
    return null;
  };

  // Métodos de pagamento
  const paymentOptions = [
    { key: 'cartao', label: 'Cartão de crédito / débito (físico)' },
    { key: 'pix', label: 'PIX (digital)' },
    { key: 'carteira', label: 'Carteira digital (digital)' },
    { key: 'dinheiro', label: 'Dinheiro (físico)' },
  ];

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: '#911F09' }}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Pagar com:</Text>
        <View style={styles.optionsContainer}>
          {paymentOptions.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={styles.radioRow}
              onPress={() => setPaymentMethod(opt.key)}
            >
              <View style={[styles.radioCircle, paymentMethod === opt.key && styles.radioSelected]} />
              <Text style={styles.radioLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderExtraFields()}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finishButton} onPress={handlePayment} disabled={loading}>
            <Text style={styles.finishButtonText}>{loading ? 'Processando...' : paymentMethod === 'dinheiro' ? 'FINALIZAR PEDIDO' : 'FINALIZAR PAGAMENTO'}</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 0,
  },
  cardContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: '95%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 2,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A3A6B',
    marginBottom: 18,
    marginTop: 10,
    textAlign: 'left',
    width: '100%',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 18,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#1A3A6B',
    marginRight: 12,
    backgroundColor: '#FFF',
  },
  radioSelected: {
    backgroundColor: '#3fffa3',
    borderColor: '#3fffa3',
  },
  radioLabel: {
    fontSize: 17,
    color: '#1A3A6B',
    fontWeight: '500',
  },
  extraFieldsCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  extraFieldsPix: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  extraFieldsWallet: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  extraFieldsMoney: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  extraLabel: {
    fontSize: 15,
    color: '#1A3A6B',
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#1A3A6B',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: '#B72F14',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: '#F2CA85',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  finishButtonText: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sacText: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
});
