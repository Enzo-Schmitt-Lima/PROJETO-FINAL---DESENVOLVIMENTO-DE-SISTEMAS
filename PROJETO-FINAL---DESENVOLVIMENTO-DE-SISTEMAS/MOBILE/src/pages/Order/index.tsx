import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Alert,
    Image,
    SafeAreaView,
    ViewStyle,
    TextStyle,
    ImageStyle,
    TextInput,
    StatusBar,
    Modal,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";
import HamburgerMenu from "../../components/HamburgerMenu";


// --- TIPAGENS ---
type OrderRouteProp = RouteProp<StackParamsList, "Order">;

interface Product {
    id: string;
    name: string;
    price: string;
    description: string;
    banner: string | null;
    amount: number;
    bannerUri: string | null;
}

interface Category {
    id: string;
    name: string;
    products: Product[];
}

// Garanta que o caminho para sua logo esteja correto
const logo = require("../../../assets/logo.png");

// --- COMPONENTE FINAL MESCLADO ---
export default function Order() {
    const route = useRoute<OrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    // --- SUA LÓGICA ORIGINAL (STATES) ---
    const [categories, setCategories] = useState<Category[]>([]);
    const [openCategory, setOpenCategory] = useState<string | null>(null); // Renomeado de 'showProducts' para compatibilidade
    const [total, setTotal] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [hasOrderItems, setHasOrderItems] = useState(false);
    const [orderSummary, setOrderSummary] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [cartVisible, setCartVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const scrollRef = useRef<ScrollView>(null);
    const categoryRefs = useRef<{ [key: string]: number }>({});

    // --- SUA LÓGICA ORIGINAL (FUNÇÕES) ---
    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await api.get("/category");
                const formatted = response.data.map((cat: any) => ({
                    ...cat,
                    name: cat.name || cat.title, // Garante compatibilidade
                    products: cat.products.map((p: any) => ({
                        ...p,
                        amount: 0,
                    })),
                }));
                setCategories(formatted);
                // Define a primeira categoria como aberta por padrão
                if (formatted.length > 0) {
                    setOpenCategory(formatted[0].id);
                }
            } catch (err) {
                console.log("Erro ao buscar categorias:", err);
            }
        }
        loadCategories();
    }, []);

    const updateOrderSummaryAndTotal = (updatedCategories: Category[]) => {
        const summary: any[] = [];
        let newTotal = 0;
        let totalItems = 0;
        let itemExists = false;
        updatedCategories.forEach((cat) =>
            cat.products.forEach((p: any) => {
                if (p.amount > 0) {
                    itemExists = true;
                    summary.push({ ...p, category: cat.name });
                    newTotal += p.amount * parseFloat(p.price);
                    totalItems += p.amount;
                }
            })
        );
        setOrderSummary(summary);
        setTotal(newTotal);
        setTotalItems(totalItems);
        setHasOrderItems(itemExists);
    };

    const increment = async (catId: string, prodId: string) => {
        try {
            await api.post('/order/add', {
                order_id: route.params.order_id,
                product_id: prodId,
                amount: 1,
            });

            const updated = categories.map((cat) => {
                if (cat.id === catId) {
                    return { ...cat, products: cat.products.map((p: any) => p.id === prodId ? { ...p, amount: p.amount + 1 } : p) };
                }
                return cat;
            });
            setCategories(updated);
            updateOrderSummaryAndTotal(updated);
        } catch (err) {
            console.log('Erro ao adicionar item:', err);
            Alert.alert('Erro', 'Não foi possível adicionar o item ao pedido.');
        }
    };

    const decrement = async (catId: string, prodId: string) => {
        try {
            const orderDetailResponse = await api.get(`/order/detail?order_id=${route.params.order_id}`);
            const orderItems = orderDetailResponse.data.items || [];
            const itemToRemove = orderItems.find((item: any) => item.product_id === prodId);

            if (itemToRemove) {
                await api.delete('/order/remove', { params: { item_id: itemToRemove.id } });
            }

            const updated = categories.map((cat) => {
                if (cat.id === catId) {
                    return { ...cat, products: cat.products.map((p: any) => p.id === prodId ? { ...p, amount: Math.max(0, p.amount - 1) } : p) };
                }
                return cat;
            });
            setCategories(updated);
            updateOrderSummaryAndTotal(updated);
        } catch (err) {
            console.log('Erro ao remover item:', err);
            Alert.alert('Erro', 'Não foi possível remover o item do pedido.');
        }
    };

    const handleCancelOrder = () => { navigation.goBack(); };
   const handleNavigateToPayment = () => {
    if (total === 0) {
        Alert.alert('Pedido Vazio', 'Não é possível finalizar um pedido sem itens.');
        return;
    }
    // Navega para a tela de pagamento com os parâmetros corretos
    console.log('[Order] Navegando para Payment:', {
        number: route.params.number,
        order: { id: route.params.order_id },
        total: total,
    });
    navigation.navigate('Payment', {
        number: route.params.number,
        order: { id: route.params.order_id },
        total: total,
    });
};
    // --- LÓGICA DO DESIGN (DA SUA AMIGA) ---
    const handleCategoryPress = (id: string) => {
        if (searchText) return;
        setOpenCategory(openCategory === id ? null : id);
    };

    const filteredCategories = useMemo(() => {
        if (!searchText) return categories;
        const lowerCaseSearch = searchText.toLowerCase();
        return categories
            .map(category => {
                const filteredProducts = category.products.filter(product =>
                    product.name.toLowerCase().includes(lowerCaseSearch) ||
                    product.description.toLowerCase().includes(lowerCaseSearch)
                );
                if (filteredProducts.length > 0 || category.name.toLowerCase().includes(lowerCaseSearch)) {
                    return { ...category, products: filteredProducts };
                }
                return null;
            })
            .filter((cat): cat is Category => cat !== null);
    }, [categories, searchText]);


    // --- RENDERIZAÇÃO (VISUAL DA SUA AMIGA) ---
    return (
        <SafeAreaView style={styles.containerLayout}>
            <StatusBar backgroundColor="#911F09" barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.viewLayout}>
                    <View style={styles.column2Layout}>
                        <View style={styles.boxLayout} /><View style={styles.boxLayout} /><View style={styles.box2Layout} />
                    </View>
                </TouchableOpacity>
                <Image source={logo} style={styles.logoImage} />
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setCartVisible(true)} style={{ marginRight: 15 }}>
                        <Ionicons name="cart-outline" size={24} color="#333" />
                        {totalItems > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{totalItems}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                        <Ionicons name="person-circle-outline" size={28} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} ref={scrollRef}>
                <View style={styles.columnLayout}>
                    <View style={styles.searchBarContainer}>
                        <Ionicons name="search-outline" size={24} color="#5D3A2F" />
                        <TextInput style={styles.searchBarInput} placeholder="Pesquisar produtos" placeholderTextColor="#888" value={searchText} onChangeText={setSearchText} />
                    </View>

                    {filteredCategories.map((cat: Category) => (
                        <View key={cat.id} style={styles.categoryWrapper}>
                            <TouchableOpacity onPress={() => handleCategoryPress(cat.id)} style={styles.row2Layout} disabled={!!searchText}>
                                <Text style={styles.inputLayout}>{cat.name}</Text>
                                <Ionicons name={(openCategory === cat.id && !searchText) ? "chevron-up-outline" : "chevron-down-outline"} size={36} color="#FFF" />
                            </TouchableOpacity>

                            {(openCategory === cat.id || !!searchText) && (
                                <View style={styles.productsListView}>
                                    {cat.products.map((prod: Product) => (
                                        <View key={prod.id} style={styles.productContainer}>
                                            {(prod.bannerUri || prod.banner) ? (
                                                <Image source={{ uri: prod.bannerUri ?? prod.banner ?? '' }} style={styles.productImage} resizeMode="cover" />
                                            ) : (
                                                <View style={[styles.productImage, { backgroundColor: "#B72F14" }]} />
                                            )}
                                            <View style={styles.productInfo}>
                                                <Text style={styles.productName}>{prod.name}</Text>
                                                <Text style={styles.productDesc}>{prod.description}</Text>
                                                <Text style={styles.productPrice}>R$ {parseFloat(prod.price).toFixed(2)}</Text>
                                            </View>
                                            <View style={styles.counter}>
                                                <TouchableOpacity style={[styles.counterButton, { backgroundColor: '#FF3F4B' }]} onPress={() => decrement(cat.id, prod.id)} disabled={prod.amount === 0}>
                                                    <Text style={styles.counterText}>-</Text>
                                                </TouchableOpacity>
                                                <Text style={styles.amount}>{prod.amount}</Text>
                                                <TouchableOpacity style={styles.counterButton} onPress={() => increment(cat.id, prod.id)}>
                                                    <Text style={styles.counterText}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                    {searchText && filteredCategories.length === 0 && (
                        <Text style={styles.noResultsText}>Nenhum produto encontrado...</Text>
                    )}
                </View>
            </ScrollView>



            <View style={styles.footer}>
                <TouchableOpacity style={[styles.footerButton, { backgroundColor: "#B72F14" }]} onPress={handleCancelOrder}>
                    <Text style={styles.footerText}>Cancelar Pedido</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerButton, { backgroundColor: "#F2CA85", opacity: hasOrderItems ? 1 : 0.5 }]} onPress={handleNavigateToPayment} disabled={!hasOrderItems}>
                    <Text style={styles.footerText}>Finalizar Pagamento</Text>
                </TouchableOpacity>
            </View>



            <Modal visible={cartVisible} transparent animationType="slide">
                <TouchableOpacity style={styles.overlay} onPress={() => setCartVisible(false)} activeOpacity={1}>
                    <View style={styles.cartContainer}>
                        <Text style={styles.cartTitle}>Carrinho Atual</Text>
                        {orderSummary.length > 0 ? (
                            <FlatList
                                data={orderSummary}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.cartItem}>
                                        <Text style={styles.cartText}>{item.name} x {item.amount} - R$ {(item.amount * parseFloat(item.price)).toFixed(2)}</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text style={styles.cartText}>Carrinho vazio</Text>
                        )}
                        <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setCartVisible(false)}>
                            <Text style={styles.closeText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <HamburgerMenu
                onNavigate={(route: string) => navigation.navigate(route as any)}
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
            />
        </SafeAreaView>
    );
}

// --- STYLESHEET (DA SUA AMIGA) ---
const styles = StyleSheet.create({
    containerLayout: { 
        flex: 1, 
        backgroundColor: "#911F09", 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: '#D9D9D9', 
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc', 
        shadowColor: "rgba(0,0,0,0.25)", 
        shadowOpacity: 0.3, 
        shadowOffset: { 
            width: 0, 
            height: 4 
        }, 
        shadowRadius: 4, 
        elevation: 4, 
        marginBottom: 1, 
        marginTop: 55, 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        marginHorizontal: 10, 
    },
    scrollView: { 
        flex: 1, 
        backgroundColor: "#911F09", 
    },
    boxLayout: { 
        width: 35, 
        height: 5, 
        backgroundColor: "#5D3A2F", 
        borderRadius: 10, 
        marginBottom: 6, 
    },
    box2Layout: { 
        width: 35, 
        height: 5, 
        backgroundColor: "#5D3A2F", 
        borderRadius: 10, 
    },
    columnLayout: { 
        backgroundColor: "#D9D9D9", 
        borderRadius: 1, 
        paddingBottom: 140, 
        marginTop: -10, 
        marginBottom: 69, 
        marginHorizontal: 10, 
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30, 
    },
    column2Layout: { 
        alignItems: "center", 
    },
    inputLayout: {
        color: "#FFFFFF", 
        fontSize: 20, 
        flex: 1, 
        textAlignVertical: 'center', 
        fontWeight: 'bold' 
    },
    row2Layout: {
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center", 
        backgroundColor: "#B72F14", 
        borderRadius: 20, 
        paddingVertical: 12, 
        paddingHorizontal: 32, 
        marginVertical: 6, 
        marginHorizontal: 29, 
        shadowColor: "#5D3A2FB8", 
        shadowOpacity: 0.7, 
        shadowOffset: {
            width: 7, 
            height: 5 
        }, 
        shadowRadius: 4, 
        elevation: 4, 
    },
    viewLayout: { 
        alignItems: "center", 
        paddingTop: 0, 
        paddingBottom: 0, 
        marginRight: 10, 
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
    searchBarContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 50, 
        paddingHorizontal: 15, 
        paddingVertical: 10, 
        marginHorizontal: 29, 
        marginBottom: 20, 
        marginTop: 30, 
        shadowColor: "#000", 
        shadowOffset: { 
            width: 0, 
            height: 2 
        }, 
        shadowOpacity: 0.15, 
        shadowRadius: 3.84, 
        elevation: 5, 
    },
    searchBarInput: { 
        flex: 1, 
        marginLeft: 10, 
        fontSize: 18, 
        color: '#101026', 
        paddingVertical: 0, 
        height: 30, 
    },
    noResultsText: { 
        textAlign: 'center', 
        marginTop: 20, 
        fontSize: 18, 
        color: '#911F09', 
        fontWeight: 'bold', 
        marginHorizontal: 30, 
    },
    productsListView: { 
        marginHorizontal: 29, 
        marginBottom: 20, 
    },
    categoryWrapper: { 
        marginBottom: 12, 
    },
    productContainer: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        backgroundColor: "#FFFFFF", 
        marginVertical: 4, 
        padding: 10, 
        borderRadius: 6, 
        alignItems: "center", 
        borderWidth: 1, 
        borderColor: '#B72F14', 
        elevation: 2, 
        shadowColor: "#000", 
        shadowOffset: { 
            width: 0, 
            height: 2 
        }, 
        shadowOpacity: 0.1, 
        shadowRadius: 2, 
    },
    productImage: { 
        width: 60, 
        height: 60, 
        borderRadius: 6, 
        marginRight: 10 
    },
    productInfo: { 
        flex: 1, 
        justifyContent: "center" 
    },
    productName: { 
        color: "#101026", 
        fontWeight: "bold", 
        fontSize: 16 
    },
    productDesc: { 
        color: "#555", 
        fontSize: 12 
    },
    productPrice: { 
        color: "#101026", 
        fontWeight: "bold", 
        marginTop: 4 
    },
    counter: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
    counterButton: { 
        width: 35, 
        height: 35, 
        backgroundColor: "#F2CA85", 
        justifyContent: "center", 
        alignItems: "center", 
        borderRadius: 6, 
    },
    counterText: { 
        fontWeight: "bold", 
        color: "#101026", 
        fontSize: 18 
    },
    amount: { 
        color: "#101026", 
        marginHorizontal: 12, 
        fontSize: 16, 
        fontWeight: 'bold', 
    },
    summaryContainer: { 
        backgroundColor: "#5D3A2F", 
        paddingVertical: 8, 
        paddingHorizontal: 4, 
    },
    summaryItem: { 
        backgroundColor: "#D9D9D9", 
        padding: 6, 
        marginHorizontal: 4, 
        borderRadius: 6, 
    },
    summaryText: { 
        color: "#101026", 
        fontWeight: "bold" 
    },
    footer: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        padding: 12, 
        backgroundColor: "#911F09", 
    },
    footerButton: { 
        flex: 1, 
        marginHorizontal: 4, 
        paddingVertical: 12, 
        borderRadius: 6, 
        alignItems: "center", 
    },
    footerText: { 
        fontWeight: "bold", 
        color: "#FFF", 
        fontSize: 16 
    },
    orderSummary: { 
        backgroundColor: "#5D3A2F", 
        padding: 10, 
        alignItems: "center", 
    },
    totalText: { 
        color: "#101026", 
        fontSize: 16, 
        fontWeight: "bold", 
        textAlign: 'center', 
        marginBottom: 10 
    },
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    cartContainer: { 
        backgroundColor: '#FFF', 
        padding: 20, 
        borderRadius: 10,
        width: '80%', 
        maxHeight: '60%' 
    },
    cartTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        textAlign: 'center' 
    },
    cartItem: { 
        padding: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc' 
    },
    cartText: { 
        fontSize: 16 
    },
    closeButton: { 
        backgroundColor: '#B72F14', 
        padding: 10, 
        borderRadius: 5, 
        marginTop: 10, 
        alignItems: 'center' 
    },
    closeText: { 
        color: '#FFF', 
        fontWeight: 'bold' 
    },
    badge: { 
        position: 'absolute', 
        top: -5, 
        right: -5, 
        backgroundColor: 'red', 
        borderRadius: 10, 
        minWidth: 20, 
        height: 20, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    badgeText: { 
        color: 'white', 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
});
