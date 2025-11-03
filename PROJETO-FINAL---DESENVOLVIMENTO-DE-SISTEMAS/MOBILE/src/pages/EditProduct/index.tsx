import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

type EditProductScreenProps = NativeStackScreenProps<StackParamsList, "EditProduct">;

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string | null;
}

export default function EditProduct({ navigation, route }: EditProductScreenProps) {
  const { product_id } = route.params;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);





  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await api.get<Product>(`/product/${product_id}`);
        const product = response.data;
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setBanner(product.banner);
      } catch (err) {
        console.log("Erro ao carregar produto:", err);
        Alert.alert("Erro", "Não foi possível carregar o produto.");
        navigation.goBack();
      } finally {
        setLoadingProduct(false);
      }
    }

    loadProduct();
  }, [product_id]);



  async function handleUpdateProduct() {
    if (!name || !price || !description) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);

      // Send banner as string (URL or empty)
      formData.append('banner', banner || '');

      await api.patch(`/product/${product_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert("Sucesso!", "Produto atualizado com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.log("Erro ao atualizar produto:", err);
      Alert.alert("Erro", "Não foi possível atualizar o produto.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingProduct) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#911F09" />
          <Text style={styles.loadingText}>Carregando produto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <View style={styles.contentWrapper}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Editar Produto</Text>
              <View style={styles.titleUnderlineWrapper}>
                <View style={styles.titleUnderline} />
              </View>
            </View>

            <TextInput
              placeholder="Nome do produto"
              style={styles.input}
              placeholderTextColor="#FFFFFF80"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Preço"
              style={styles.input}
              placeholderTextColor="#FFFFFF80"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Descrição"
              style={styles.input}
              placeholderTextColor="#FFFFFF80"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.imageContainer}>
              {banner ? (
                <Image key={banner} source={{ uri: banner }} style={styles.productImage} resizeMode="cover" />
              ) : (
                <View style={[styles.productImage, { backgroundColor: "#B72F14" }]} />
              )}
              <TouchableOpacity style={styles.editIconIngredients} onPress={() => navigation.navigate('EditProductIngredients', { product_id, product_name: name })}>
                <Ionicons name="pencil" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleUpdateProduct}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={25} color="#4F5476" />
              ) : (
                <Text style={styles.submitButtonText}>ATUALIZAR</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#911F09" },
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  mainContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 44,
    paddingVertical: 150,
    marginVertical: 42,
    marginHorizontal: 6,
    justifyContent: "center",
    minHeight: 600,
  },
  contentWrapper: { alignItems: "center", paddingTop: 50, paddingBottom: 20 },
  titleContainer: { alignItems: "center", marginBottom: 30 },
  titleText: { color: "#4F5476", fontSize: 28, fontWeight: "bold" },
  titleUnderlineWrapper: { alignItems: "center" },
  titleUnderline: {
    width: 120,
    height: 2,
    backgroundColor: "#4F5476",
    borderRadius: 10,
    marginTop: 4,
  },
  input: {
    width: 280,
    height: 50,
    backgroundColor: "#B72F14",
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 16,
    elevation: 3.5,
  },
  submitButton: {
    width: 280,
    height: 50,
    backgroundColor: "#F2CA85",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 3.5,
  },
  submitButtonText: { color: "#4F5476", fontSize: 14, fontWeight: "bold" },
  cancelButton: {
    width: 280,
    height: 50,
    backgroundColor: "#B72F14",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 3.5,
  },
  cancelButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFFFFF",
  },
  productImage: { width: 100, height: 100, borderRadius: 6 },
  imageContainer: { marginBottom: 10 },
  editIconIngredients: { position: 'absolute', top: 5, left: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 5 },
});
