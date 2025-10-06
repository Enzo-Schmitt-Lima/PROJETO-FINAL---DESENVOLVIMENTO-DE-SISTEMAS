import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";

// A correção foi feita aqui. Adicionando o 'order' ao tipo de parâmetro.
type OrderRouteProp = RouteProp<StackParamsList, "Order">;

export default function Order() {
  const route = useRoute<OrderRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [categories, setCategories] = useState<any[]>([]);
  const [showProducts, setShowProducts] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasOrderItems, setHasOrderItems] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/category");

        const formatted = response.data.map((cat: any) => ({
          ...cat,
          products: cat.products.map((p: any) => ({
            ...p,
            amount: 0,
            bannerUri: p.banner
              ? `http://10.0.2.2:3333/files/${p.banner}`
              : null,
          })),
        }));

        setCategories(formatted);
      } catch (err) {
        console.log("Erro ao buscar categorias:", err);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function checkImageURLs() {
      if (categories.length > 0) {
        for (const category of categories) {
          for (const product of category.products) {
            console.log('Verificando URL da imagem:', product.bannerUri);
            console.log('ID do produto:', product.id);
          }
        }
      }
    }
    checkImageURLs();
  }, [categories]);

  const handleCategoryPress = (id: string) => {
    setShowProducts(showProducts === id ? null : id);
    const y = categoryRefs.current[id];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y, animated: true });
    }
  };

  const updateOrderSummary = (updatedCategories: any[]) => {
    const summary: any[] = [];
    updatedCategories.forEach((cat) =>
      cat.products.forEach((p: any) => {
        if (p.amount > 0)
          summary.push({ ...p, category: cat.title || cat.name });
      })
    );
    setOrderSummary(summary);
  };

  const increment = async (catId: string, prodId: string, price: string) => {
    try {
      // Chama a API para adicionar o item
      await api.post('/order/add', {
        order_id: route.params.order_id,
        product_id: prodId,
        amount: 1,
      });

      // Atualiza o estado local
      const updated = categories.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            products: cat.products.map((p: any) =>
              p.id === prodId ? { ...p, amount: p.amount + 1 } : p
            ),
          };
        }
        return cat;
      });
      setCategories(updated);
      setTotal((prev) => prev + parseFloat(price));
      setHasOrderItems(true);
      updateOrderSummary(updated);
    } catch (err) {
      console.log('Erro ao adicionar item:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o item ao pedido.');
    }
  };

  const decrement = async (catId: string, prodId: string, price: string) => {
    try {
      // Primeiro, buscar os itens do pedido para encontrar o item_id
      const orderDetailResponse = await api.get(`/order/detail?order_id=${route.params.order_id}`);
      const orderItems = orderDetailResponse.data.items || [];

      // Encontrar um item que corresponda ao produto
      const itemToRemove = orderItems.find((item: any) => item.product_id === prodId);

      if (itemToRemove) {
        // Chama a API para remover o item
        await api.delete('/order/remove', {
          params: { item_id: itemToRemove.id }
        });
      }

      // Atualiza o estado local
      const updated = categories.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            products: cat.products.map((p: any) =>
              p.id === prodId ? { ...p, amount: Math.max(0, p.amount - 1) } : p
            ),
          };
        }
        return cat;
      });
      setCategories(updated);

      setTotal((prev) => Math.max(0, prev - parseFloat(price)));

      const anyItem = updated.some((c) =>
        c.products.some((p: any) => p.amount > 0)
      );
      setHasOrderItems(anyItem);
      updateOrderSummary(updated);
    } catch (err) {
      console.log('Erro ao remover item:', err);
      Alert.alert('Erro', 'Não foi possível remover o item do pedido.');
    }
  };

  const handleCancelOrder = () => {
    navigation.goBack();
  };

  // Funcao para navegar para a tela de pagamento
  const handleNavigateToPayment = () => {
    // Verifica se há itens no pedido
    if (total === 0) {
      Alert.alert('Pedido Vazio', 'Não é possível finalizar um pedido sem itens.');
      return;
    }

    // Navega para a tela de pagamento, passando os dados necessários
    navigation.navigate('Payment', {
      number: route.params.number,
      order: route.params.order,
      total: total,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mesa {route.params.number}</Text>
      {imageError && (
        <Text style={styles.errorText}>
          Erro ao carregar imagem: {imageError}
        </Text>
      )}

      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {categories.map((cat) => (
          <View
            key={cat.id}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              categoryRefs.current[cat.id] = layout.y;
            }}
            style={styles.categoryContainer}
          >
            <TouchableOpacity
              onPress={() => handleCategoryPress(cat.id)}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryTitle}>{cat.title || cat.name}</Text>
            </TouchableOpacity>

            {showProducts === cat.id &&
              cat.products.map((prod: any) => (
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
                    <Text style={styles.productPrice}>R$ {prod.price}</Text>
                  </View>

                  <View style={styles.counter}>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => decrement(cat.id, prod.id, prod.price)}
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
        ))}
      </ScrollView>

      {hasOrderItems && (
        <View style={styles.summaryContainer}>
          <FlatList
            data={orderSummary}
            keyExtractor={(item) => item.id}
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
      )}

      {hasOrderItems && (
        <View style={styles.orderSummary}>
          <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: "#FF3F4B" }]}
          onPress={handleCancelOrder}
        >
          <Text style={styles.footerText}>Cancelar Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: "#3FFFA3" }]}
          onPress={handleNavigateToPayment} // Chamando a nova função de navegação
        >
          <Text style={styles.footerText}>Finalizar Pagamento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1d1d2e", paddingTop: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", textAlign: "center" },
  categoryContainer: { marginBottom: 12 },
  categoryButton: {
    backgroundColor: "#29295c",
    padding: 12,
    borderRadius: 8,
  },
  categoryTitle: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#3b3b6b",
    marginVertical: 4,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  productImage: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
  productInfo: { flex: 1, justifyContent: "center" },
  productName: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  productDesc: { color: "#DDD", fontSize: 12 },
  productPrice: { color: "#FFF", fontWeight: "bold", marginTop: 4 },
  counter: { flexDirection: "row", alignItems: "center" },
  counterButton: {
    width: 30,
    height: 30,
    backgroundColor: "#3FFFA3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  counterText: { fontWeight: "bold", color: "#101026", fontSize: 18 },
  amount: { color: "#FFF", marginHorizontal: 8, fontSize: 16 },
  summaryContainer: {
    backgroundColor: "#29295c",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  summaryItem: {
    backgroundColor: "#3FFFA3",
    padding: 6,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  summaryText: { color: "#101026", fontWeight: "bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#101026",
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  footerText: { fontWeight: "bold", color: "#FFF", fontSize: 16 },
  orderSummary: {
    backgroundColor: "#29295c",
    padding: 10,
    alignItems: "center",
  },
  totalText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "red", textAlign: "center", marginVertical: 10 },
});
