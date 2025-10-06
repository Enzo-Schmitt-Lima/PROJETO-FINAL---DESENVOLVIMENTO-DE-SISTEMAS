import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes'; // Ajuste o caminho se necessário
import api from '../../services/api'; // Ajuste o caminho se necessário
 
// Tipagem para os parâmetros recebidos da rota
type PaymentScreenRouteProp = RouteProp<StackParamsList, 'Payment'>;
 
const Pagamento: React.FC = () => {
    // --- Início da Lógica e Hooks ---
    const route = useRoute<PaymentScreenRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
   
    // Recebe os dados da tela anterior. Garanta que 'order' e 'total' sejam enviados.
    const { number, order, total } = route.params;
 
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
 
    const handlePayment = async () => {
        if (!paymentMethod) {
            Alert.alert('Atenção', 'Por favor, selecione uma forma de pagamento.');
            return;
        }
 
        try {
            // Chama a rota do backend para finalizar o pedido
            await api.put(`/order/payment/${order.id}`, {
                paymentMethod,
                total,
            });
 
            Alert.alert('Sucesso!', `O pedido da mesa ${number} foi pago.`);
           
            // Navega de volta para a tela inicial da pilha de navegação
            navigation.popToTop();
 
        } catch (err) {
            console.error('Erro ao processar pagamento:', err);
            Alert.alert('Erro', 'Não foi possível processar o pagamento. Tente novamente.');
        }
    };
    // --- Fim da Lógica ---
 
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.mainCard}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/J6j03k7Kyp/mt7iow6q_expires_30_days.png"}}
                            resizeMode={"stretch"}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                   
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{"Pagar com:"}</Text>
                        <Text style={styles.totalText}>Total: R$ {total.toFixed(2).replace('.', ',')}</Text>
                        <View style={styles.titleUnderline} />
                    </View>
                   
                    {/* Opções de Pagamento Interativas */}
                                    <View style={styles.optionsWrapper}>
                        <TouchableOpacity
                            style={styles.optionRowContainer}
                            onPress={() => setPaymentMethod('cartao')}
                        >
                            <View style={styles.radioButton}>
                                {paymentMethod === 'cartao' && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.optionText}>Cartão de crédito / débito (físico)</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                       
                        <TouchableOpacity
                            style={styles.optionRowContainer}
                            onPress={() => setPaymentMethod('pix')}
                        >
                            <View style={styles.radioButton}>
                                {paymentMethod === 'pix' && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.optionText}>PIX (digital)</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
 
                        <TouchableOpacity
                            style={styles.optionRowContainer}
                            onPress={() => setPaymentMethod('carteira')}
                        >
                            <View style={styles.radioButton}>
                                {paymentMethod === 'carteira' && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.optionText}>Carteira digital (digital)</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
 
                        <TouchableOpacity
                            style={styles.optionRowContainer}
                            onPress={() => setPaymentMethod('dinheiro')}
                        >
                            <View style={styles.radioButton}>
                                {paymentMethod === 'dinheiro' && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.optionText}>Dinheiro (físico)</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </View>
                   
                   <View style={styles.footerButtonsContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.backButtonText}>VOLTAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.finaliseButton, !paymentMethod && styles.disabledButton]}
                            onPress={handlePayment}
                            disabled={!paymentMethod}
                        >
                            <Text style={styles.finaliseButtonText}>FINALIZAR PAGAMENTO</Text>
                        </TouchableOpacity>
                    </View>
                   
                    <TouchableOpacity style={styles.sacContainer}>
                        <Image source={{ uri: "URL_ICONE_SAC_PRETO" }} style={styles.sacIcon} />
                        <Text style={styles.sacText}>SAC</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
 
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#911F09",
    },
    scrollView: {
        backgroundColor: "#911F09",
    },
    mainCard: {
        flex: 1,
        backgroundColor: "#D9D9D9",
        borderRadius: 30,
        paddingVertical: 27,
        paddingHorizontal: 18,
        margin: 10,
        marginTop: 55,
        marginBottom: 25,
    },
    backIcon: {
        width: 30,
        height: 30,
        marginBottom: 22,
        marginLeft: 4,
    },
    titleContainer: {
        marginBottom: 30,
        marginLeft: 19,
    },
    title: {
        color: "#4F5476",
        fontSize: 38,
        fontWeight: "bold",
    },
    totalText: {
        color: "#4F5476",
        fontSize: 20,
        fontWeight: '600',
        marginTop: 5,
    },
    titleUnderline: {
        position: "absolute",
        bottom: -3,
        left: 57,
        width: 80,
        height: 2,
        backgroundColor: "#4F5476",
        borderRadius: 10,
    },
    divider: {
        height: 1,
        backgroundColor: "#000000",
        marginVertical: 12,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    optionRowSelected: { // NOVO: Estilo para o item selecionado
        backgroundColor: 'rgba(79, 84, 118, 0.2)',
        borderColor: '#4F5476',
        borderWidth: 1.5,
    },
    optionIcon: {
        width: 30,
        height: 34,
        marginRight: 15,
    },
    optionText: {
        color: "#4F5476",
        fontSize: 20,
        fontWeight: "bold",
        flex: 1,
    },
    optionsWrapper: {
        marginBottom: 20,
    },
    optionRowContainer: {
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 12,
    },
     radioButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: '#B0B0B0', // Borda cinza
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    radioButtonSelected: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4A4A6A', // Preenchimento cinza escuro
    },
    footerButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
     backButton: {
        backgroundColor: '#C84C3F',
        paddingVertical: 15,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    finaliseButton: {
        backgroundColor: '#F0D17A',
        paddingVertical: 15,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2,
    },
    finaliseButtonText: {
        color: '#4A4A6A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#7171715f',
        elevation: 0,
        shadowOpacity: 0,
    },
     sacContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sacIcon: {
        width: 16,
        height: 16,
        marginRight: 5,
    },
    sacText: {
        color: '#4A4A6A',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
 
<<<<<<< HEAD
export default Pagamento
=======
export default Pagamento
 
>>>>>>> cf2546a33b8d9d9f5f277f092dcaf4d904d426c3
