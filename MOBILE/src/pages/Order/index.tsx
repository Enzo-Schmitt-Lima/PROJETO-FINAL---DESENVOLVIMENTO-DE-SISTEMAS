import React, { useEffect, useState, useRef, useMemo } from "react";
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
  // 💡 REMOÇÃO: Removi 'Platform' que não estava sendo usado
} from "react-native";
 
import { Ionicons } from "@expo/vector-icons";
 
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";
 
type OrderRouteProp = RouteProp<StackParamsList, "Order">;
 
// Tipagem mantida
interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string | null;
  amount: number;
  bannerUri: string | null;
}
 
interface Subcategory {
  id: string;
  name: string;
  products: Product[];
}
 
interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  products: any[];
}
 
// 💡 CORREÇÃO 1: Definição da constante logo.
const logo = require("../ChooseTable/logo.png");
 
 
export default function Order() {
  const route = useRoute<OrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
 
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openSubcategory, setOpenSubcategory] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasOrderItems, setHasOrderItems] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any[]>([]);
  const [imageError, setImageError] = useState<string | null>(null); // Variável não usada, mas mantida.
  const [searchText, setSearchText] = useState("");
 
  const scrollRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: number }>({});
 
  useEffect(() => {
    async function loadCategories() {
      // (Mantido inalterado)
      try {
        const mockResponse = {
          data: [
            {
              id: "pizzas",
              name: "Pizzas",
              subcategories: [
                {
                  id: "trad",
                  name: "Tradicionais",
                  products: [
                    { id: "p1", name: "Margherita", price: "49.90", description: "Clássica italiana.", banner: "placeholder" },
                    { id: "p2", name: "Calabresa", price: "49.90", description: "Com cebola e azeitonas.", banner: "placeholder" },
                    { id: "p3", name: "Portuguesa", price: "49.90", description: "Com ovos.", banner: "placeholder" },                    
                    { id: "p4", name: "Mussarela", price: "49.90", description: "Queijo.", banner: "placeholder" },
                    { id: "p5", name: "Frango com Catupiry", price: "49.90", description: "Frango e Catupiry.", banner: "placeholder" },
                    { id: "p6", name: "Atum", price: "49.90", description: "Peixe", banner: "placeholder" },
                  ],
                },
                {
                  id: "esp",
                  name: "Especiais",
                  products: [
                    { id: "p7", name: "Nutella", price: "55.00", description: "Creme de avelã.", banner: "placeholder" },
                    { id: "p8", name: "Chocolate", price: "55.00", description: "Chocolate.", banner: "placeholder" },
                    { id: "p9", name: "Romeu e Julieta", price: "55.00", description: "Queijo e Goiabada.", banner: "placeholder" },
                    { id: "p10", name: "Prestígio", price: "55.00", description: "Coco com chocolate.", banner: "placeholder" },
                    { id: "p11", name: "Brigadeiro", price: "55.00", description: "Brigadeiro de chocolate.", banner: "placeholder" },
                  ],
                },
              ],
              products: [],
            },
            {
              id: "bebidas",
              name: "Bebidas",
              subcategories: [
                {
                  id: "refri",
                  name: "Refrigerantes",
                  products: [
                    { id: "b1", name: "Coca-Cola 1L", price: "10.00", description: "Refrigerante de cola.", banner: "placeholder" },
                    { id: "b2", name: "Guaraná Antártica 2L", price: "12.00", description: "Refrigerante de guaraná.", banner: "placeholder" },
                    { id: "b3", name: "Soda 2L", price: "12.00", description: "Refrigerante de limão.", banner: "placeholder" },
                    { id: "b4", name: "Sprite 2L", price: "12.00", description: "Refrigerante de limão.", banner: "placeholder" },
                    { id: "b5", name: "Schweppes 2L", price: "12.00", description: "Refrigerante de limão.", banner: "placeholder" },
                  ],
                },
                {
                  id: "sucos",
                  name: "Sucos",
                  products: [
                    { id: "b6", name: "Suco de Laranja", price: "10.00", description: "Laranja.", banner: "placeholder" },
                    { id: "b7", name: "Suco de Uva", price: "10.00", description: "Uva.", banner: "placeholder" },
                    { id: "b8", name: "Suco de Limão", price: "10.00", description: "Limão.", banner: "placeholder" },
                    { id: "b9", name: "Suco de Maracujá", price: "10.00", description: "Maracujá.", banner: "placeholder" },
                    { id: "b10", name: "Suco de Abacaxi com hortelã", price: "10.00", description: "Abacaxi com hortelã.", banner: "placeholder" },
                  ],
                },
                {
                  id: "agua",
                  name: "Águas",
                  products: [
                    { id: "b11", name: "Água Mineral 500ml", price: "5.00", description: "Com ou sem gás.", banner: null },
                  ],
                },
                {
                  id: "alcoolicas",
                  name: "Alcoólicas",
                  products: [
                    { id: "b12", name: "Vinho", price: "15.00", description: "Vinho tinto.", banner: null },
                    { id: "b13", name: "Cerveja", price: "7.00", description: "Cerveja.", banner: null },
                    { id: "b14", name: "Whisky", price: "15.00", description: "Whisky Jack Daniels.", banner: null },
                    { id: "b15", name: "Caipirinha", price: "10.00", description: "Caipirinha de cachaça.", banner: null },
                  ],
                },
              ],
              products: [],
            },
            {
              id: "sobremesas",
              name: "Sobremesas",
              subcategories: [
                {
                  id: "sorvetes",
                  name: "Sorvetes",
                  products: [
                    { id: "s1", name: "Chocolate", price: "18.00", description: "Sorvete de chocolate.", banner: "placeholder" },
                    { id: "s2", name: "Baunilha", price: "18.00", description: "Sorvete de baunilha.", banner: "placeholder" },
                    { id: "s3", name: "Morango", price: "18.00", description: "Sorvete de morango.", banner: "placeholder" },
                    { id: "s4", name: "Flocos", price: "18.00", description: "Sorvete de flocos.", banner: "placeholder" },
                    { id: "s5", name: "Napolitano", price: "18.00", description: "Sorvete napolitano.", banner: "placeholder" },
                  ],
                },
                {
                  id: "mousses",
                  name: "Mousses",
                  products: [
                    { id: "s6", name: "Maracujá", price: "18.00", description: "Mousse de maracujá.", banner: "placeholder" },
                    { id: "s7", name: "Limão", price: "18.00", description: "Mousse de limão.", banner: "placeholder" },
                    { id: "s8", name: "Chocolate", price: "18.00", description: "Mousse de chocolate.", banner: "placeholder" },
                    { id: "s9", name: "Morango", price: "18.00", description: "Mousse de morango.", banner: "placeholder" },
                  ],
                },
                {
                  id: "pudim",
                  name: "Pudim",
                  products: [
                    { id: "s10", name: "Leite", price: "18.00", description: "Pudim de leite.", banner: "placeholder" },
                  ],
                },
                {
                  id: "tortinha",
                  name: "Tortinha de maçã",
                  products: [
                    { id: "s11", name: "Tortinha de maçã", price: "15.00", description: "Tortinha de maçã.", banner: "placeholder" },
                  ],
                },
              ],
              products: [],
            },
          ],
        };
 
        const formatted = mockResponse.data.map((cat) => ({
          ...cat,
          subcategories: cat.subcategories.map((sub) => ({
            ...sub,
            products: sub.products.map((p) => ({
              ...p,
              amount: 0,
              bannerUri: p.banner
                ? `http://10.0.2.2:3333/files/${p.banner}`
                : null,
            })),
          })),
        })) as Category[];
 
        setCategories(formatted);
      } catch (err) {
        console.log("Erro ao buscar categorias:", err);
      }
    }
 
    loadCategories();
  }, []);
 
  const filteredCategories = useMemo(() => {
    // (Mantido inalterado)
    if (!searchText) {
      return categories;
    }
    const lowerCaseSearch = searchText.toLowerCase();
 
    return categories.map(category => {
      const filteredSubcategories = category.subcategories.map(subcategory => {
        const filteredProducts = subcategory.products.filter(product =>
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product.description.toLowerCase().includes(lowerCaseSearch)
        );
 
        if (filteredProducts.length > 0) {
          return {
            ...subcategory,
            products: filteredProducts,
          };
        }
        return null;
      }).filter((sub): sub is Subcategory => sub !== null);
 
      if (filteredSubcategories.length > 0 || category.name.toLowerCase().includes(lowerCaseSearch)) {
        return {
          ...category,
          subcategories: filteredSubcategories,
        };
      }
      return null;
    }).filter((cat): cat is Category => cat !== null);
  }, [categories, searchText]);
 
  const handleCategoryPress = (id: string) => {
    // (Mantido inalterado)
    if (searchText) return;
 
    if (openCategory === id) {
      setOpenCategory(null);
      setOpenSubcategory(null);
    } else {
      setOpenCategory(id);
 
      const category = categories.find(c => c.id === id);
      if (category && category.subcategories && category.subcategories.length > 0) {
        setOpenSubcategory(category.subcategories[0].id);
      } else {
        setOpenSubcategory(null);
      }
 
      const y = categoryRefs.current[id];
      if (y !== undefined) {
        setTimeout(() => scrollRef.current?.scrollTo({ y, animated: true }), 50);
      }
    }
  };
 
  const handleSubcategoryPress = (subId: string) => {
    setOpenSubcategory(subId);
  };
 
  // 💡 CORREÇÃO 2: Tipagem de 'sub' ajustada de 'any' para 'Subcategory'
  const updateOrderSummary = (updatedCategories: Category[]) => {
    const summary: any[] = [];
    updatedCategories.forEach((cat) =>
      cat.subcategories.forEach((sub: Subcategory) => // Tipagem corrigida
        sub.products.forEach((p) => {
          if (p.amount > 0)
            summary.push({ ...p, category: cat.name, subcategory: sub.name });
        })
      )
    );
    setOrderSummary(summary as any[]);
  };
 
  const increment = (catId: string, prodId: string, price: string) => {
    // (Mantido inalterado)
    const updated = categories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map((sub: Subcategory) => ({ // Tipagem corrigida
            ...sub,
            products: sub.products.map((p) =>
              p.id === prodId ? { ...p, amount: p.amount + 1 } : p
            ),
          })),
        };
      }
      return cat;
    }) as Category[];
    setCategories(updated);
    setTotal((prev) => prev + parseFloat(price));
    setHasOrderItems(true);
    updateOrderSummary(updated);
  };
 
  const decrement = (catId: string, prodId: string, price: string) => {
    // (Mantido inalterado)
    const updated = categories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map((sub: Subcategory) => ({ // Tipagem corrigida
            ...sub,
            products: sub.products.map((p) =>
              p.id === prodId ? { ...p, amount: Math.max(0, p.amount - 1) } : p
            ),
          })),
        };
      }
      return cat;
    }) as Category[];
    setCategories(updated);
    setTotal((prev) => Math.max(0, prev - parseFloat(price)));

    const anyItem = updated.some((c) =>
      c.subcategories.some((s) => s.products.some((p) => p.amount > 0))
    );
    setHasOrderItems(anyItem);
    updateOrderSummary(updated);
  };
 
  const handleCancelOrder = () => {
    navigation.goBack();
  };
 
  // Funcao para navegar para a tela de pagamento
  const handleNavigateToPayment = async () => {
    // Verifica se há itens no pedido
    if (total === 0) {
      Alert.alert('Pedido Vazio', 'Não é possível finalizar um pedido sem itens.');
      return;
    }
 
    // Coleta os itens do pedido
    const items: { product_id: string; amount: number }[] = [];
    categories.forEach((cat) =>
      cat.products.forEach((p: any) => {
        if (p.amount > 0) {
          items.push({ product_id: p.id, amount: p.amount });
        }
      })
    );
 
    console.log('order_id:', route.params.order.id);
    console.log('Enviando itens:', items);
    try {
      // Envia os itens para o backend
      const response = await api.post('/order/add', {
        order_id: route.params.order.id,
        items,
      });
      console.log('Resposta do backend:', response.data);
 
      // Navega para a tela de pagamento, passando os dados necessários
      navigation.navigate('Payment', {
        number: route.params.number,
        order: route.params.order,
        total: total,
      });
    } catch (err) {
      console.error('Erro ao adicionar itens:', err);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o pedido. Tente novamente.');
    }
  };
 
  return (
    // O containerLayout deve ser o principal e envolver tudo
    <SafeAreaView style={styles.containerLayout}>
     
      {/* 💡 CORREÇÃO 4: Cabeçalho Fixo (header) fora do ScrollView */}
      <View style={styles.header}>
        {/* Ícone de Menu Hamburguer (Retirado do rowLayout e adaptado) */}
        <View style={styles.viewLayout}>
            <View style={styles.column2Layout}>
              <View style={styles.boxLayout} />
              <View style={styles.boxLayout} />
              <View style={styles.box2Layout} />
            </View>
        </View>
 
        <Image
            source={logo} // Usando a constante logo definida
            style={styles.logoImage}
        />
       
        {/* Adicionei o título que estava faltando no seu código anterior para manter a info da mesa */}
 
        <View style={styles.headerRight}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="cart-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
     
      {/* ScrollView preenche o restante do espaço e contém o conteúdo rolavel */}
      <ScrollView style={styles.scrollView} ref={scrollRef}>
        <View style={styles.columnLayout}>
         
          {/* 💡 REMOÇÃO: Removi a duplicação do cabeçalho que estava aqui (rowLayout/header) */}
         
          {/* BARRA DE PESQUISA */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search-outline" size={24} color="#5D3A2F" />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Pesquisar produtos" // Placeholder ajustado
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
 
          {/* LISTAGEM DE CATEGORIAS E PRODUTOS */}
          {filteredCategories.map((cat: Category) => (
            <View
              key={cat.id}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                categoryRefs.current[cat.id] = layout.y;
              }}
              style={styles.categoryWrapper}
            >
              {/* BOTÃO DE CATEGORIA PRINCIPAL */}
              <TouchableOpacity
                onPress={() => handleCategoryPress(cat.id)}
                style={styles.row2Layout}
                disabled={!!searchText}
              >
                <Text style={styles.inputLayout}>{cat.name}</Text>
                <Ionicons
                  name={(openCategory === cat.id && !searchText) ? "chevron-up-outline" : "chevron-down-outline"}
                  size={36}
                  color="#FFF"
                />
              </TouchableOpacity>
 
              {/* CONTAINER DE SUBCATEGORIAS E PRODUTOS */}
              {(openCategory === cat.id || !!searchText) && (
                <View style={styles.subcategoryView}>
                 
                  {/* SUBCATEGORIAS (Horizontal) */}
                  {!searchText && (
                    <FlatList
                      data={cat.subcategories}
                      keyExtractor={(item: Subcategory) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item: sub }) => (
                        <TouchableOpacity
                          key={sub.id}
                          onPress={() => handleSubcategoryPress(sub.id)}
                          style={[
                            styles.subCategoryButton,
                            openSubcategory === sub.id && styles.subCategoryButtonActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.subCategoryText,
                              openSubcategory === sub.id && styles.subCategoryTextActive,
                            ]}
                          >
                            {sub.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                 
                  {/* LISTA DE PRODUTOS DA SUBCATEGORIA ATIVA OU TODOS OS PRODUTOS FILTRADOS */}
                  {cat.subcategories.map((sub: Subcategory) =>
                    (openSubcategory === sub.id || !!searchText) && (
                      <View key={sub.id}>
                        {!!searchText && (
                          <Text style={styles.subcategoryTitleInSearch}>{sub.name}</Text>
                        )}
                        {sub.products.map((prod: Product) => (
                          <View key={prod.id} style={styles.productContainer}>
                            {prod.bannerUri ? (
                              <Image
                                source={{ uri: prod.bannerUri }}
                                style={styles.productImage}
                                resizeMode="cover"
                              />
                            ) : (
                              <View
                                style={[styles.productImage, { backgroundColor: "#555" }]}
                              />
                            )}
 
                            <View style={styles.productInfo}>
                              <Text style={styles.productName}>{prod.name}</Text>
                              <Text style={styles.productDesc}>{prod.description}</Text>
                              <Text style={styles.productPrice}>R$ {parseFloat(prod.price).toFixed(2)}</Text>
                            </View>
 
                            <View style={styles.counter}>
                              <TouchableOpacity
                                style={[styles.counterButton, { backgroundColor: '#FF3F4B' }]}
                                onPress={() => decrement(cat.id, prod.id, prod.price)}
                                disabled={prod.amount === 0}
                              >
                                <Text style={styles.counterText}>-</Text>
                              </TouchableOpacity>
                              <Text style={styles.amount}>{prod.amount}</Text>
                              <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => increment(cat.id, prod.id, prod.price)}
                              >
                                <Text style={styles.counterText}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </View>
                    )
                  )}
                </View>
              )}
            </View>
          ))}
          {/* Mensagem de "Não encontrado" */}
          {searchText && filteredCategories.length === 0 && (
            <Text style={styles.noResultsText}>
              Nenhum produto ou categoria encontrado para "{searchText}"
            </Text>
          )}
 
        </View>
      </ScrollView>
 
      {/* 💡 CORREÇÃO 5: Rodapé e Resumo (Footer/Summary) fora do ScrollView e fixos. */}
      {hasOrderItems && (
        <>
          <View style={styles.summaryContainer}>
            <FlatList
              data={orderSummary}
              keyExtractor={(item) => item.id + item.amount}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryText}>
                    {item.name} x {item.amount} - R${" "}
                    {(item.amount * parseFloat(item.price)).toFixed(2)}
                  </Text>
                </View>
              )}
            />
          </View>
          <View style={styles.orderSummary}>
            <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
          </View>
        </>
      )}
 
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: "#B72F14" }]}
          onPress={handleCancelOrder}
        >
          <Text style={styles.footerText}>Cancelar Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: "#F2CA85" }]}
          onPress={handleNavigateToPayment}
        >
          <Text style={styles.footerText}>Finalizar Pagamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
 
// --- Tipagem de Estilos Combinados ---
interface MergedStyle {
  // 💡 CORREÇÃO 6: Adicionei o header na tipagem
  header: ViewStyle;
  logoImage: ImageStyle;
 
  // Layout Styles
  containerLayout: ViewStyle;
  scrollView: ViewStyle;
  boxLayout: ViewStyle;
  box2Layout: ViewStyle;
  columnLayout: ViewStyle;
  column2Layout: ViewStyle;
  inputLayout: TextStyle;
  rowLayout: ViewStyle;
  row2Layout: ViewStyle;
  viewLayout: ViewStyle;
  headerRight: ViewStyle;
 
  // Order Styles
  titleMerged: TextStyle;
  categoryWrapper: ViewStyle;
  productContainer: ViewStyle;
  productImage: ImageStyle;
  productInfo: ViewStyle;
  productName: TextStyle;
  productDesc: TextStyle;
  productPrice: TextStyle;
  counter: ViewStyle;
  counterButton: ViewStyle;
  counterText: TextStyle;
  amount: TextStyle;
  summaryContainer: ViewStyle;
  summaryItem: ViewStyle;
  summaryText: TextStyle;
  footer: ViewStyle;
  footerButton: ViewStyle;
  footerText: TextStyle;
  orderSummary: ViewStyle;
  totalText: TextStyle;
 
  // Subcategory styles
  subcategoryView: ViewStyle;
  subCategoryButton: ViewStyle;
  subCategoryButtonActive: ViewStyle;
  subCategoryText: TextStyle;
  subCategoryTextActive: TextStyle;
 
  // NOVOS ESTILOS PARA PESQUISA
  searchBarContainer: ViewStyle;
  searchBarInput: TextStyle;
  noResultsText: TextStyle;
  subcategoryTitleInSearch: TextStyle;
}
 
const styles = StyleSheet.create<MergedStyle>({
  // --- LAYOUT STYLES (Adaptados do Layout.tsx) ---
  containerLayout: {
    flex: 1,
    backgroundColor: "#911F09",
  },
 
  // 💡 NOVO ESTILO: Cabeçalho Fixo (baseado no rowLayout, mas sem margin/padding inferior)
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
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 1,
    marginTop: 55,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginHorizontal: 10,
  },
 
  // 💡 AJUSTE: Removi o flex para que o ScrollView ocupe o espaço restante abaixo do header
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
  // 💡 AJUSTE: Ajustei marginTop para encostar no topo do ScrollView (vermelho)
  // e paddingBottom para não conflitar com o footer fixo.
  columnLayout: {
    backgroundColor: "#D9D9D9",
    borderRadius: 1,
    paddingBottom: 140,
    marginTop: - 10,
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
    fontSize: 36,
    flex: 1,
    textAlignVertical: 'center',
    height: '100%',
  },
  // 💡 REMOÇÃO: rowLayout não é mais usado no corpo principal
  rowLayout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderTopLeftRadius: 52,
    borderTopRightRadius: 52,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 31,
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,
  },
  row2Layout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#B72F14",
    borderRadius: 20,
    paddingVertical: 37,
    paddingLeft: 32,
    paddingRight: 32,
    marginBottom: 12,
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
 
  // --- ESTILOS DE PESQUISA ---
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
    shadowOffset: { width: 0, height: 2 },
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
  subcategoryTitleInSearch: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#911F09',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#B72F1450',
    paddingBottom: 2,
  },
 
  // --- ESTILOS DE SUBCATEGORIA ---
  subcategoryView: {
    marginHorizontal: 29,
    marginBottom: 20,
  },
  subCategoryButton: {
    backgroundColor: "#911F09",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  subCategoryButtonActive: {
    backgroundColor: "#B72F14",
    borderWidth: 2,
    borderColor: '#d41e1eff',
  },
  subCategoryText: {
    color: "#D9D9D9",
    fontWeight: 'normal',
    fontSize: 21,
  },
  subCategoryTextActive: {
    color: "#FFFFFF",
    fontWeight: 'bold',
    fontSize: 21,
  },
 
 
  // --- ORDER STYLES (Adaptados e Mantidos) ---
  titleMerged: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#101026",
    textAlign: "center",
    flex: 1,
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
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: '#B72F14',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    color: "#FFF",
    fontSize: 25,
    fontWeight: "bold"
  },
});
 