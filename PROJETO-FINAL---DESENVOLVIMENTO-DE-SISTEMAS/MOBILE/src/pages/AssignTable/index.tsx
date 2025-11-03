import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import api from '../../services/api';

interface Table {
  id: string;
  number: number;
  status: boolean; // true = occupied, false = available
}

export default function AssignTable() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTables() {
      try {
        const response = await api.get('/tables');
        setTables(response.data as Table[]);
      } catch (err) {
        console.log('Erro ao carregar mesas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTables();
  }, []);

  const handleTableSelect = (table: Table) => {
    // Navigate to CreateComanda with table number regardless of status
    navigation.navigate('CreateComanda', { tableNumber: table.number });
  };

  const renderTable = ({ item }: { item: Table }) => (
    <TouchableOpacity
      style={[styles.tableButton, item.status && styles.occupiedTable]}
      onPress={() => handleTableSelect(item)}
    >
      <Text style={styles.tableNumber}>{item.number}</Text>
      <Text style={styles.tableStatus}>
        {item.status ? 'Ocupada' : 'Disponível'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Escolher Mesa</Text>
        <Text style={styles.subtitle}>Selecione uma mesa para começar seu pedido</Text>
        {loading ? (
          <Text style={styles.loadingText}>Carregando mesas...</Text>
        ) : (
          <FlatList
            data={tables}
            renderItem={renderTable}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.tableGrid}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: '#911F09',
    alignItems: 'center',
  },
  cardContainer: {
    marginTop: 50,
    marginBottom: 40,
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    padding: 28,
    width: '95%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  backText: {
    color: '#911F09',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A3A6B',
    marginBottom: 8,
    marginTop: 10,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1A3A6B',
    marginTop: 20,
  },
  tableGrid: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  tableButton: {
    backgroundColor: '#B72F14',
    borderRadius: 10,
    padding: 20,
    margin: 8,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  occupiedTable: {
    backgroundColor: '#911F09',
  },
  tableNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableStatus: {
    color: '#FFF',
    fontSize: 10,
    marginTop: 2,
  },
});
