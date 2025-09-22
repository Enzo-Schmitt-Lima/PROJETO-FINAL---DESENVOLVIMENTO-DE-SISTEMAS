import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";

type OrderRouteProp = RouteProp<StackParamsList, "Order">;

interface OrderItem {
  id: string;
  amount: number;
  product: {
    id: string;
    name: string;
  };
}

export default function Order() {
  const route = useRoute<OrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);

  const order_id = route.params.order_id;

  async function loadOrderItems() {
    try {
      const response = await api.get("/order/detail", { params: { order_id } });
      setItems(response.data);
    } catch (err) {
      console.log("Erro ao buscar detalhes do pedido:", err);
    }
  }

  useEffect(() => {
    loadOrderItems();
  }, [order_id]);

  async function handleUpdateItem(item: OrderItem, newAmount: number) {
    try {
      if (newAmount <= 0) {
        // Remover item
        await api.delete("/order/remove", { params: { item_id: item.id } });
      } else {
        // Adicionar/Atualizar quantidade
        await api.post("/order/add", { order_id, product_id: item.product.id, amount: newAmount });
      }
      loadOrderItems();
    } catch (err) {
      console.log("Erro ao atualizar item:", err);
      Alert.alert("Erro", "Não foi possível atualizar o item");
    }
  }

  async function handleCloseOrder() {
    try {
      setLoading(true);
      await api.delete("/order", { params: { order_id } });
      navigation.goBack();
    } catch (err) {
      console.log("Erro ao fechar pedido:", err);
      Alert.alert("Erro", "Não foi possível fechar o pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mesa {route.params.number}</Text>
        <TouchableOpacity onPress={() => Alert.alert("Chamando Garçom", "O garçom está vindo")} style={styles.sinalButton}>
          <Text style={styles.sinalText}>🔔</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.item}>{item.product.name}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity onPress={() => handleUpdateItem(item, item.amount - 1)} style={styles.counterButton}>
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.amountText}>{item.amount}</Text>
                <TouchableOpacity onPress={() => handleUpdateItem(item, item.amount + 1)} style={styles.counterButton}>
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum item no pedido</Text>}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleCloseOrder} disabled={loading}>
        <Text style={styles.textButton}>Fechar pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1d1d2e", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  backButton: { padding: 8 },
  backText: { color: "#FFF", fontWeight: "bold" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  sinalButton: { padding: 8 },
  sinalText: { fontSize: 24 },
  itemContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#333", padding: 12, borderRadius: 8, marginBottom: 8 },
  item: { color: "#FFF", fontSize: 18, flex: 1 },
  counterContainer: { flexDirection: "row", alignItems: "center" },
  counterButton: { backgroundColor: "#FF3F4B", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  counterText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  amountText: { color: "#FFF", fontSize: 16, fontWeight: "bold", marginHorizontal: 8 },
  empty: { fontSize: 16, color: "#999", textAlign: "center", marginTop: 20 },
  button: { marginTop: 20, backgroundColor: "#FF3F4b", paddingVertical: 12, borderRadius: 4, alignItems: "center" },
  textButton: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
});
