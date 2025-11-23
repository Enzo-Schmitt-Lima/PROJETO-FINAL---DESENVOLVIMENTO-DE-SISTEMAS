import React, { useEffect, useState, useCallback } from "react";
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
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

type CustomizeItemRouteProp = RouteProp<StackParamsList, "CustomizeItem">;

interface Ingredient {
  id: string;
  name: string;
  selected: boolean;
}

interface ProductIngredient {
  id: string;
  ingrediente: Ingredient;
}

interface Adicional {
  id: string;
  name: string;
  price: number;
}

interface SelectedAdicional extends Adicional {
  quantity: number;
  itemAdicionalId?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  category: Category;
}

interface PizzaIngredientState {
  [itemId: string]: ProductIngredient[];
}

interface PizzaAdicionalState {
  [itemId: string]: SelectedAdicional[];
}

export default function CustomizeItem() {
  const route = useRoute<CustomizeItemRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { product_id, product_name, item_id, item_ids } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [pizzaItemIds, setPizzaItemIds] = useState<string[]>(item_ids ?? (item_id ? [item_id] : []));
  const [currentPizzaIndex, setCurrentPizzaIndex] = useState(0);

  // States per pizza/itemId
  const [pizzaProductIngredients, setPizzaProductIngredients] = useState<PizzaIngredientState>({});
  const [pizzaOriginalIngredients, setPizzaOriginalIngredients] = useState<PizzaIngredientState>({});

  const [pizzaSelectedAdicionais, setPizzaSelectedAdicionais] = useState<PizzaAdicionalState>({});
  const [pizzaOriginalAdicionais, setPizzaOriginalAdicionais] = useState<PizzaAdicionalState>({});

  // Available adicionais for all pizzas
  const [availableAdicionais, setAvailableAdicionais] = useState<Adicional[]>([]);

  const loadCustomizations = useCallback(async () => {
    const itemId = pizzaItemIds[currentPizzaIndex];
    if (!itemId) return;
    try {
      const [ingredientsResponse, productResponse, availableAdicionaisResponse, itemResponse] = await Promise.all([
        api.get(`/product/ingredients?product_id=${product_id}`),
        api.get(`/product/${product_id}`),
        api.get('/adicional'),
        api.get(`/item/${itemId}`)
      ]);

      setProduct(productResponse.data as Product);
      setAvailableAdicionais(availableAdicionaisResponse.data || []);

      const baseIngredients = (ingredientsResponse.data || []) as ProductIngredient[];
      const itemIngredientes = itemResponse?.data?.ItemIngrediente || [];
      const removedIngredientIds = new Set(
        itemIngredientes.filter((i: any) => i.removed).map((i: any) => i.ingredienteId)
      );
      const mergedIngredients = baseIngredients.map(pi => ({
        ...pi,
        ingrediente: { ...pi.ingrediente, selected: !removedIngredientIds.has(pi.ingrediente.id) }
      }));

      const itemAdicionais = itemResponse?.data?.ItemAdicional || [];
      const populatedSelectedAdicionais = itemAdicionais.map((ia: any) => ({
        id: ia.adicionais.id,
        name: ia.adicionais.name,
        price: ia.adicionais.price,
        quantity: ia.quantity,
        itemAdicionalId: ia.id,
      }));

      setPizzaProductIngredients(prev => ({ ...prev, [itemId]: mergedIngredients }));
      setPizzaOriginalIngredients(prev => ({ ...prev, [itemId]: JSON.parse(JSON.stringify(mergedIngredients)) }));

      setPizzaSelectedAdicionais(prev => ({ ...prev, [itemId]: populatedSelectedAdicionais }));
      setPizzaOriginalAdicionais(prev => ({ ...prev, [itemId]: JSON.parse(JSON.stringify(populatedSelectedAdicionais)) }));
    } catch (error) {
      console.log("Erro ao carregar personalizações:", error);
      Alert.alert('Erro', 'Não foi possível carregar as personalizações do item.');
    }
  }, [product_id, pizzaItemIds, currentPizzaIndex]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadCustomizations();
      setLoading(false);
    };
    loadData();
  }, [loadCustomizations]);

  const productIngredients = pizzaProductIngredients[pizzaItemIds[currentPizzaIndex] || ""] || [];
  const originalIngredients = pizzaOriginalIngredients[pizzaItemIds[currentPizzaIndex] || ""] || [];

  const selectedAdicionais = pizzaSelectedAdicionais[pizzaItemIds[currentPizzaIndex] || ""] || [];
  const originalAdicionais = pizzaOriginalAdicionais[pizzaItemIds[currentPizzaIndex] || ""] || [];

  const toggleIngredient = (ingredientId: string) => {
    const currentItemId = pizzaItemIds[currentPizzaIndex];
    if (!currentItemId) return;
    const currentIngredients = pizzaProductIngredients[currentItemId] || [];
    const updatedIngredients = currentIngredients.map(pi =>
      pi.ingrediente.id === ingredientId
        ? { ...pi, ingrediente: { ...pi.ingrediente, selected: !pi.ingrediente.selected } }
        : pi
    );
    setPizzaProductIngredients(prev => ({ ...prev, [currentItemId]: updatedIngredients }));
  };

  const handleAddAdicional = (adicional: Adicional) => {
    const currentItemId = pizzaItemIds[currentPizzaIndex];
    if (!currentItemId) return;
    const currentAdicionais = pizzaSelectedAdicionais[currentItemId] || [];
    const existing = currentAdicionais.find(a => a.id === adicional.id);
    let updatedAdicionais: SelectedAdicional[];

    if (existing) {
      updatedAdicionais = currentAdicionais.map(a =>
        a.id === adicional.id ? { ...a, quantity: a.quantity + 1 } : a
      );
    } else {
      updatedAdicionais = [...currentAdicionais, { ...adicional, quantity: 1 }];
    }
    setPizzaSelectedAdicionais(prev => ({ ...prev, [currentItemId]: updatedAdicionais }));
  };

  const handleRemoveAdicional = (adicionalId: string) => {
    const currentItemId = pizzaItemIds[currentPizzaIndex];
    if (!currentItemId) return;
    const currentAdicionais = pizzaSelectedAdicionais[currentItemId] || [];
    const existing = currentAdicionais.find(a => a.id === adicionalId);
    let updatedAdicionais: SelectedAdicional[];

    if (existing && existing.quantity > 1) {
      updatedAdicionais = currentAdicionais.map(a =>
        a.id === adicionalId ? { ...a, quantity: a.quantity - 1 } : a
      );
    } else {
      updatedAdicionais = currentAdicionais.filter(a => a.id !== adicionalId);
    }
    setPizzaSelectedAdicionais(prev => ({ ...prev, [currentItemId]: updatedAdicionais }));
  };

  const handleSaveChanges = async () => {
    const currentItemId = pizzaItemIds[currentPizzaIndex];
    if (!currentItemId) {
      Alert.alert('Erro', 'Item inválido para salvar.');
      return;
    }

    setIsSaving(true);
    const changes: Promise<any>[] = [];

    productIngredients.forEach((current, index) => {
      const original = originalIngredients[index];
      if (current.ingrediente.selected !== original.ingrediente.selected) {
        const endpoint = current.ingrediente.selected ? '/item/ingrediente/add' : '/item/ingrediente/remove';
        changes.push(api.post(endpoint, { item_id: currentItemId, ingrediente_id: current.ingrediente.id }));
      }
    });

    const originalAdicionaisMap = new Map(originalAdicionais.map(a => [a.id, a.quantity]));
    const selectedAdicionaisMap = new Map(selectedAdicionais.map(a => [a.id, a]));

    originalAdicionais.forEach(original => {
      const current = selectedAdicionaisMap.get(original.id);
      if (!current) {
        for (let i = 0; i < original.quantity; i++) {
          changes.push(api.delete(`/item/adicional?item_adicional_id=${original.itemAdicionalId}`));
        }
      } else if (current.quantity < original.quantity) {
        const diff = original.quantity - current.quantity;
        for (let i = 0; i < diff; i++) {
          changes.push(api.delete(`/item/adicional?item_adicional_id=${original.itemAdicionalId}`));
        }
      }
    });

    selectedAdicionais.forEach(current => {
      const originalQty = originalAdicionaisMap.get(current.id) || 0;
      if (current.quantity > originalQty) {
        const diff = current.quantity - originalQty;
        for (let i = 0; i < diff; i++) {
          changes.push(api.post('/item/adicional', { item_id: currentItemId, adicional_id: current.id }));
        }
      }
    });

    try {
      await Promise.all(changes);
      Alert.alert('Sucesso', 'Alterações salvas!');
      // Mark this item as recently edited so Cart can avoid regrouping it immediately
      try {
        await AsyncStorage.setItem('@App:lastEditedItem', currentItemId);
        console.log('Saved lastEditedItem in AsyncStorage:', currentItemId);
      } catch (e) {
        console.log('Erro ao gravar lastEditedItem no AsyncStorage', e);
      }
      navigation.goBack();
    } catch (error) {
      console.log('Erro ao salvar alterações:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const getAdicionalQuantity = (adicionalId: string) => {
    return selectedAdicionais.find(a => a.id === adicionalId)?.quantity || 0;
  };

  const allowedCategories = ["Pizzas Clássicas", "Pizzas Especiais"];
  const isPizza = product && allowedCategories.includes(product.category.name);

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <Image source={{ uri: `${api.defaults.baseURL}/files/${product?.banner}` }} style={styles.productImage} />
      <View style={styles.productTextContainer}>
        <Text style={styles.productName}>{product_name}</Text>
        {product && <Text style={styles.productDetails}>Preço Base: R$ {product.price}</Text>}
      </View>
    </View>
  );

  const pizzaNumberDisplay = pizzaItemIds.length > 1 ? `Pizza ${currentPizzaIndex + 1} de ${pizzaItemIds.length}` : null;

  const renderPizzaNavigation = () => {
    if (pizzaItemIds.length <= 1) return null;

    return (
      <View style={styles.pizzaNavigationContainer}>
        <TouchableOpacity
          style={[styles.pizzaNavButton, currentPizzaIndex === 0 && styles.pizzaNavButtonDisabled]}
          disabled={currentPizzaIndex === 0}
          onPress={() => setCurrentPizzaIndex(currentPizzaIndex - 1)}
        >
          <Text style={styles.pizzaNavButtonText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pizzaNavLabel}>{pizzaNumberDisplay}</Text>
        <TouchableOpacity
          style={[styles.pizzaNavButton, currentPizzaIndex === pizzaItemIds.length - 1 && styles.pizzaNavButtonDisabled]}
          disabled={currentPizzaIndex === pizzaItemIds.length - 1}
          onPress={() => setCurrentPizzaIndex(currentPizzaIndex + 1)}
        >
          <Text style={styles.pizzaNavButtonText}>Próxima</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderIngredientsSelection = () => (
    <View style={styles.listContainer}>
      <Text style={styles.sectionTitle}>Ingredientes (Remover/Adicionar)</Text>
      <FlatList
        data={productIngredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => toggleIngredient(item.ingrediente.id)}>
            <Text style={styles.itemName}>{item.ingrediente.name}</Text>
            <Ionicons name={item.ingrediente.selected ? 'checkbox' : 'square-outline'} size={24} color={item.ingrediente.selected ? '#911F09' : '#CCC'} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum ingrediente base</Text>}
        scrollEnabled={false}
      />
    </View>
  );

  const renderAdicionaisSelection = () => (
    <View style={styles.listContainer}>
      <Text style={styles.sectionTitle}>Adicionais</Text>
      <FlatList
        data={availableAdicionais}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>+ R$ {item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.controlButton} onPress={() => handleRemoveAdicional(item.id)}>
                <Text style={styles.controlText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{getAdicionalQuantity(item.id)}</Text>
              <TouchableOpacity style={styles.controlButton} onPress={() => handleAddAdicional(item)}>
                <Text style={styles.controlText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum adicional disponível</Text>}
        scrollEnabled={false}
      />
    </View>
  );

  const renderSaveButton = () => (
    <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
      <Text style={styles.saveButtonText}>Salvar Alterações</Text>
    </TouchableOpacity>
  );

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

      <View style={styles.debugContainer}>
        <Text>DEBUG</Text>
        <Text>{`Pizza Index: ${currentPizzaIndex}`}</Text>
        <Text>{`Pizza ID: ${pizzaItemIds[currentPizzaIndex] || 'N/A'}`}</Text>
        <Text>{`Ingredientes selecionados: ${productIngredients.filter(pi => pi.ingrediente.selected).length}`}</Text>
        <Text>{`Adicionais selecionados: ${selectedAdicionais.reduce((sum, a) => sum + a.quantity, 0)}`}</Text>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5D3A2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personalizar Item</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        {renderPizzaNavigation()}
        {renderProductInfo()}
        {isPizza && renderIngredientsSelection()}
        {isPizza && renderAdicionaisSelection()}
        {renderSaveButton()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backButton: { padding: 8 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#911F09",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  loadingText: { fontSize: 16, color: "#911F09", fontWeight: "bold" },

  productInfo: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#FFF",
    margin: 10,
    marginBottom: 0,
    borderRadius: 6,
    alignItems: "center",
  },
  productImage: { width: 80, height: 80, borderRadius: 6 },
  productTextContainer: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 20, fontWeight: "bold", color: "#101026" },
  productDetails: { fontSize: 14, color: "#666", marginTop: 5 },

  listContainer: {
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 6,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#911F09",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 5,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  itemName: { fontSize: 16, color: "#101026" },
  itemPrice: { fontSize: 14, color: "#555", marginTop: 2 },
  emptyText: { textAlign: "center", marginVertical: 20, fontSize: 16, color: "#999" },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    width: 35,
    height: 35,
    backgroundColor: "#F2CA85",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  controlText: { fontWeight: "bold", color: "#101026", fontSize: 20 },
  quantity: { marginHorizontal: 15, fontSize: 16, fontWeight: "bold" },

  saveButton: {
    backgroundColor: "#911F09",
    padding: 15,
    margin: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },

  pizzaNavigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  pizzaNavButton: {
    backgroundColor: "#911F09",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  pizzaNavButtonDisabled: {
    backgroundColor: "#ccc",
  },
  pizzaNavButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  pizzaNavLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#911F09",
  },
  debugContainer: {
    backgroundColor: "#ffe8e8",
    padding: 10,
    margin: 10,
    borderRadius: 6,
  },
});
