import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';

// BOTÃO VOLTAR
export function BackButton() {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleGoBack}>
      <Feather name="arrow-left" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

// BOTÃO LOGOUT
export function LogoutButton() {
  const { signOut } = useContext(AuthContext);

  function handleLogout() {
    Alert.alert(
      'Logout',
      'Tem certeza que quer sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => signOut() },
      ]
    );
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Feather name="log-out" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});
    