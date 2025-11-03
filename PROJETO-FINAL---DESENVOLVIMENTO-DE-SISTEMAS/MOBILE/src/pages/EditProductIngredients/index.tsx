import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";

type EditProductIngredientsRouteProp = RouteProp<StackParamsList, "EditProductIngredients">;

interface Ingredient {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
}

interface ProductIngredient {
  id: string;
  ingrediente: Ingredient;
}

export default function EditProductIngredients() {
  const route = useRoute<EditProductIngredientsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { product_id, product_name } = route.params;

  const [productIngredients, setProductIngredients] = useState<ProductIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  const loadProductIngredients = async () => {
    try {
      console.log("Product ID:", product_id);
      const response = await api.get(`/product/ingredients?product_id=${product_id}`);
      console.log("Response data:", response.data);
      setProductIngredients(response.data ? response.data as ProductIngredient[] : []);
    } catch (err) {
      console.log("Erro ao carregar ingredientes do produto:", err);
      Alert.alert('Erro', 'Não foi possível carregar os ingredientes.');
    }
  };

  const loadProduct = async () => {
    try {
      const response = await api.get(`/product/${product_id}`);
      setProduct(response.data as Product);
    } catch (err) {
      console.log("Erro ao carregar produto:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadProductIngredients(), loadProduct()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const removeIngredient = async (ingredientId: string) => {
    try {
      await api.delete('/product/remove-ingredient', { params: { product_id, ingredient_id: ingredientId } });
      await loadProductIngredients();
      Alert.alert('Sucesso', 'Ingrediente removido com sucesso!');
    } catch (err) {
      console.log('Erro ao remover ingrediente:', err);
      Alert.alert('Erro', 'Não foi possível remover o ingrediente.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#911F09" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5D3A2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Ingredientes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { product_id })} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#5D3A2F" />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <View style={styles.productImageContainer}>
          {product?.banner ? (
            <Image source={{ uri: product.banner }} style={styles.productImage} />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <Ionicons name="image" size={50} color="#911F09" />
              <Text style={styles.placeholderText}>Sem imagem</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.productName}>{product_name}</Text>
        {product && (
          <Text style={styles.productDetails}>Preço: R$ {product.price} | Descrição: {product.description}</Text>
        )}
      </View>

      {/* Removido a seção de adicionar ingrediente, pois o cliente só pode remover */}

      <View style={styles.ingredientsList}>
        <Text style={styles.sectionTitle}>Ingredientes Atuais</Text>
        <FlatList
          data={productIngredients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.ingredientItem}>
              <Text style={styles.ingredientName}>{item.ingrediente.name}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeIngredient(item.ingrediente.id)}
              >
                <Ionicons name="trash" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum ingrediente adicionado</Text>}
        />
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D9D9D9" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#D9D9D9', paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  backButton: { padding: 8 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', color: '#911F09', textAlign: 'center' },
  editButton: { padding: 8 },
  productInfo: { padding: 15, backgroundColor: '#FFF', margin: 10, borderRadius: 6 },
  productImage: { width: 100, height: 100, borderRadius: 6 },
  productImagePlaceholder: { width: 100, height: 100, borderRadius: 6, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 12, color: '#911F09', marginTop: 5 },
  productImageContainer: { marginBottom: 10 },
  editIcon: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 5 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#101026' },
  productDetails: { fontSize: 14, color: '#666', marginTop: 5 },
  ingredientsList: { flex: 1, padding: 15, backgroundColor: '#FFF', margin: 10, borderRadius: 6 },
  ingredientItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  ingredientName: { fontSize: 16, color: '#101026' },
  removeButton: { backgroundColor: "#B72F14", padding: 8, borderRadius: 6 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#911F09' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#D9D9D9" },
  loadingText: { fontSize: 16, color: '#911F09', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#911F09', marginBottom: 10 },
});
