import React, { useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

import { AuthContext } from "../contexts/AuthContext";

function Routes() {
  const { isAuthenticated, loadingAuth } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  // Redireciona automaticamente para ChooseTable depois do login
  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ChooseTable' }],
      });
    }
  }, [isAuthenticated]);

  if (loadingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1D1D2E', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={60} color="#FFF" />
      </View>
    )
  }

  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;
