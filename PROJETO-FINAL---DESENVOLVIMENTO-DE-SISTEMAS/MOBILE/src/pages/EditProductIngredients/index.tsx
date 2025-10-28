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
  TextInput,
  Image,
  Modal,
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
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadProductIngredients = async () => {
    try {
      const response = await api.get(`/product/ingredients?product_id=${product_id}`);
      setProductIngredients(response.data ? response.data as ProductIngredient[] : []);
    } catch (err) {
      console.log("Erro ao carregar ingredientes do produto:", err);
      Alert.alert('Erro', 'Não foi possível carregar os ingredientes.');
    }
  };

  const loadAllIngredients = async () => {
    try {
      const response = await api.get("/ingrediente");
      setAllIngredients(response.data ? response.data as Ingredient[] : []);
    } catch (err) {
      console.log("Erro ao carregar todos os ingredientes:", err);
      Alert.alert('Erro', 'Não foi possível carregar os ingredientes disponíveis.');
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
      await Promise.all([loadProductIngredients(), loadAllIngredients(), loadProduct()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const addIngredient = async () => {
    if (!selectedIngredient) {
      Alert.alert('Erro', 'Selecione um ingrediente para adicionar.');
      return;
    }

    try {
      await api.post('/product/add-ingredient', {
        product_id,
        ingredient_id: selectedIngredient,
      });
      await loadProductIngredients();
      setSelectedIngredient("");
      Alert.alert('Sucesso', 'Ingrediente adicionado com sucesso!');
    } catch (err) {
      console.log('Erro ao adicionar ingrediente:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o ingrediente.');
    }
  };

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

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient.id);
  };

  const availableIngredients = allIngredients.filter(
    (ing) => !productIngredients.some((pi) => pi.ingrediente.id === ing.id)
  );

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

      <View style={styles.addIngredientSection}>
        <Text style={styles.sectionTitle}>Adicionar Ingrediente</Text>
        <View style={styles.addIngredientContainer}>
          <TextInput
            style={styles.ingredientInput}
            placeholder="Selecione um ingrediente"
            value={allIngredients.find((ing) => ing.id === selectedIngredient)?.name || ""}
            editable={false}
          />
          <TouchableOpacity style={styles.selectButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.selectButtonText}>Selecionar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

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

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Ingrediente</Text>
            <FlatList
              data={availableIngredients}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleSelectIngredient(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum ingrediente disponível</Text>}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addIngredientSection: { padding: 15, backgroundColor: '#FFF', margin: 10, borderRadius: 6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#911F09', marginBottom: 10 },
  addIngredientContainer: { flexDirection: 'row', alignItems: 'center' },
  ingredientInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginRight: 10 },
  selectButton: { backgroundColor: "#F2CA85", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 6, marginRight: 10 },
  selectButtonText: { fontWeight: "bold", color: "#101026" },
  addButton: { backgroundColor: "#911F09", padding: 10, borderRadius: 6 },
  ingredientsList: { flex: 1, padding: 15, backgroundColor: '#FFF', margin: 10, borderRadius: 6 },
  ingredientItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  ingredientName: { fontSize: 16, color: '#101026' },
  removeButton: { backgroundColor: "#B72F14", padding: 8, borderRadius: 6 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#911F09' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#D9D9D9" },
  loadingText: { fontSize: 16, color: '#911F09', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, width: '80%', maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#911F09', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16, color: '#101026' },
  closeButton: { marginTop: 15, backgroundColor: "#911F09", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, alignSelf: 'center' },
  closeButtonText: { color: '#FFF', fontWeight: 'bold' },
});
