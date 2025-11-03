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
import AssignTable from "../pages/AssignTable";

export type StackParamsList = {
  Dashboard: undefined;
  ChooseTable: undefined;
  CreateComanda: { tableNumber: number } | undefined;
  Order: { number: number; order_id: string; order: any };
  Cart: { number: number; order_id: string } | undefined;
  FinishOrder: { number: number; order_id: string };
  Payment: { number: number; order: any; total: number };
  OrderStatus: { number?: number; order?: any; order_id?: string; total?: number };
  Feedback: undefined;
  Account: undefined;
  Orders: undefined;
  AcompanharPedido: { order_id?: string } | undefined;
  Payments: undefined;
  Logout: undefined;
  AssignTable: undefined;
  EditProductIngredients: { product_id: string; product_name: string };
  EditProduct: { product_id: string };
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<StackParamsList>();

export default function AppRoutesGuest() {
  return (
    <Stack.Navigator initialRouteName="CreateComanda">
      <Stack.Screen
        name="CreateComanda"
        component={CreateComanda}
        options={{ headerShown: false }}
      />

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
        name="Cart"
        component={Cart}
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
      <Stack.Screen
        name="OrderStatus"
        component={require('../pages/OrderStatus').default}
        options={{
          title: "Status do Pedido",
          headerStyle: { backgroundColor: "#1d1d2e" },
          headerTintColor: "#FFF",
          headerShown: false,
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
        name="EditProductIngredients"
        component={require('../pages/EditProductIngredients').default}
        options={{
          title: "Editar Ingredientes",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={require('../pages/EditProduct').default}
        options={{
          title: "Editar Produto",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignIn"
        component={require('../pages/SignIn').default}
        options={{
          title: "Fazer Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={require('../pages/SignUp').default}
        options={{
          title: "Fazer Cadastro",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
