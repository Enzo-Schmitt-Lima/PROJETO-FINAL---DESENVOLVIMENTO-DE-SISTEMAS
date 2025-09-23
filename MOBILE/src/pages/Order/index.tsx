import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";

type OrderRouteProp = RouteProp<StackParamsList, "Order">;

export default function Order() {
  const route = useRoute<OrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [categories, setCategories] = useState<any[]>([]);
  const [showProducts, setShowProducts] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasOrderItems, setHasOrderItems] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/category");
        const formatted = response.data.map((cat: any) => ({
          ...cat,
          products: cat.products.map((p: any) => ({ ...p, amount: 0 })),
        }));
        setCategories(formatted);
      } catch (err) {
        console.log("Erro ao buscar categorias:", err);
      }
    }
    loadCategories();
  }, []);

  const handleCategoryPress = (id: string) => {
    setShowProducts(showProducts === id ? null : id);
    setTimeout(() => {
      const y = document.getElementById(id)?.offsetTop;
      if (y !== undefined) scrollRef.current?.scrollTo({ y, animated: true });
    }, 50);
  };

  const updateOrderSummary = (updatedCategories: any[]) => {
    const summary: any[] = [];
    updatedCategories.forEach((cat) =>
      cat.products.forEach((p: any) => {
        if (p.amount > 0) summary.push({ ...p, category: cat.name });
      })
    );
    setOrderSummary(summary);
  };

  const increment = (catId: string, prodId: string, price: string) => {
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
  };

  const decrement = (catId: string, prodId: string, price: string) => {
    const updated = categories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          products: cat.products.map((p: any) =>
            p.id === prodId
              ? { ...p, amount: Math.max(0, p.amount - 1) }
              : p
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
  };

  const handleCancelOrder = () => {
    navigation.goBack();
  };

  const handleFinishOrder = () => {
    Alert.alert("Pedido finalizado!", `Total: R$ ${total.toFixed(2)}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mesa {route.params.number}</Text>

      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {categories.map((cat) => (
          <View key={cat.id} style={styles.categoryContainer}>
            <TouchableOpacity
              onPress={() => handleCategoryPress(cat.id)}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryTitle}>{cat.name}</Text>
            </TouchableOpacity>

            {showProducts === cat.id &&
              cat.products.map((prod: any) => (
                <View key={prod.id} style={styles.productContainer}>
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

      {/* Resumo horizontal acima do total */}
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
                  {item.name} x {item.amount} - R$ {(item.amount * parseFloat(item.price)).toFixed(2)}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Total */}
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
          onPress={handleFinishOrder}
        >
          <Text style={styles.footerText}>Finalizar Pedido</Text>
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
});
