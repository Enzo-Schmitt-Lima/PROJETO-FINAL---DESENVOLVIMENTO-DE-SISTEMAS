import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext";

import Dashboard from "../pages/Dashboard";
import ChooseTable from "../pages/ChooseTable";
import CreateComanda from "../pages/CreateComanda";
import Order from "../pages/Order";
import Cart from "../pages/Cart";
import FinishOrder from "../pages/FinishOrder";
import Payment from "../pages/Pagamento";
import AcompanharPedido from "../pages/AcompanharPedido";
import AssignTable from "../pages/AssignTable";
import Orders from "../pages/Orders";

export type AppStackParamsList = {
  Dashboard: undefined;
  ChooseTable: undefined;
  CreateComanda: { tableNumber: number } | undefined;
  Order: { number: number; order_id: string; order?: any };
  Cart: { number: number; order_id: string } | undefined;
  FinishOrder: { number: number; order_id: string };
  Payment: { number: number; order: any; total: number };
  OrderStatus: { number?: number; order?: any; order_id?: string; total?: number };
  Feedback: undefined;
  Account: undefined;
  Orders: { order_id?: string; number?: number; fromPayment?: boolean } | undefined;
  AcompanharPedido: { order_id?: string } | undefined;
  Payments: undefined;
  Logout: undefined;
  AssignTable: undefined;
  CustomizeItem: { product_id: string; product_name: string; item_id?: string; item_ids?: string[] };
  EditProduct: { product_id: string };
  EditProductIngredients: { product_id: string; product_name: string; item_id: string };
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamsList>();

export default function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);
  // Set initial route dynamically based on authentication status
  const initialRouteName = isAuthenticated ? "CreateComanda" : "Dashboard";

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="ChooseTable" component={ChooseTable} />
      <Stack.Screen name="CreateComanda" component={CreateComanda} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="FinishOrder" component={FinishOrder} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="OrderStatus" component={require("../pages/OrderStatus").default} />
      <Stack.Screen name="AcompanharPedido" component={AcompanharPedido} />
      <Stack.Screen name="Feedback" component={require("../pages/Feedback").default} />
      <Stack.Screen name="AssignTable" component={AssignTable} />
      <Stack.Screen name="EditProductIngredients" component={require("../pages/EditProductIngredients").default} />
      <Stack.Screen name="EditProduct" component={require("../pages/EditProduct").default} />
      <Stack.Screen name="SignIn" component={require("../pages/SignIn").default} />
      <Stack.Screen name="SignUp" component={require("../pages/SignUp").default} />
      <Stack.Screen name="Orders" component={Orders} />
    </Stack.Navigator>
  );
}
