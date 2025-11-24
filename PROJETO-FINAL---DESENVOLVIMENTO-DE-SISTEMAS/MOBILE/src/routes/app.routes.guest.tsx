import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../pages/Dashboard";
import ChooseTable from "../pages/ChooseTable";
import CreateComanda from "../pages/CreateComanda";
import Order from "../pages/Order";
import Cart from "../pages/Cart";
import FinishOrder from "../pages/FinishOrder";
import Payment from "../pages/Pagamento";
import AcompanharPedido from "../pages/AcompanharPedido";

export type GuestStackParamsList = {
  CreateComanda: { tableNumber: number } | undefined;
  ChooseTable: undefined;
  Dashboard: undefined;
  Order: { number: number; order_id: string; order?: any };
  Cart: { number: number; order_id: string } | undefined;
  FinishOrder: { number: number; order_id: string };
  Payment: { number: number; order: any; total: number };

  OrderStatus: { number?: number; order?: any; order_id?: string; total?: number };

  AcompanharPedido: { order_id?: string } | undefined;

  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<GuestStackParamsList>();

export default function AppRoutesGuest() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen name="CreateComanda" component={CreateComanda} options={{ headerShown: false }} />
      <Stack.Screen name="ChooseTable" component={ChooseTable} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
      <Stack.Screen name="FinishOrder" component={FinishOrder} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />

      <Stack.Screen
        name="OrderStatus"
        component={require("../pages/OrderStatus").default}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="AcompanharPedido" component={AcompanharPedido} options={{ headerShown: false }} />

      <Stack.Screen
        name="SignIn"
        component={require("../pages/SignIn").default}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignUp"
        component={require("../pages/SignUp").default}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
