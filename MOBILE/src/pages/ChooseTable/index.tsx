import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  ChooseTable: undefined;
  Order: { mesa: string | null };
};


type Props = NativeStackScreenProps<RootStackParamList, 'ChooseTable'>;

export default function EscolherMesa({ navigation }: Props) {
  const mesasAndar1 = ["Mesa 1", "Mesa 2", "Mesa 3", "Mesa 4", "Mesa 5", "Mesa 6"];
  const mesasAndar2 = ["Mesa 7", "Mesa 8", "Mesa 9", "Mesa 10", "Mesa 11"];
  const mesasOcupadas = ["Mesa 5", "Mesa 9", "Mesa 10"];
  const [mesaSelecionada, setMesaSelecionada] = useState<string | null>(null);

  const handleSelecionarMesa = (mesa: string) => {
    if (mesaSelecionada === mesa) {
      setMesaSelecionada(null);
    } else {
      setMesaSelecionada(mesa);
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
            <Ionicons name="menu" size={28} color="#333" />
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
    borderColor: '#D32F2F',
    borderWidth: 2,
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