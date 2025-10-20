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
    Platform,
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

    const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 24;

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

    // --- CATEGORY LOADER ---
    const loadCategories = useCallback(async () => {
        try {
            const response = await api.get("/category");
            const formatted = (response.data as any[]).map((cat: any) => ({
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
            Alert.alert('Erro', 'Não foi possível carregar as categorias.');
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

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
            const orderItems = (orderDetailResponse.data as any).items || [];
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { top: topOffset }] }>
                    <Ionicons name="arrow-back" size={24} color="#5D3A2F" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.viewLayout}>
                    <View style={styles.column2Layout}>
                        <View style={styles.boxLayout} /><View style={styles.boxLayout} /><View style={styles.box2Layout} />
                    </View>
                </TouchableOpacity>
                <Image source={logo} style={styles.logoImage} />
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => loadCategories()} style={[styles.refreshButton, { top: topOffset }]}>
                        <Ionicons name="refresh" size={22} color="#333" />
                    </TouchableOpacity>
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
    containerLayout: { flex: 1, backgroundColor: "#911F09", },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#D9D9D9', paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', shadowColor: "rgba(0,0,0,0.25)", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 4, elevation: 4, marginBottom: 1, marginTop: 55, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginHorizontal: 10, },
    scrollView: { flex: 1, backgroundColor: "#911F09", },
    boxLayout: { width: 35, height: 5, backgroundColor: "#5D3A2F", borderRadius: 10, marginBottom: 6, },
    box2Layout: { width: 35, height: 5, backgroundColor: "#5D3A2F", borderRadius: 10, },
    columnLayout: { backgroundColor: "#D9D9D9", borderRadius: 1, paddingBottom: 140, marginTop: -10, marginBottom: 69, marginHorizontal: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, },
    column2Layout: { alignItems: "center", },
    inputLayout: { color: "#FFFFFF", fontSize: 20, flex: 1, textAlignVertical: 'center', fontWeight: 'bold' },
    row2Layout: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#911F09", borderRadius: 20, paddingVertical: 12, paddingHorizontal: 32, marginVertical: 6, marginHorizontal: 29, shadowColor: "#5D3A2FB8", shadowOpacity: 0.7, shadowOffset: { width: 7, height: 5 }, shadowRadius: 4, elevation: 4, },
    viewLayout: { alignItems: "center", paddingTop: 0, paddingBottom: 0, marginRight: 10, },
    logoImage: { width: 120, height: 40, resizeMode: 'contain', },
    headerRight: { flexDirection: "row", alignItems: "center", },
    searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 50, paddingHorizontal: 15, paddingVertical: 10, marginHorizontal: 29, marginBottom: 20, marginTop: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3.84, elevation: 5, },
    searchBarInput: { flex: 1, marginLeft: 10, fontSize: 18, color: '#101026', paddingVertical: 0, height: 30, },
    noResultsText: { textAlign: 'center', marginTop: 20, fontSize: 18, color: '#911F09', fontWeight: 'bold', marginHorizontal: 30, },
    productsListView: { marginHorizontal: 29, marginBottom: 20, },
    categoryWrapper: { marginBottom: 12, },
    productContainer: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFFFFF", marginVertical: 4, padding: 10, borderRadius: 6, alignItems: "center", borderWidth: 1, borderColor: '#B72F14', elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, },
    productImage: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
    productInfo: { flex: 1, justifyContent: "center" },
    productName: { color: "#101026", fontWeight: "bold", fontSize: 16 },
    productDesc: { color: "#555", fontSize: 12 },
    productPrice: { color: "#101026", fontWeight: "bold", marginTop: 4 },
    counter: { flexDirection: "row", alignItems: "center" },
    counterButton: { width: 35, height: 35, backgroundColor: "#F2CA85", justifyContent: "center", alignItems: "center", borderRadius: 6, },
    counterText: { fontWeight: "bold", color: "#101026", fontSize: 18 },
    amount: { color: "#101026", marginHorizontal: 12, fontSize: 16, fontWeight: 'bold', },
    summaryContainer: { backgroundColor: "#5D3A2F", paddingVertical: 8, paddingHorizontal: 4, },
    summaryItem: { backgroundColor: "#D9D9D9", padding: 6, marginHorizontal: 4, borderRadius: 6, },
    summaryText: { color: "#101026", fontWeight: "bold" },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", padding: 12, backgroundColor: "#911F09", },
    footerButton: { flex: 1, marginHorizontal: 4, paddingVertical: 12, borderRadius: 6, alignItems: "center", },
    footerText: { fontWeight: "bold", color: "#FFF", fontSize: 16 },
    orderSummary: { backgroundColor: "#5D3A2F", padding: 10, alignItems: "center", },
    totalText: { color: "#101026", fontSize: 16, fontWeight: "bold", textAlign: 'center', marginBottom: 10 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    cartContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, width: '80%', maxHeight: '60%' },
    cartTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    cartItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    cartText: { fontSize: 16 },
    closeButton: { backgroundColor: '#B72F14', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
    closeText: { color: '#FFF', fontWeight: 'bold' },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    backButton: { position: 'absolute', top: 12, left: 12, padding: 8, zIndex: 20 },
    refreshButton: { position: 'absolute', top: 12, right: 60, padding: 8, zIndex: 20 },
});
// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   Alert,
//   Image,
// } from "react-native";
// import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { StackParamsList } from "../../routes/app.routes";
// import api from "../../services/api";

// // A correção foi feita aqui. Adicionando o 'order' ao tipo de parâmetro.
// type OrderRouteProp = RouteProp<StackParamsList, "Order">;

// export default function Order() {
//   const route = useRoute<OrderRouteProp>();
//   const navigation =
//     useNavigation<NativeStackNavigationProp<StackParamsList>>();

//   const [categories, setCategories] = useState<any[]>([]);
//   const [showProducts, setShowProducts] = useState<string | null>(null);
//   const [total, setTotal] = useState(0);
//   const [hasOrderItems, setHasOrderItems] = useState(false);
//   const [orderSummary, setOrderSummary] = useState<any[]>([]);
//   const [imageError, setImageError] = useState<string | null>(null);

//   const scrollRef = useRef<ScrollView>(null);
//   const categoryRefs = useRef<{ [key: string]: number }>({});

//   useEffect(() => {
//     async function loadCategories() {
//       try {
//         const response = await api.get("/category");
  
//         const formatted = response.data.map((cat: any) => ({
//           ...cat,
//           products: cat.products.map((p: any) => ({
//             ...p,
//             amount: 0,
//           })),
//         }));

//         setCategories(formatted);
//       } catch (err) {
//         console.log("Erro ao buscar categorias:", err);
//       }
//     }

//     loadCategories();
//   }, []);

//   useEffect(() => {
//     async function checkImageURLs() {
//       if (categories.length > 0) {
//         for (const category of categories) {
//           for (const product of category.products) {
//             console.log('Verificando URL da imagem:', product.bannerUri);
//             console.log('ID do produto:', product.id);
//           }
//         }
//       }
//     }
//     checkImageURLs();
//   }, [categories]);

//   const handleCategoryPress = (id: string) => {
//     setShowProducts(showProducts === id ? null : id);
//     const y = categoryRefs.current[id];
//     if (y !== undefined) {
//       scrollRef.current?.scrollTo({ y, animated: true });
//     }
//   };

//   const updateOrderSummary = (updatedCategories: any[]) => {
//     const summary: any[] = [];
//     updatedCategories.forEach((cat) =>
//       cat.products.forEach((p: any) => {
//         if (p.amount > 0)
//           summary.push({ ...p, category: cat.title || cat.name });
//       })
//     );
//     setOrderSummary(summary);
//   };

//   const increment = async (catId: string, prodId: string, price: string) => {
//     try {
//       // Chama a API para adicionar o item
//       await api.post('/order/add', {
//         order_id: route.params.order_id,
//         product_id: prodId,
//         amount: 1,
//       });

//       // Atualiza o estado local
//       const updated = categories.map((cat) => {
//         if (cat.id === catId) {
//           return {
//             ...cat,
//             products: cat.products.map((p: any) =>
//               p.id === prodId ? { ...p, amount: p.amount + 1 } : p
//             ),
//           };
//         }
//         return cat;
//       });
//       setCategories(updated);
//       setTotal((prev) => prev + parseFloat(price));
//       setHasOrderItems(true);
//       updateOrderSummary(updated);
//     } catch (err) {
//       console.log('Erro ao adicionar item:', err);
//       Alert.alert('Erro', 'Não foi possível adicionar o item ao pedido.');
//     }
//   };

//   const decrement = async (catId: string, prodId: string, price: string) => {
//     try {
//       // Primeiro, buscar os itens do pedido para encontrar o item_id
//       const orderDetailResponse = await api.get(`/order/detail?order_id=${route.params.order_id}`);
//       const orderItems = orderDetailResponse.data.items || [];

//       // Encontrar um item que corresponda ao produto
//       const itemToRemove = orderItems.find((item: any) => item.product_id === prodId);

//       if (itemToRemove) {
//         // Chama a API para remover o item
//         await api.delete('/order/remove', {
//           params: { item_id: itemToRemove.id }
//         });
//       }

//       // Atualiza o estado local
//       const updated = categories.map((cat) => {
//         if (cat.id === catId) {
//           return {
//             ...cat,
//             products: cat.products.map((p: any) =>
//               p.id === prodId ? { ...p, amount: Math.max(0, p.amount - 1) } : p
//             ),
//           };
//         }
//         return cat;
//       });
//       setCategories(updated);

//       setTotal((prev) => Math.max(0, prev - parseFloat(price)));

//       const anyItem = updated.some((c) =>
//         c.products.some((p: any) => p.amount > 0)
//       );
//       setHasOrderItems(anyItem);
//       updateOrderSummary(updated);
//     } catch (err) {
//       console.log('Erro ao remover item:', err);
//       Alert.alert('Erro', 'Não foi possível remover o item do pedido.');
//     }
//   };

//   const handleCancelOrder = () => {
//     navigation.goBack();
//   };

//   // Funcao para navegar para a tela de pagamento
//   const handleNavigateToPayment = () => {
//     // Verifica se há itens no pedido
//     if (total === 0) {
//       Alert.alert('Pedido Vazio', 'Não é possível finalizar um pedido sem itens.');
//       return;
//     }

//     // Navega para a tela de pagamento, passando os dados necessários
//     navigation.navigate('Payment', {
//       number: route.params.number,
//       order: route.params.order,
//       total: total,
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mesa {route.params.number}</Text>
//       {imageError && (
//         <Text style={styles.errorText}>
//           Erro ao carregar imagem: {imageError}
//         </Text>
//       )}

//       <ScrollView ref={scrollRef} style={{ flex: 1 }}>
//         {categories.map((cat) => (
//           <View
//             key={cat.id}
//             onLayout={(event) => {
//               const layout = event.nativeEvent.layout;
//               categoryRefs.current[cat.id] = layout.y;
//             }}
//             style={styles.categoryContainer}
//           >
//             <TouchableOpacity
//               onPress={() => handleCategoryPress(cat.id)}
//               style={styles.categoryButton}
//             >
//               <Text style={styles.categoryTitle}>{cat.title || cat.name}</Text>
//             </TouchableOpacity>

//             {showProducts === cat.id &&
//               cat.products.map((prod: any) => (
//                 <View key={prod.id} style={styles.productContainer}>
//                   {prod.bannerUri ? (
//                     <Image
//                       source={{ uri: prod.bannerUri }}
//                       style={styles.productImage}
//                       resizeMode="cover"
//                     />
//                   ) : (
//                     <View
//                       style={[styles.productImage, { backgroundColor: "#555" }]}
//                     />
//                   )}

//                   <View style={styles.productInfo}>
//                     <Text style={styles.productName}>{prod.name}</Text>
//                     <Text style={styles.productDesc}>{prod.description}</Text>
//                     <Text style={styles.productPrice}>R$ {prod.price}</Text>
//                   </View>

//                   <View style={styles.counter}>
//                     <TouchableOpacity
//                       style={styles.counterButton}
//                       onPress={() => decrement(cat.id, prod.id, prod.price)}
//                     >
//                       <Text style={styles.counterText}>-</Text>
//                     </TouchableOpacity>
//                     <Text style={styles.amount}>{prod.amount}</Text>
//                     <TouchableOpacity
//                       style={styles.counterButton}
//                       onPress={() => increment(cat.id, prod.id, prod.price)}
//                     >
//                       <Text style={styles.counterText}>+</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               ))}
//           </View>
//         ))}
//       </ScrollView>

//       {hasOrderItems && (
//         <View style={styles.summaryContainer}>
//           <FlatList
//             data={orderSummary}
//             keyExtractor={(item) => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             renderItem={({ item }) => (
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryText}>
//                   {item.name} x {item.amount} - R${" "}
//                   {(item.amount * parseFloat(item.price)).toFixed(2)}
//                 </Text>
//               </View>
//             )}
//           />
//         </View>
//       )}

//       {hasOrderItems && (
//         <View style={styles.orderSummary}>
//           <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
//         </View>
//       )}

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.footerButton, { backgroundColor: "#FF3F4B" }]}
//           onPress={handleCancelOrder}
//         >
//           <Text style={styles.footerText}>Cancelar Pedido</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.footerButton, { backgroundColor: "#3FFFA3" }]}
//           onPress={handleNavigateToPayment} // Chamando a nova função de navegação
//         >
//           <Text style={styles.footerText}>Finalizar Pagamento</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#1d1d2e", paddingTop: 16 },
//   title: { fontSize: 24, fontWeight: "bold", color: "#FFF", textAlign: "center" },
//   categoryContainer: { marginBottom: 12 },
//   categoryButton: {
//     backgroundColor: "#29295c",
//     padding: 12,
//     borderRadius: 8,
//   },
//   categoryTitle: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
//   productContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#3b3b6b",
//     marginVertical: 4,
//     padding: 10,
//     borderRadius: 6,
//     alignItems: "center",
//   },
//   productImage: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
//   productInfo: { flex: 1, justifyContent: "center" },
//   productName: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
//   productDesc: { color: "#DDD", fontSize: 12 },
//   productPrice: { color: "#FFF", fontWeight: "bold", marginTop: 4 },
//   counter: { flexDirection: "row", alignItems: "center" },
//   counterButton: {
//     width: 30,
//     height: 30,
//     backgroundColor: "#3FFFA3",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 6,
//   },
//   counterText: { fontWeight: "bold", color: "#101026", fontSize: 18 },
//   amount: { color: "#FFF", marginHorizontal: 8, fontSize: 16 },
//   summaryContainer: {
//     backgroundColor: "#29295c",
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//   },
//   summaryItem: {
//     backgroundColor: "#3FFFA3",
//     padding: 6,
//     marginHorizontal: 4,
//     borderRadius: 6,
//   },
//   summaryText: { color: "#101026", fontWeight: "bold" },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 12,
//     backgroundColor: "#101026",
//   },
//   footerButton: {
//     flex: 1,
//     marginHorizontal: 4,
//     paddingVertical: 12,
//     borderRadius: 6,
//     alignItems: "center",
//   },
//   footerText: { fontWeight: "bold", color: "#FFF", fontSize: 16 },
//   orderSummary: {
//     backgroundColor: "#29295c",
//     padding: 10,
//     alignItems: "center",
//   },
//   totalText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
//   errorText: { color: "red", textAlign: "center", marginVertical: 10 },
// });
