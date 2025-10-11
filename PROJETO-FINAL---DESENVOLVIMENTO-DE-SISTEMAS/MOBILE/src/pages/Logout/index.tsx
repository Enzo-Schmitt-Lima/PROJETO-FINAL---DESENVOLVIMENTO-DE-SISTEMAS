import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { AuthContext } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function Logout() {
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    // Liberar a mesa atual se existir
    const tableId = await AsyncStorage.getItem('currentTableId');
    if (tableId) {
      try {
        await api.put(`/table/${tableId}`, { status: 'free' });
      } catch (err) {
        console.log('Erro ao liberar mesa:', err);
      }
      await AsyncStorage.removeItem('currentTableId');
    }

    // Fazer logout
    signOut();
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Sair da sua conta?</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.yesButton} onPress={handleLogout}>
              <Text style={styles.yesText}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noButton} onPress={() => setVisible(false)}>
              <Text style={styles.noText}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.08)', justifyContent: 'center', alignItems: 'center' },
  cardContainer: { backgroundColor: '#B72F14', borderRadius: 18, padding: 28, minWidth: 220, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.18, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 6 },
  title: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginBottom: 18 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  yesButton: { backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', flex: 1, marginRight: 10 },
  yesText: { color: '#B72F14', fontWeight: 'bold', fontSize: 16 },
  noButton: { backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', flex: 1 },
  noText: { color: '#B72F14', fontWeight: 'bold', fontSize: 16 },
});
