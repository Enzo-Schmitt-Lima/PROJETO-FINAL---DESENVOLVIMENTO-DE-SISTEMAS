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
        // Usar o campo occupied retornado pelo backend, sem sobrescrever
        setTables(response.data);
      } catch (err) {
        console.log('Erro ao carregar mesas:', err);
      }
    }
    loadTables();
  }, []);

  async function handleSelectTable(tableId: number, tableNumber: number) {
    try {
      const response = await api.post('/order', { table: tableId });
      const order = response.data;
      // Passa o objeto completo do pedido
      navigation.navigate('Order', { number: tableNumber, order_id: order.id, order });
    } catch (err) {
      console.log('Erro ao criar o pedido:', err);
    }
  };

  const handleProsseguir = () => {
    navigation.navigate('Order', { mesa: mesaSelecionada });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* NOVO CONTAINER PRINCIPAL */}
      <View style={styles.mainContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={40} color="#333" />
          </TouchableOpacity>
          <Image
            source={require("../ChooseTable/logo.png")}
            style={styles.logoImage}
          />
          <View style={styles.headerRight}>
            <TouchableOpacity style={{ marginRight: 15 }}>
              <Ionicons name="cart-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="person-circle-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTEÚDO */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Escolher mesa</Text>

            <Text style={styles.subTitle}>Mesas Disponíveis (1º Andar):</Text>
            {mesasAndar1.map((mesa) => {
              const isOcupada = mesasOcupadas.includes(mesa);
              const isSelecionada = mesaSelecionada === mesa;
              return (
                <TouchableOpacity
                  key={mesa}
                  disabled={isOcupada}
                  onPress={() => handleSelecionarMesa(mesa)}
                  style={[
                    styles.mesaBtn,
                    isOcupada && styles.mesaOcupadaBtn,
                    isSelecionada && styles.mesaSelecionadaBtn,
                  ]}
                >
                  <Text style={[styles.mesaText, isOcupada && styles.mesaOcupadaText]}>
                    {mesa}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.subTitle}>Mesas Disponíveis (2º Andar):</Text>
            {mesasAndar2.map((mesa) => {
              const isOcupada = mesasOcupadas.includes(mesa);
              const isSelecionada = mesaSelecionada === mesa;
              return (
                <TouchableOpacity
                  key={mesa}
                  disabled={isOcupada}
                  onPress={() => handleSelecionarMesa(mesa)}
                  style={[
                    styles.mesaBtn,
                    isOcupada && styles.mesaOcupadaBtn,
                    isSelecionada && styles.mesaSelecionadaBtn,
                  ]}
                >
                  <Text style={[styles.mesaText, isOcupada && styles.mesaOcupadaText]}>
                    {mesa}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[styles.prosseguirBtn, !mesaSelecionada && styles.prosseguirBtnDisabled]}
              disabled={!mesaSelecionada}
              onPress={handleProsseguir}
            >
              <Text style={styles.prosseguirText}>PROSSEGUIR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F09",
  },

mainContent: {
  flex: 1,
  backgroundColor: '#d9d9d9',
  borderRadius: 34,
  marginHorizontal: 10,
  marginBottom: 10,
},

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
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
    marginLeft: 40,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },

  card: {
    width: "100%",
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2c3e50",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
    marginVertical: 8,
    textDecorationLine: "underline",
    paddingHorizontal: 10,
  },
  mesaBtn: {
    backgroundColor: "#D32F2F",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: "60%",
    alignItems: "center",
    alignSelf: 'center',
  },
  mesaOcupadaBtn: {
    backgroundColor: "#BDBDBD",
  },
  mesaSelecionadaBtn: {
    backgroundColor: "#911F09",
  },
  mesaText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mesaOcupadaText: {
    color: "#757575",
  },
  prosseguirBtn: {
    backgroundColor: "#F2CA85",
    borderRadius: 25,
    paddingVertical: 12,
    alignSelf: "center",
    paddingHorizontal: 40,
    marginTop: 20,
  },
  prosseguirBtnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  prosseguirText: {
    color: "#4F5476",
    fontWeight: "bold",
    fontSize: 16,
  },
});