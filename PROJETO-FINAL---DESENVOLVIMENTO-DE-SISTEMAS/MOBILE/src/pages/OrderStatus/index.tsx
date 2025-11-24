import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamsList as StackParamsList } from '../../routes/app.routes'; 
import api from '../../services/api';

interface ProductItem {
    product: { name: string; price: string };
    amount: number;
}

interface OrderData {
    id: string;
    items?: ProductItem[];
    table?: { number: number };
    status?: number;
    pagamento?: any;
    statusText?: string;
}

type OrderStatusRouteProp = RouteProp<StackParamsList, 'OrderStatus'>;

export default function OrderStatus() {
    const route = useRoute<OrderStatusRouteProp>();
    // Usamos 'any' no cast da navegação para simplificar, mas idealmente AppStackParamsList
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>(); 
    const { number, order, order_id } = route.params || {};

    const [orderData, setOrderData] = useState<OrderData | null>(order || null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const calculateTotal = (items: ProductItem[] | undefined) => {
        if (!items) return 0;
        return items.reduce((sum: number, it: ProductItem) => sum + it.amount * parseFloat(it.product.price), 0);
    };

    useEffect(() => {
        // [GUARD RAIL] Se a tela for carregada sem ID ou objeto do pedido, redireciona para o Dashboard.
        if (!order && !order_id) {
            console.warn('OrderStatus: Faltando dados do pedido. Redirecionando para Dashboard.');
            navigation.navigate('Dashboard');
            return;
        }

        async function loadOrderDetails() {
            // Se já temos o objeto completo 'order' e não há um 'order_id' para forçar a busca, paramos.
            if (orderData && !order_id) {
                setLoading(false);
                return;
            }

            // Se temos um order_id, buscamos os detalhes mais recentes na API.
            if (order_id) {
                try {
                    setLoading(true);
                    const resp = await api.get(`/order/detail?order_id=${order_id}`);
                    const fetchedOrder = (resp.data as any).order || resp.data;
                    setOrderData(fetchedOrder);
                } catch (err) {
                    // Se a busca falhar (pedido inválido/inexistente), voltamos para o Dashboard.
                    console.error('Erro ao buscar detalhes do pedido. Redirecionando para Dashboard.', err);
                    (navigation as any).navigate('Dashboard'); 
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        loadOrderDetails();
    }, [order_id, navigation, order, orderData]);

    const handleBackToProducts = () => {
        // CORREÇÃO DEFINITIVA: Usa 'reset' para limpar todo o histórico (incluindo o Dashboard) 
        // e define 'Products' como a única tela na pilha.
        navigation.reset({
            index: 0,
            routes: [{ name: 'Products' }],
        });
    };

    const handleOrderArrived = () => {
        if (!displayId) return;
        (navigation as any).navigate('Feedback', { order_id: displayId });
    };

    const refreshOrderStatus = async () => {
        if (!displayId) return;
        try {
            setRefreshing(true);
            const resp = await api.get(`/order/detail?order_id=${displayId}`);
            const updatedOrder = (resp.data as any).order || resp.data;
            setOrderData(updatedOrder);
        } catch (err) {
            console.error('Erro ao atualizar status do pedido:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const statusText = (s?: number) => {
        switch (s) {
            case 0:
            case 1:
                return 'Em preparo';
            case 2:
                return 'Pronto para Retirada/Entrega';
            case 3:
                return 'Finalizado';
            default:
                return 'Desconhecido';
        }
    };

    const currentOrder = orderData || (order as OrderData);

    const displayId = currentOrder?.id || order_id || null;
    const displayTable = currentOrder?.table?.number || number || '—';
    const displayTotal = calculateTotal(currentOrder?.items);
    const displayStatus = currentOrder?.status;
    const displayStatusText = currentOrder?.statusText || (displayStatus !== undefined ? statusText(displayStatus) : 'Desconhecido');
    const paymentMethod = currentOrder?.pagamento && currentOrder.pagamento.length > 0 ? (currentOrder.pagamento[0].statusText || currentOrder.pagamento[0].metodo) : null;

    return (
        <View style={styles.bgContainer}>
            <View style={styles.cardContainer}>
                {/* ACIONAMENTO CORRIGIDO: Agora usa a função reset para limpar o histórico */}
                <TouchableOpacity style={styles.backButton} onPress={handleBackToProducts}>
                    <Text style={{ color: '#911F09', fontWeight: '700' }}>← Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.refreshButton} onPress={refreshOrderStatus} disabled={refreshing || loading}>
                    {refreshing ? (
                        <ActivityIndicator size="small" color="#911F09" />
                    ) : (
                        <Ionicons name="refresh" size={24} color="#911F09" />
                    )}
                </TouchableOpacity>

                <Text style={styles.title}>Status do Pedido</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1A3A6B" />
                        <Text style={styles.subtitle}>Buscando detalhes do pedido...</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.subtitle}>Mesa {displayTable}</Text>
                        {displayId && <Text style={styles.info}>ID: {displayId}</Text>}
                        {paymentMethod && <Text style={styles.info}>Pagamento: {paymentMethod}</Text>}
                        <Text style={styles.info}>Total: R$ {displayTotal.toFixed(2)}</Text>
                        <Text style={styles.status}>{displayStatusText}</Text>

                        <TouchableOpacity 
                            style={[styles.button, displayStatus === 3 && styles.buttonDisabled]} 
                            onPress={handleOrderArrived}
                            disabled={displayStatus === 3}
                        >
                            <Text style={styles.buttonText}>
                                {displayStatus === 3 ? 'Pedido Finalizado' : 'O pedido chegou?'}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity onPress={() => console.log('SAC Pressed')}>
                    <Text style={styles.sacText}>
                        <Ionicons name="call-outline" size={14} color="#911F09" /> SAC
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bgContainer: {
        flex: 1,
        backgroundColor: '#911F09',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 30,
        padding: 28,
        width: '95%',
        height: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 8,
        position: 'relative',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1A3A6B',
        marginBottom: 18,
        marginTop: 60,
        textAlign: 'center',
        width: '100%',
    },
    subtitle: {
        fontSize: 22,
        color: '#101026',
        marginBottom: 22,
        fontWeight: '500',
    },
    info: {
        fontSize: 18,
        color: '#101026',
        marginBottom: 10,
        marginTop: 4,
        textAlign: 'center'
    },
    status: {
        fontSize: 24,
        color: '#911F09',
        fontWeight: 'bold',
        marginVertical: 40,
        textAlign: 'center',
        paddingHorizontal: 20
    },
    button: {
        backgroundColor: '#F2CA85',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    buttonText: {
        color: '#911F09',
        fontWeight: 'bold',
        fontSize: 20,
    },
    refreshButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    backButton: { position: 'absolute', top: 10, left: 12, padding: 8 },
    sacText: {
        color: '#911F09',
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 10,
        position: 'absolute',
        bottom: 30,
        right: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
});