import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
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
      const metodoMap: { [key: string]: number } = {
        dinheiro: 3,
        cartao: 1,
        pix: 0,
      };
      const metodoNum = metodoMap[paymentMethod];
      let pagamentoId;
      const orderDetailResponse = await api.get(`/order/detail?order_id=${order.id}`);
      const pagamentoArray = orderDetailResponse.data.pagamento || [];
      if (pagamentoArray.length > 0) {
        pagamentoId = pagamentoArray[0].id;
      } else {
        try {
          const createPaymentResponse = await api.post('/pagamento', {
            order_id: order.id,
            amount: total,
            metodo: metodoNum,
          });
          pagamentoId = createPaymentResponse.data.id;
        } catch (createError: any) {
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
      await api.put('/pagamento/metodo', {
        pagamento_id: pagamentoId,
        metodo: metodoNum,
      });
      await api.put('/pagamento/status', {
        pagamento_id: pagamentoId,
        status: 1,
      });
      await api.put('/order/finish', {
        order_id: order.id,
      });
      Alert.alert('Pagamento Concluído!', `O pedido na mesa ${number} foi pago com sucesso.`);
      navigation.navigate('OrderStatus', { number, order, total });
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err);
      let errorMessage = 'Ocorreu um erro ao processar o pagamento. Tente novamente.';
      if (err.response?.data?.error) {
        errorMessage += `\n\nDetalhes: ${err.response.data.error}`;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

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
    if (paymentMethod === 'dinheiro') {
        return (
          <View style={styles.extraFieldsMoney}>
            <Text style={styles.extraLabel}>Por favor, espere o garçom se dirigir à sua mesa</Text>
          </View>
        );
      }
    return null;
  };

  const paymentOptions = [
    { key: 'cartao', label: 'Cartão de crédito / débito (físico)' },
    { key: 'pix', label: 'PIX (digital)' },
    { key: 'carteira', label: 'Carteira digital (digital)' },
    { key: 'dinheiro', label: 'Dinheiro (físico)' },
  ];

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
        {/* REMOVIDO: O BOTÃO "X" */}
        
        {/* Ajuste do título para alinhar à esquerda, agora que o 'X' sumiu */}
        <Text style={[styles.cardTitle, {alignSelf: 'flex-start', marginLeft: 10}]}>Pagar com:</Text>
        
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
    paddingVertical: 45,
    paddingHorizontal: 20,
    width: '95%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A3A6B',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#1A3A6B',
    marginRight: 12,
  },
  radioSelected: {
    backgroundColor: '#60a95bff',
    borderColor: '#2b6b29ff',
  },
  radioLabel: {
    fontSize: 17,
    color: '#1A3A6B',
  },
  extraFieldsCard: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  extraFieldsMoney: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 'auto',
    paddingTop: 10,
    justifyContent: 'space-between', // Garante espaço entre os botões
    alignItems: 'center', // Garante que estejam alinhados verticalmente
  },
  backButton: {
    backgroundColor: '#B72F14',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center', // CENTRALIZA CONTEÚDO VERTICALMENTE
    alignItems: 'center',     // CENTRALIZA CONTEÚDO HORIZONTALMENTE
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center', // CENTRALIZA O TEXTO
  },
  finishButton: {
    backgroundColor: '#F2CA85',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center', // CENTRALIZA CONTEÚDO VERTICALMENTE
    alignItems: 'center',     // CENTRALIZA CONTEÚDO HORIZONTALMENTE
  },
  finishButtonText: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center', // CENTRALIZA O TEXTO
  },
  sacImage: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 14,
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
});