import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Platform, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamsList } from '../../routes/app.routes';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PaymentRouteProp = RouteProp<AppStackParamsList, 'Payment'>;

export default function Payment() {
  const route = useRoute<PaymentRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamsList>>();
  const { number, order, total } = route.params;

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 24;
  // add extra spacing so icons are not too close to notch/statusbar
  const topExtra = 20;
  const topOffsetWithExtra = topOffset + topExtra;

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

      // SEMPRE buscar dados atualizados do pedido
      const orderDetailResponse = await api.get(`/order/detail?order_id=${order.id}`);
      const pagamentoArray = (orderDetailResponse.data as any).pagamento || [];

      if (pagamentoArray.length > 0) {
        pagamentoId = pagamentoArray[0].id;
      } else {
        try {
          const createPaymentResponse = await api.post('/pagamento', {
            order_id: order.id,
            amount: total,
            metodo: metodoNum,
          });
          pagamentoId = (createPaymentResponse.data as any).id;
        } catch (createError: any) {
          if (
            createError.response?.status === 409 &&
            createError.response?.data?.error?.includes('Pagamento já existe')
          ) {
            Alert.alert('Pagamento já existe', 'Já existe um pagamento para este pedido. O status será atualizado.');
            const orderDetailRetry = await api.get(`/order/detail?order_id=${order.id}`);
            const retryData = orderDetailRetry.data as any;
            if (retryData.pagamento && retryData.pagamento.length > 0) {
              pagamentoId = retryData.pagamento[0].id;
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

      // Não finalizar o pedido automaticamente — apenas atualizar os dados do pedido
      try {
        const updatedOrderResp = await api.get(`/order/detail?order_id=${order.id}`);
        const updatedOrder = (updatedOrderResp.data as any).order || updatedOrderResp.data;

        // **CORREÇÃO APLICADA AQUI:**
        // Usamos 'replace' em vez de 'navigate' para que a tela 'Orders' substitua 'Payment'
        // no histórico de navegação. Isso impede que o usuário volte para as telas de pedido
        // ou pagamento após a conclusão, e garante que a próxima tela ao "voltar" seja
        // a tela anterior ao início do pedido (a tela "ABRIR MESA" ou Dashboard).
        navigation.replace('Orders', { order_id: order.id, number: route.params.number, fromPayment: true });

      } catch (errRefresh: any) {
        console.error('Erro ao atualizar pedido após pagamento:', errRefresh);
        // Em caso de erro, ainda substituímos a tela.
        navigation.replace('Orders');
      }
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

  const refreshOrder = async () => {
    if (!order?.id) return;
    try {
      setRefreshing(true);
      const resp = await api.get(`/order/detail?order_id=${order.id}`);
      const updatedOrder = (resp.data as any).order || (resp.data as any);
      console.log('[Payment] order refreshed', updatedOrder);
      Alert.alert('Atualizado', 'Dados do pedido atualizados.');
    } catch (err) {
      console.error('Erro ao atualizar pedido:', err);
      Alert.alert('Erro', 'Não foi possível atualizar o pedido agora.');
    } finally {
      setRefreshing(false);
    }
  };

  // Campos extras para cada método
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
    { key: 'dinheiro', label: 'Dinheiro (físico)' },
  ];

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={[styles.refreshIcon, { top: topOffsetWithExtra }]} onPress={refreshOrder}>
          <Ionicons name="refresh" size={20} color="#911F09" />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#911F09',
    marginBottom: 30,
  },
  refreshIcon: {
    position: 'absolute',
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  optionsContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#911F09',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  radioSelected: {
    backgroundColor: '#911F09',
  },
  radioLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  extraFieldsCard: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#F2CA85',
    marginBottom: 20,
  },
  extraFieldsMoney: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#F2CA85',
    marginBottom: 20,
    alignItems: 'center',
  },
  extraLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D3A2F',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#EEE',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#B72F14',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  finishButton: {
    flex: 1,
    backgroundColor: '#F2CA85',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#101026',
    fontWeight: 'bold',
    fontSize: 16,
  },
});