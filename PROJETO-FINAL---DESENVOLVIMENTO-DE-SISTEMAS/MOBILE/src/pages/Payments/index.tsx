import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';

interface Payment {
  id: string;
  order: { id: string; items: { product: { name: string }; amount: number }[] };
  method: string;
  created_at: string;
  amount: number;
}

export default function Payments() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const response = await api.get('/payments');
        setPayments(response.data);
      } catch (err) {
        console.log('Erro ao carregar pagamentos:', err);
        Alert.alert('Erro', 'Não foi possível carregar os pagamentos.');
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const getDesc = (items: Payment['order']['items']) => {
    return items.map(item => `${item.product.name} x${item.amount}`).join(' + ');
  };

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ChooseTable')}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>RED HOT CHILLI</Text>
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
                <Text style={styles.paymentText}>#{payment.id} {getDesc(payment.order.items)}</Text>
                <Text style={styles.paymentSub}>Total: R$ {payment.amount.toFixed(2)} | Método: {payment.method} | Data: {new Date(payment.created_at).toLocaleDateString('pt-BR')}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
        <Text style={styles.sacText}>SAC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: { flex: 1, backgroundColor: '#911F09', alignItems: 'center' },
  cardContainer: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 30, padding: 28, width: '90%', maxWidth: 400, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 8, position: 'relative' },
  backButton: { position: 'absolute', top: 10, left: 10, padding: 10 },
  backText: { color: '#911F09', fontSize: 16, fontWeight: 'bold' },
  logo: { color: '#B72F14', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A3A6B', marginBottom: 18, marginTop: 10, textAlign: 'center', width: '100%' },
  searchBar: { backgroundColor: '#EEE', borderRadius: 8, padding: 6, width: '100%', marginBottom: 12 },
  searchInput: { fontSize: 16, color: '#1A3A6B', padding: 4 },
  paymentBox: { backgroundColor: '#B72F14', borderRadius: 8, padding: 14, marginBottom: 12 },
  paymentText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  paymentSub: { color: '#FFF', fontSize: 13, marginTop: 4 },
  loadingText: { textAlign: 'center', fontSize: 16, color: '#1A3A6B', marginTop: 20 },
  noPaymentsText: { textAlign: 'center', fontSize: 16, color: '#1A3A6B', marginTop: 20 },
  sacText: { color: '#911F09', fontWeight: 'bold', fontSize: 14, marginTop: 10, alignSelf: 'flex-end' },
});
