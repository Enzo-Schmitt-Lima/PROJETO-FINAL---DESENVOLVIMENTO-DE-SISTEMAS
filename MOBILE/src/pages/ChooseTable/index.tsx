import React, { useContext, useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    Image, // Para o ícone do SAC
    ImageBackground // Se o header tiver uma imagem de fundo
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Necessário instalar: expo install expo-linear-gradient
import { AuthContext } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário
import api from '../../services/api'; // Ajuste o caminho se necessário
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes'; // Ajuste o caminho se necessário
 
// Interface para tipar os dados de cada mesa
interface TableProps {
    id: string;
    number: number;
    floor: number; // Adicionamos 'floor' para agrupar por andar
    occupied?: boolean;
}
 
// O componente agora se chama ChooseTableScreen, alinhado com a imagem
const ChooseTableScreen: React.FC = () => {
    const route = useRoute<RouteProp<StackParamsList, 'ChooseTable'>>();
    const { user, signOut } = useContext(AuthContext);
    const [tables, setTables] = useState<TableProps[]>([]);
    const [selectedTable, setSelectedTable] = useState<TableProps | null>(null); // Para controlar a mesa selecionada
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
 
    useEffect(() => {
        async function loadTables() {
            try {
                const response = await api.get('/tables');
                // Adicionei um 'floor' fictício para o exemplo, você deve vir da API
                const tablesWithFloor: TableProps[] = response.data.map((table: Omit<TableProps, 'floor'>) => ({
                    ...table,
                    floor: table.number <= 6 ? 1 : 2, // Exemplo: mesas 1-6 no 1º andar, >6 no 2º
                    occupied: [5, 7, 12].includes(table.number), // Mesas ocupadas para teste
                }));
                setTables(tablesWithFloor);
            } catch (err) {
                console.log('Erro ao carregar mesas:', err);
            }
        }
        loadTables();
    }, []);
 
    const handleSelectTable = (table: TableProps) => {
        setSelectedTable(table);
    };
 
    const handleProceed = async () => {
        if (!selectedTable) {
            alert('Por favor, selecione uma mesa para prosseguir.');
            return;
        }
        try {
            const response = await api.post('/order', { table_id: selectedTable.id });
            const { id: order_id } = response.data;
            navigation.navigate('Menu', { number: selectedTable.number, order_id });
        } catch (err) {
            console.log('Erro ao criar o pedido:', err);
            alert('Erro ao criar o pedido. Tente novamente.');
        }
    };
 
    // Agrupar mesas por andar
    const tablesByFloor: { [key: number]: TableProps[] } = tables.reduce((acc, table) => {
        if (!acc[table.floor]) {
            acc[table.floor] = [];
        }
        acc[table.floor].push(table);
        return acc;
    }, {} as { [key: number]: TableProps[] });
 
    // Dimensões do botão da mesa (3 por linha, com espaçamento)
    const screenWidth = Dimensions.get('window').width;
    const paddingHorizontal = 30; // Considerando o padding do container
    const columnGap = 10;
    const numColumns = 3;
    const tableButtonWidth = (screenWidth - (paddingHorizontal * 2) - (columnGap * (numColumns - 1))) / numColumns;
 
 
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header (Mantenho como um placeholder, você pode substituí-lo pelo seu componente de header real) */}
            <View style={styles.headerPlaceholder}>
                 <TouchableOpacity style={styles.headerIcon}>
                    <Image source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/J6j03k7Kyp/3s6zcnmg_expires_30_days.png"}} style={styles.menuIcon} />
                 </TouchableOpacity>
                 <Image source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/J6j03k7Kyp/3w9rfupk_expires_30_days.png"}} style={styles.logo} resizeMode="contain"/>
                 <View style={styles.headerRightIcons}>
                    <Image source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/J6j03k7Kyp/xrd9h0it_expires_30_days.png"}} style={styles.cartIcon} />
                    <Image source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/J6j03k7Kyp/awoocev2_expires_30_days.png"}} style={styles.userIcon} />
                 </View>
            </View>
 
            <View style={styles.container}>
                <Text style={styles.mainTitle}>Escolher mesa</Text>
 
                <FlatList
                    data={Object.keys(tablesByFloor).sort()} // Ordena os andares numericamente
                    keyExtractor={(item) => String(item)}
                    renderItem={({ item: floor }) => (
                        <View key={floor} style={styles.floorGroup}>
                            <Text style={styles.floorTitle}>Mesas Disponíveis ({floor}º Andar):</Text>
                            <View style={styles.tablesGrid}>
                                {tablesByFloor[Number(floor)].map((table) => (
                                    <TouchableOpacity
                                        key={table.id}
                                        style={[
                                            styles.tableButton,
                                            { width: tableButtonWidth, height: tableButtonWidth * 0.4 }, // Ajuste a proporção se necessário
                                            selectedTable?.id === table.id && styles.tableButtonSelected,
                                            table.occupied && styles.tableButtonOccupied,
                                        ]}
                                        onPress={() => !table.occupied && handleSelectTable(table)}
                                        disabled={table.occupied}
                                    >
                                        <Text style={styles.tableButtonText}>Mesa {table.number}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                    ListFooterComponent={
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={handleProceed} disabled={!selectedTable}>
                                <LinearGradient
                                    colors={['#F2CA85', '#F2CA85']} // Amarelo para Laranja (cores do botão PROSSEGUIR)
                                    style={styles.proceedButtonGradient}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                >
                                    <Text style={styles.proceedButtonText}>PROSSEGUIR</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <View style={styles.sacContainer}>
                                <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/J6j03k7Kyp/awoocev2_expires_30_days.png" }} style={styles.sacIcon} />
                                <Text style={styles.sacText}>SAC</Text>
                            </View>
                        </View>
                    }
                />
            </View>
 
            {/* Botão de Sair (mantido, mas pode ser integrado ao header se desejar) */}
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutText}>  </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
 
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#911F09", // Fundo vermelho escuro da imagem
    },
    // Estilos do header (placeholders, substitua pelo seu componente real)
    headerPlaceholder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#D9D9D9', // Cor do header na imagem
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerIcon: {
        padding: 5,
    },
    menuIcon: {
        width: 25,
        height: 25,
    },
    logo: {
        width: 120, // Ajuste conforme o logo
        height: 40, // Ajuste conforme o logo
    },
    headerRightIcons: {
        flexDirection: 'row',
    },
    cartIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    userIcon: {
        width: 25,
        height: 25,
    },
 
    container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 44,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 20,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4F5476', // Cor do título na imagem
        textAlign: 'center',
        marginBottom: 30,
    },
    floorGroup: {
        marginBottom: 20,
    },
    floorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4F5476', // Cor do título do andar na imagem
        marginBottom: 15,
    },
    tablesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Para distribuir 3 itens por linha
        rowGap: 10, // Espaçamento entre as linhas
        columnGap: 10, // Espaçamento entre as colunas
    },
    tableButton: {
    backgroundColor: '#C83B2E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 8,
    },
    tableButtonSelected: {
        borderColor: '#4F5476', // Borda para mesa selecionada
        borderWidth: 2,
    },
    tableButtonOccupied: {
        backgroundColor: '#8E8E8E', // Cinza para mesas ocupadas
        opacity: 0.7,
    },
   tableButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
        paddingBottom: 20, // Espaço para o botão de sair e SAC
    },
    proceedButtonGradient: {
        borderRadius: 30, // Borda arredondada do botão PROSSEGUIR
        paddingVertical: 15,
        paddingHorizontal: 60,
        marginBottom: 20,
    },
    proceedButtonText: {
        color: '#4F5476', // Cor do texto do botão PROSSEGUIR
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sacContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    sacIcon: { width: 18, height: 27, marginRight: 5 },
    sacText: { color: "#000000", fontSize: 12, fontWeight: "bold"
 
  },
    logoutButton: {
        position: 'absolute',
        top: 80, // Ajuste a posição para não colidir com o header
        right: 20,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        zIndex: 10,
    },
    logoutText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
 
export default ChooseTableScreen;