import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

interface TableProps {
  id: number;
  number: number;
  occupied?: boolean;
}

export default function ChooseTable() {
  const { user, signOut } = useContext(AuthContext);
  const [tables, setTables] = useState<TableProps[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  useEffect(() => {
    async function loadTables() {
      try {
        const response = await api.get('/tables');
        const updatedTables = response.data.map((table: TableProps) => ({
          ...table,
          occupied: [5, 7, 12].includes(table.number),
        }));
        setTables(updatedTables);
      } catch (err) {
        console.log('Erro ao carregar mesas:', err);
      }
    }
    loadTables();
  }, []);

  async function handleSelectTable(tableId: number, tableNumber: number) {
    try {
      const response = await api.post('/order', { table: tableId });
      const order_id = response.data.id;
      navigation.navigate('Order', { number: tableNumber, order_id });
    } catch (err) {
      console.log('Erro ao criar o pedido:', err);
    }
  }

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const buttonWidth = (screenWidth - 40 - (numColumns - 1) * 10) / numColumns;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Olá, {user?.name}</Text>

      <FlatList
        data={tables}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tableButton,
              { width: buttonWidth },
              item.occupied ? { backgroundColor: 'gray' } : {},
            ]}
            onPress={() => !item.occupied && handleSelectTable(item.id, item.number)}
            disabled={item.occupied}
          >
            <Text style={styles.tableText}>Mesa {item.number}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1d1d2e' },
  title: { fontSize: 20, color: '#FFF', marginBottom: 20 },
  tableButton: {
    paddingVertical: 25,
    backgroundColor: '#3FFFA3',
    borderRadius: 10,
    alignItems: 'center',
  },
  tableText: { color: '#101026', fontWeight: 'bold' },
  logoutButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#FF3F4B',
    borderRadius: 6,
    zIndex: 10,
  },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
});
