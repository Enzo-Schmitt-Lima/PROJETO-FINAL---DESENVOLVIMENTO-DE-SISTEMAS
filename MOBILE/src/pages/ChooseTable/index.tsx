import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

type StackParamsList = {
  Order: { number: number; order_id: string };
};

interface Table {
  id: number;
  number: number;
}

export default function ChooseTable() {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  useEffect(() => {
    async function getTables() {
      try {
        const response = await api.get<Table[]>('/tables', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTables(response.data);
      } catch (err) {
        console.log('Erro ao buscar mesas:', err);
        Alert.alert('Erro', 'Não foi possível carregar as mesas.');
      } finally {
        setLoading(false);
      }
    }

    if (token) getTables();
  }, [token]);

  async function handleSelectTable(table: Table) {
    setSelectedTable(table.number);
    setLoadingTable(true);

    try {
      const response = await api.post(
        '/order',
        { table: table.number },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id: orderId } = response.data;
      navigation.navigate('Order', { number: table.number, order_id: orderId });
    } catch (err) {
      console.log('Erro ao criar pedido:', err);
      Alert.alert('Erro', 'Não foi possível criar o pedido.');
    } finally {
      setLoadingTable(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando mesas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {tables.map((table) => (
        <TouchableOpacity
          key={table.id} // chave única
          style={[
            styles.tableButton,
            selectedTable === table.number && styles.selectedTable,
          ]}
          onPress={() => handleSelectTable(table)}
        >
          {loadingTable && selectedTable === table.number ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.tableButtonText}>Mesa {table.number}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#363636', padding: 20 },
  tableButton: { backgroundColor: '#b33d3d', padding: 15, borderRadius: 8, marginBottom: 10 },
  selectedTable: { backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#fff' },
  tableButtonText: { color: '#fff', fontWeight: 'bold' },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', fontSize: 18, marginTop: 10 },
});
