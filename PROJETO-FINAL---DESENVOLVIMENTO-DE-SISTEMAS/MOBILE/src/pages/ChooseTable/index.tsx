import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
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

// 💡 Caminho para o Logo: Ajuste esta linha para o caminho real onde você salvar o arquivo JPG
// Se você salvar o JPG em 'src/assets/logo.png', o caminho será:
const LOGO_PATH = require('../../../assets/logo.png'); 
// Se você for manter o que a sua colega usou, pode ser:
// const LOGO_PATH = require('../ChooseTable/logo.png');

// Tipo de Mesa (Mantido da sua estrutura)
interface TableProps {
  id: number;
  number: number;
  occupied?: boolean; 
  floor?: number; 
}

export default function ChooseTable() {
  const { user, signOut } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [tables, setTables] = useState<TableProps[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableProps | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // --- LÓGICA DE CARREGAMENTO DE MESAS (Seu código) ---
  useEffect(() => {
    async function loadTables() {
      try {
        const response = await api.get('/tables');
        // Adiciona 'floor' para o agrupamento visual. Ajuste esta lógica se a API retornar o andar.
        const tablesWithFloor = response.data.map((table: TableProps) => ({
          ...table,
          // Exemplo: Mesas 1 a 4 = 1º Andar; 5 em diante = 2º Andar
          floor: table.number <= 4 ? 1 : 2, 
        }));

        setTables(tablesWithFloor);
      } catch (err) {
        console.log('Erro ao carregar mesas:', err);
      }
    }
    loadTables();
  }, []);

  // Agrupa as mesas por andar
  const groupedTables = tables.reduce((acc, table) => {
    const floorKey = `${table.floor || 1}º Andar`;
    if (!acc[floorKey]) {
      acc[floorKey] = [];
    }
    acc[floorKey].push(table);
    return acc;
  }, {} as { [key: string]: TableProps[] });

  // --- LÓGICA DE SELEÇÃO E NAVEGAÇÃO ---
  async function handleSelectTableAndNavigate() {
    if (!selectedTable) {
      Alert.alert("Atenção", "Selecione uma mesa para prosseguir.");
      return;
    }
    
    if (selectedTable.occupied) {
       Alert.alert("Mesa Ocupada", `A Mesa ${selectedTable.number} está ocupada.`);
       return;
    }

    try {
      const response = await api.post('/order', { table: selectedTable.id });
      const order = response.data;

      // Armazenar o ID da mesa atual
      await AsyncStorage.setItem('currentTableId', selectedTable.id.toString());

      navigation.navigate('Order', {
        number: selectedTable.number,
        order_id: order.id,
        order
      });

    } catch (err) {
      console.log('Erro ao criar o pedido:', err);
      Alert.alert("Erro", "Não foi possível iniciar o pedido para esta mesa.");
    }
  };

  const handleSelectTable = (table: TableProps) => {
    if (!table.occupied) {
        setSelectedTable(table);
    } else {
        Alert.alert("Mesa Ocupada", `A Mesa ${table.number} está ocupada. Selecione outra.`);
    }
  };

  // --- COMPONENTE DE BOTÃO DE MESA ---
  const TableButton = ({ table }: { table: TableProps }) => {
    const isSelected = selectedTable?.id === table.id;
    
    let buttonStyle: any[] = [styles.mesaBtn];
    let textStyle: any = styles.mesaText;

    if (table.occupied) {
      buttonStyle.push(styles.mesaOcupadaBtn);
      textStyle = styles.mesaOcupadaText;
    } else if (isSelected) {
      buttonStyle.push(styles.mesaSelecionadaBtn);
    } 

    return (
      <TouchableOpacity
        key={table.id}
        disabled={table.occupied}
        onPress={() => handleSelectTable(table)}
        style={buttonStyle}
      >
        <Text style={textStyle}>Mesa {table.number}</Text>
      </TouchableOpacity>
    );
  };
  
  // --- RENDERIZAÇÃO PRINCIPAL ---
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

        {/* SCROLLVIEW DO CONTEÚDO */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Escolher mesa</Text>

            {Object.entries(groupedTables).map(([floor, tables]) => (
              <React.Fragment key={floor}>
                <Text style={styles.subTitle}>Mesas Disponíveis ({floor}):</Text>
                {tables.map(table => (
                    <TableButton key={table.id} table={table} />
                ))}
              </React.Fragment>
            ))}

            {/* BOTÃO PROSSEGUIR */}
            <TouchableOpacity
              style={[styles.prosseguirBtn, (!selectedTable || selectedTable.occupied) && styles.prosseguirBtnDisabled]}
              disabled={!selectedTable || selectedTable.occupied}
              onPress={handleSelectTableAndNavigate}
            >
              <Text style={styles.prosseguirText}>PROSSEGUIR</Text>
            </TouchableOpacity>
            
             <Text style={styles.sacText}>💬 SAC</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS (Mesmos estilos de fusão do código anterior) ---
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
    marginBottom: 10,
    marginTop: 20, 
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
    width: 120, // Largura ajustada para o logo
    height: 40,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  // --- CONTEÚDO ---
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  card: {
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 24, 
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#2c3e50", 
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  
  // --- BOTÕES DE MESA ---
  mesaBtn: {
    backgroundColor: "#D32F2F", 
    borderRadius: 5, 
    paddingVertical: 10,
    marginVertical: 4,
    width: "70%", 
    alignItems: "center",
    alignSelf: 'center',
  },
  mesaOcupadaBtn: {
    backgroundColor: "#BDBDBD", 
  },
  mesaSelecionadaBtn: {
    backgroundColor: "#911F09", 
    borderColor: '#F2CA85', 
    borderWidth: 2,
  },
  mesaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  mesaOcupadaText: {
    color: "#757575", 
  },
  
  // --- BOTÃO PROSSEGUIR ---
  prosseguirBtn: {
    backgroundColor: "#F2CA85", 
    borderRadius: 8, 
    paddingVertical: 15,
    alignSelf: "center",
    width: "80%",
    marginTop: 30,
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  prosseguirBtnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  prosseguirText: {
    color: "#4F5476",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: 'center',
  },
  
  // --- Rodapé SAC ---
  sacText: {
    textAlign: 'right',
    color: '#666',
    fontSize: 12,
    marginTop: 20,
    paddingRight: 15,
  },
});