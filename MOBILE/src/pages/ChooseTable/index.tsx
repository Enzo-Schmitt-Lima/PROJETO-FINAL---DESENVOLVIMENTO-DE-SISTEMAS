import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  ChooseTable: undefined;
  Order: { tableId: number, orderId: string };
};

type ChooseTableScreenProps = NativeStackScreenProps<RootStackParamList, 'ChooseTable'>;

export default function ChooseTable() {
  const navigation = useNavigation<ChooseTableScreenProps['navigation']>();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);

  useEffect(() => {
    async function getTables() {
      try {
        const response = await api.get('/tables');
        setTables(response.data);
      } catch (err) {
        console.log('Erro ao buscar as mesas: ', err);
      } finally {
        setLoading(false);
      }
    }
    getTables();
  }, []);

  async function handleSelectTable(tableNumber: number) {
    setLoadingTable(true);
    try {
      const response = await api.post('/order', {
        table: tableNumber,
      });

      const { id: orderId } = response.data;
      
      console.log(`Pedido criado com sucesso! ID: ${orderId}`);
      
      navigation.navigate('Order', { tableId: tableNumber, orderId });

    } catch (err) {
      console.log('Erro ao criar pedido: ', err);
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
    <View style={styles.container}>
      <Text style={styles.title}>Escolha a Mesa</Text>
      <FlatList
        data={tables}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.tableButton}
            onPress={() => handleSelectTable(item)}
          >
            {loadingTable ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.tableNumber}>{item}</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#101026',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  tableButton: {
    backgroundColor: '#383840',
    padding: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 150,
    alignItems: 'center',
  },
  tableNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
