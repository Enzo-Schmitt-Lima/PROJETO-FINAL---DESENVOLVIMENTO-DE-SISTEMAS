import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";

type EditProductIngredientsRouteProp = RouteProp<StackParamsList, "EditProductIngredients">;

interface Ingredient {
  id: string;
  name: string;
  selected: boolean;
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

interface ItemCustomization {
  ingrediente: { id: string; name: string };
  removed: boolean;
}



export default function EditProductIngredients() {
  const route = useRoute<EditProductIngredientsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { product_id, product_name, item_id } = route.params;

  const [productIngredients, setProductIngredients] = useState<ProductIngredient[]>([]);
  const [originalIngredients, setOriginalIngredients] = useState<ProductIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const loadProductIngredients = async () => {
    try {
      console.log("Product ID:", product_id);
      console.log("Item ID:", item_id);

      const productIngredientsResponse = await api.get(`/product/ingredients?product_id=${product_id}`);
      const baseIngredients = (productIngredientsResponse.data || []) as ProductIngredient[];

      let itemCustomizations: ItemCustomization[] = [];
      if (item_id) {
        try {
          const itemResponse = await api.get(`/item/${item_id}`);
          itemCustomizations = (itemResponse.data.ItemIngrediente || []).map((ci: any) => ({
            ingrediente: ci.ingrediente,
            removed: !!ci.removed,
          }));
        } catch (itemErr: any) {
          console.log("Item não encontrado ou erro ao carregar personalizações:", itemErr);
          if (itemErr.response?.status !== 404) {
            throw itemErr;
          }
          console.log("Item novo, sem personalizações prévias.");
        }
      }

      const removedIngredientIds = new Set(
        itemCustomizations.filter(c => c.removed).map(c => c.ingrediente.id)
      );

      const mergedIngredients = baseIngredients.map(pi => ({
        ...pi,
        ingrediente: { ...pi.ingrediente, selected: !removedIngredientIds.has(pi.ingrediente.id) }
      }));

      setProductIngredients(mergedIngredients);
      setOriginalIngredients(JSON.parse(JSON.stringify(mergedIngredients))); // Deep copy
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

  const toggleIngredient = (ingredient: Ingredient) => {
    setProductIngredients(prevIngredients =>
      prevIngredients.map(pi =>
        pi.ingrediente.id === ingredient.id
          ? { ...pi, ingrediente: { ...pi.ingrediente, selected: !pi.ingrediente.selected } }
          : pi
      )
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const changes: Promise<any>[] = [];

    // Build map of original selections by ingredient id
    const originalSelectionMap = new Map<string, boolean>();
    originalIngredients.forEach(oi => {
      originalSelectionMap.set(oi.ingrediente.id, oi.ingrediente.selected);
    });

    productIngredients.forEach((current) => {
      const originalSelected = originalSelectionMap.get(current.ingrediente.id);
      if (current.ingrediente.selected !== originalSelected) {
        if (current.ingrediente.selected) {
          // Add ingredient back
          changes.push(api.post('/item/ingrediente/add', {
            item_id,
            ingrediente_id: current.ingrediente.id,
          }));
        } else {
          // Mark ingredient as removed
          changes.push(api.post('/item/ingrediente/remove', {
            item_id, ingrediente_id: current.ingrediente.id
          }));
        }
      }
    });

    try {
      await Promise.all(changes);
      Alert.alert('Sucesso', 'Alterações salvas!');
      navigation.goBack();
    } catch (err) {
      console.log('Erro ao salvar alterações:', err);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isSaving) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{isSaving ? 'Salvando...' : 'Carregando...'}</Text>
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
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.productInfo}>
        <View style={styles.productImageContainer}>
          {product?.banner ? (
            <Image source={{ uri: `http://192.168.0.243:3333/files/${product.banner}` }} style={styles.productImage} />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <Ionicons name="image" size={50} color="#911F09" />
              <Text style={styles.placeholderText}>Sem imagem</Text>
            </View>
          )}
        </View>
        <Text style={styles.productName}>{product_name}</Text>
        {product && (
          <Text style={styles.productDetails}>Preço: R$ {product.price} | Descrição: {product.description}</Text>
        )}
      </View>

      <View style={styles.ingredientsList}>
        <Text style={styles.sectionTitle}>Ingredientes Atuais</Text>
        <FlatList
          data={productIngredients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.ingredientItem} onPress={() => toggleIngredient(item.ingrediente)}>
              <Text style={styles.ingredientName}>{item.ingrediente.name}</Text>
              <Ionicons
                name={item.ingrediente.selected ? 'checkbox' : 'square-outline'}
                size={24}
                color={item.ingrediente.selected ? '#F2CA85' : '#CCC'}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum ingrediente adicionado</Text>}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D9D9D9" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#D9D9D9', paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  backButton: { padding: 8 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', color: '#911F09', textAlign: 'center' },
  productInfo: { padding: 15, backgroundColor: '#FFF', margin: 10, borderRadius: 6 },
  productImage: { width: 100, height: 100, borderRadius: 6 },
  productImagePlaceholder: { width: 100, height: 100, borderRadius: 6, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 12, color: '#911F09', marginTop: 5 },
  productImageContainer: { marginBottom: 10 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#101026' },
  productDetails: { fontSize: 14, color: '#666', marginTop: 5 },
  ingredientsList: { flex: 1, padding: 15, backgroundColor: '#FFF', margin: 10, borderRadius: 6 },
  ingredientItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  ingredientName: { fontSize: 16, color: '#101026' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#911F09' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#D9D9D9" },
  loadingText: { fontSize: 16, color: '#911F09', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#911F09', marginBottom: 10 },
  saveButton: {
    backgroundColor: '#911F09',
    padding: 15,
    margin: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
