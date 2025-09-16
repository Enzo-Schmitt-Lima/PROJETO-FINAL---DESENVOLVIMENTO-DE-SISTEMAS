import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

export default function ChooseTable() {
  const { user } = useContext(AuthContext);
  const [tables, setTables] = useState<any[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  useEffect(() => {
    async function loadTables() {
      try {
        const response = await api.get('/tables');
        setTables(response.data);
      } catch (err) {
        console.log('Erro ao carregar mesas:', err);
        Alert.alert('Erro', 'Não foi possível carregar as mesas.');
      }
    }
    loadTables();
  }, []);

  async function handleSelectTable(tableNumber: number) {
    try {
      const response = await api.post('/order', { table: tableNumber });
      console.log('Pedido criado:', response.data);

      const order_id = response.data.id;

      navigation.navigate('Order', {
        number: tableNumber,
        order_id: order_id
      });
    } catch (err) {
      console.log('Erro ao criar o pedido:', err);
      Alert.alert('Erro', 'Não foi possível criar o pedido.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.name}</Text>
      <FlatList
        data={tables}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tableButton}
            onPress={() => handleSelectTable(item.number)}
          >
            <Text style={styles.tableText}>Mesa {item.number}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#911F09' },
  title: { fontSize: 20, color: '#FFF', marginBottom: 20 },
  tableButton: { padding: 20, backgroundColor: '#B72F14', marginBottom: 10, borderRadius: 10, alignItems: 'center' },
  tableText: { color: '#FFF', fontWeight: 'bold' }
});
