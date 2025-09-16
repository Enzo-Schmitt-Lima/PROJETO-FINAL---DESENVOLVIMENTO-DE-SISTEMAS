import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../pages/Dashboard";
import ChooseTable from "../pages/ChooseTable";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";
import SignIn from "../pages/SignIn";

export type StackParamsList = {
  Dashboard: undefined;
  ChooseTable: undefined;
  Order: { number: number; order_id: string };
  FinishOrder: { number: number; order_id: string };
  SignIn: undefined;
};

const Stack = createNativeStackNavigator<StackParamsList>();

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="ChooseTable" component={ChooseTable} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="FinishOrder" component={FinishOrder} />
    </Stack.Navigator>
  );
}
