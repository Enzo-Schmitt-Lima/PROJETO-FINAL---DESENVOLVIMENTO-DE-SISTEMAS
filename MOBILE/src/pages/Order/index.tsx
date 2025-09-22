import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";

type OrderRouteProp = RouteProp<StackParamsList, "Order">;

export default function Order() {
  const route = useRoute<OrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const scrollRef = useRef<ScrollView>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const CATEGORY_COLOR = "#3FFFA3";

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/category"); // backend retorna categorias com produtos
        const formatted = response.data.map((cat: any) => ({
          ...cat,
          products: cat.products
            ? cat.products.map((p: any) => ({ ...p, amount: 0 }))
            : [],
        }));
        setCategories(formatted);
      } catch (err) {
        console.log("Erro ao buscar categorias:", err);
      }
    }

    loadCategories();
  }, []);

  function increment(categoryId: string, productId: string, price: string) {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          products: cat.products.map((p: any) => {
            if (p.id === productId) {
              const updated = { ...p, amount: p.amount + 1 };
              updateSelectedProducts(updated, "add", parseFloat(price));
              return updated;
            }
            return p;
          }),
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
  }

  function decrement(categoryId: string, productId: string, price: string) {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          products: cat.products.map((p: any) => {
            if (p.id === productId && p.amount > 0) {
              const newAmount = p.amount - 1;
              const updated = { ...p, amount: newAmount };
              updateSelectedProducts(updated, "remove", parseFloat(price));
              return updated;
            }
            return p;
          }),
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
  }

  function updateSelectedProducts(product: any, action: "add" | "remove", price: number) {
    if (action === "add") {
      const exists = selectedProducts.find((item) => item.id === product.id);
      if (exists) {
        setSelectedProducts(
          selectedProducts.map((item) =>
            item.id === product.id ? product : item
          )
        );
      } else {
        setSelectedProducts([...selectedProducts, product]);
      }
      setTotal((prev) => parseFloat((prev + price).toFixed(2)));
    } else {
      const exists = selectedProducts.find((item) => item.id === product.id);
      if (exists) {
        if (product.amount === 0) {
          setSelectedProducts(selectedProducts.filter((item) => item.id !== product.id));
        } else {
          setSelectedProducts(
            selectedProducts.map((item) =>
              item.id === product.id ? product : item
            )
          );
        }
      }
      setTotal((prev) => parseFloat((prev - price).toFixed(2)));
    }
  }

  function handleCallWaiter() {
    Alert.alert("Garçom", "O garçom está vindo!");
  }

  function handleFinalizeOrder() {
    Alert.alert("Finalizar pedido", `Total: R$ ${total.toFixed(2)}`);
    setSelectedProducts([]);
    setTotal(0);
    setCategories(categories.map(cat => ({
      ...cat,
      products: cat.products.map((p: any) => ({ ...p, amount: 0 }))
    })));
  }

  function scrollToCategory(index: number) {
    scrollRef.current?.scrollTo({
      y: index * 100, // ajuste conforme altura de cada categoria
      animated: true,
    });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>⬅ Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCallWaiter}>
          <Text style={styles.waiter}>🧑‍🍳</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Mesa {route.params.number}</Text>

      <ScrollView ref={scrollRef} style={{ flex: 1, marginBottom: 150 }}>
        {categories.map((cat, index) => (
          <View key={cat.id} style={[styles.category, { backgroundColor: CATEGORY_COLOR }]}>
            <TouchableOpacity onPress={() => scrollToCategory(index)}>
              <Text style={styles.categoryTitle}>{cat.name}</Text>
            </TouchableOpacity>
            {cat.products.map((prod: any) => (
              <View key={prod.id} style={styles.product}>
                <Text style={styles.productName}>
                  {prod.name} - R$ {prod.price}
                </Text>
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

      {/* Footer */}
      <View style={styles.footer}>
        {selectedProducts.length > 0 && (
          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text style={styles.selectedItem}>
                {item.name} - {item.amount}x
              </Text>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ maxHeight: 50, marginBottom: 10 }}
          />
        )}
        <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.finalizeButton} onPress={handleFinalizeOrder}>
          <Text style={styles.finalizeText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1d1d2e", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  backButton: { color: "#FFF", fontSize: 18 },
  waiter: { fontSize: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", marginBottom: 16 },
  category: { padding: 10, borderRadius: 8, marginBottom: 12 },
  categoryTitle: { fontSize: 20, fontWeight: "bold", color: "#101026", marginBottom: 6 },
  product: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#29295c",
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
    alignItems: "center",
  },
  productName: { color: "#FFF", flex: 1 },
  counter: { flexDirection: "row", alignItems: "center" },
  counterButton: {
    width: 30,
    height: 30,
    backgroundColor: "#3FFFA3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  counterText: { fontSize: 18, fontWeight: "bold", color: "#101026" },
  amount: { color: "#FFF", fontSize: 16, marginHorizontal: 8 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#101026",
    padding: 10,
  },
  finalizeButton: {
    backgroundColor: "#FF3F4B",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  finalizeText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  selectedItem: { color: "#FFF", marginRight: 10, fontSize: 16 },
  totalText: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginBottom: 8 },
});
