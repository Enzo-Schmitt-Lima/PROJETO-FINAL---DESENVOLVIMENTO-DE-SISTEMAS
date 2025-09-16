import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
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
            const response = await api.get('/tables');
            setTables(response.data);
        }
        loadTables();
    }, []);

    async function handleSelectTable(tableNumber: number) {
        try {
            // A requisição envia apenas o 'table', que agora é o valor esperado
            const response = await api.post('/order', {
                table: tableNumber
            });
            const order_id = response.data.id;

            navigation.navigate('Order', {
                number: tableNumber,
                order_id: order_id
            });
        } catch (err) {
            console.log('Erro ao criar o pedido:', err);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Olá, {user?.name}</Text>
            <FlatList
                data={tables}
                keyExtractor={(item) => String(item.number)}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.tableButton} onPress={() => handleSelectTable(item.number)}>
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