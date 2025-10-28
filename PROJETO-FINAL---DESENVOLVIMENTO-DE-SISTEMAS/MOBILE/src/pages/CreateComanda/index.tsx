import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { Ionicons } from '@expo/vector-icons';
import HamburgerMenu from '../../components/HamburgerMenu';

const LOGO_PATH = require('../../../assets/logo.png');

interface TableProps {
  id: number;
  number: number;
  occupied?: boolean;
  floor?: number;
}

export default function CreateComanda() {
  const { user, signOut } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Função para encontrar mesa disponível automaticamente
  const findAvailableTable = async (): Promise<TableProps | null> => {
    try {
      const response = await api.get('/tables');
      const tables: TableProps[] = response.data as TableProps[];

      // Filtrar mesas disponíveis (não ocupadas)
      const availableTables = tables.filter(table => !table.occupied);

      if (availableTables.length === 0) {
        return null; // Nenhuma mesa disponível
      }

      // Retornar a primeira mesa disponível (menor número)
      return availableTables.sort((a, b) => a.number - b.number)[0];
    } catch (err) {
      console.log('Erro ao buscar mesas:', err);
      return null;
    }
  };

  // Função para criar comanda automaticamente
  const handleCreateComanda = async () => {
    setLoading(true);
    try {
      // Encontrar mesa disponível
      const availableTable = await findAvailableTable();

      if (!availableTable) {
        Alert.alert(
          "Mesas Indisponíveis",
          "Todas as mesas estão ocupadas no momento. Tente novamente mais tarde.",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      // Criar pedido para a mesa disponível
      const response = await api.post('/order', { table: availableTable.id });
      const order = response.data as any;

      // Armazenar o ID da mesa atual
      await AsyncStorage.setItem('currentTableId', availableTable.id.toString());

      // Navegar para a tela de pedido
      navigation.navigate('Order', {
        number: availableTable.number,
        order_id: order.id,
        order
      });

    } catch (err) {
      console.log('Erro ao criar comanda:', err);
      Alert.alert("Erro", "Não foi possível criar sua comanda. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Criar comanda automaticamente ao entrar na tela
    handleCreateComanda();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* Menu Hambúrguer */}
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ position: 'absolute', left: 25 }}>
            <Ionicons name="menu" size={28} color="#333" />
          </TouchableOpacity>
          {/* Logo */}
          <Image
            source={LOGO_PATH}
            style={styles.logoImage}
            resizeMode="contain"
          />
          {/* Carrinho e Perfil */}
          <View style={[styles.headerRight, { position: 'absolute', right: 25 }]}>
            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate('Orders')}>
              <Ionicons name="cart-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <Ionicons name="person-circle-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Menu Hambúrguer Modal */}
        <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} onNavigate={route => { setMenuVisible(false); navigation.navigate(route as any); }} />

        {/* CONTEÚDO PRINCIPAL */}
        <View style={styles.content}>
          <Text style={styles.title}>Criando sua comanda...</Text>
          <Text style={styles.subtitle}>Estamos atribuindo uma mesa disponível para você</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#911F09" />
              <Text style={styles.loadingText}>Aguarde um momento</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleCreateComanda}
            >
              <Text style={styles.retryText}>Tentar Novamente</Text>
            </TouchableOpacity>
          )}

          <Image
            source={require('../../../assets/sac.png')}
            style={styles.sacImage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F09",
  },

  mainContent: {
    flex: 1,
    backgroundColor: '#d9d9d9',
    borderRadius: 34,
    marginHorizontal: 15,
    marginBottom: 25,
    marginTop: 45,
  },

  // --- HEADER ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#d9d9d9',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  logoImage: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  // --- CONTEÚDO ---
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 40,
  },

  loadingContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#911F09",
    fontWeight: "500",
  },

  retryButton: {
    backgroundColor: "#F2CA85",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  retryText: {
    color: "#4F5476",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: 'center',
  },

  // --- Rodapé SAC ---
  sacImage: {
    marginTop: 40,
    alignSelf: 'flex-end'
  },
});
