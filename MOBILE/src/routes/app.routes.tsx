import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../pages/Dashboard";
import ChooseTable from "../pages/ChooseTable";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";
import Payment from "../pages/Payment";

export type StackParamsList = {
  Dashboard: undefined;
  ChooseTable: undefined;
  Order: { number: number; order_id: string; order: any };
  FinishOrder: { number: number; order_id: string };
  Payment: { number: number; order: any; total: number };
  OrderStatus: { number: number; order: any; total: number };
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
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
