import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../pages/Dashboard";
import ChooseTable from "../pages/ChooseTable";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";
import Payment from "../pages/Pagamento";
import AcompanharPedido from "../pages/AcompanharPedido";

export type StackParamsList = {
  Dashboard: undefined;
  ChooseTable: undefined;
  Order: { number: number; order_id: string; order: any };
  FinishOrder: { number: number; order_id: string };
  Payment: { number: number; order: any; total: number };
  OrderStatus: { number?: number; order?: any; order_id?: string; total?: number };
  Feedback: undefined;
  Account: undefined;
  Orders: undefined;
  AcompanharPedido: { order_id?: string } | undefined;
  Payments: undefined;
  Logout: undefined;
};

const Stack = createNativeStackNavigator<StackParamsList>();

export default function AppRoutes() {
  return (
    <Stack.Navigator>
      {/* Tela inicial após login */}
      <Stack.Screen 
        name="ChooseTable" 
        component={ChooseTable} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="Order" 
        component={Order} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen
        name="FinishOrder"
        component={FinishOrder}
        options={{
          title: "Finalizando",
          headerStyle: { backgroundColor: "#1d1d2e" },
          headerTintColor: "#FFF",
        }}
      />
      
      {/* Nova tela de pagamento */}
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          title: "Pagamento",
          headerStyle: { backgroundColor: "#1d1d2e" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="OrderStatus"
        component={require('../pages/OrderStatus').default}
        options={{
          title: "Status do Pedido",
          headerStyle: { backgroundColor: "#1d1d2e" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="AcompanharPedido"
        component={AcompanharPedido}
        options={{
          title: "Acompanhar Pedido",
          headerStyle: { backgroundColor: "#1d1d2e" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={require('../pages/Feedback').default}
        options={{
          title: "Feedback",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Account"
        component={require('../pages/Account').default}
        options={{
          title: "Minha conta",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Orders"
        component={require('../pages/Orders').default}
        options={{
          title: "Meus pedidos",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Payments"
        component={require('../pages/Payments').default}
        options={{
          title: "Meus pagamentos",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Logout"
        component={require('../pages/Logout').default}
        options={{
          title: "Sair",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
