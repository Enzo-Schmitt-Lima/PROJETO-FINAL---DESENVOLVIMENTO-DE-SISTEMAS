import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Payment {
  id: string;
  order: { id: string; items: { product: { name: string }; amount: number }[] };
  method: string;
  statusText?: string;
  orderStatusText?: string;
  orderFinalized?: boolean;
  created_at: string;
  amount: number;
}

export default function Payments() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { isGuest, user } = useContext(AuthContext);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      Alert.alert('Acesso Restrito', 'Você deve estar logado para ver seus pagamentos.');
      navigation.goBack();
      return;
    }

    async function loadPayments() {
      try {
        const token = user?.token || await AsyncStorage.getItem('@App:token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/payments');
        setPayments(response.data as any[]);
      } catch (err) {
        console.log('Erro ao carregar pagamentos:', err, (err as any)?.response?.data, (err as any)?.response?.status);
        const status = (err as any)?.response?.status;
        if (status === 401) {
          try {
            const stored = await AsyncStorage.getItem('@App:token');
            if (stored) {
              api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
              const retry = await api.get('/payments');
              setPayments(retry.data as any[]);
              return;
            }
          } catch (retryErr) {
            console.log('Retry erro payments:', retryErr);
          }

          Alert.alert('Sessão expirada', 'Faça login novamente.');
          navigation.navigate('SignIn');
          return;
        }
        Alert.alert('Erro', 'Não foi possível carregar os pagamentos.');
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, [isGuest, user, navigation]);

  const getDesc = (items: Payment['order']['items']) => {
    return items.map(item => `${item.product.name} x${item.amount}`).join(' + ');
  };

  return (
    <SafeAreaView style={styles.bgContainer}>
      <View style={styles.cardContainer}>
  <TouchableOpacity style={styles.topBack} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
        <Text style={styles.title}>Meus pagamentos</Text>
        <View style={styles.searchBar}><TextInput style={styles.searchInput} placeholder="" /></View>

        <ScrollView style={{ width: '100%', flex: 1 }}>
          {loading ? (
            <Text style={styles.loadingText}>Carregando pagamentos...</Text>
          ) : payments.length === 0 ? (
            <Text style={styles.noPaymentsText}>Nenhum pagamento encontrado.</Text>
          ) : (
            payments.map(payment => (
              <TouchableOpacity key={payment.id} style={styles.paymentBox}>
                <Text style={styles.paymentText}>{getDesc(payment.order.items)}</Text>
                <Text style={styles.paymentSub}>
                  Total: R$ {payment.amount.toFixed(2)} | Método: {payment.method} | Status: {payment.statusText || '—'}{payment.orderFinalized ? ' | Pedido finalizado' : ''} | {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <Image source={require('../../../assets/sac.png')} style={styles.sacImage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: '#911F09',
    alignItems: 'center'
  },
  cardContainer: {
    marginTop: 20,
    marginBottom: 40,
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    padding: 20,
    width: '95%',
    maxWidth: 420,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    position: 'relative'
  },
  topBack: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: 8,
    backgroundColor: '#B72F14',
    borderRadius: 8,
    zIndex: 10,
  },
  logoImage: { width: 120, height: 40, resizeMode: 'contain', alignSelf: 'center', marginBottom: 8 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A3A6B',
    marginBottom: 18,
    marginTop: 10,
    textAlign: 'center',
    width: '100%'
  },
  searchBar: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    padding: 6,
    width: '100%',
    marginBottom: 12
  },
  searchInput: {
    fontSize: 16,
    color: '#1A3A6B',
    padding: 4
  },
  paymentBox: {
    backgroundColor: '#B72F14',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start'

  },
  paymentText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    flexWrap: 'wrap'
  },
  paymentSub: {
    color: '#FFF',
    fontSize: 13,
    marginTop: 4,
    flexWrap: 'wrap'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1A3A6B',
    marginTop: 20
  },
  noPaymentsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1A3A6B',
    marginTop: 20
  },
  sacImage: {
    marginTop: 10,
    alignSelf: 'flex-end'
  },
});
