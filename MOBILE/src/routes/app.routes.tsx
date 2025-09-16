import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";
import ChooseTable from "../pages/ChooseTable";

export type StackParamsList = {
    Dashboard: undefined;
    ChooseTable: undefined;
    Order: {
        number: number | string;
        order_id: string;
    };
    FinishOrder: {
        number: number | string;
        order_id: string;
    };
};

const Stack = createNativeStackNavigator<StackParamsList>();

function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChooseTable" component={ChooseTable} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="FinishOrder" component={FinishOrder}
                options={{
                    title: 'Finalizando',
                    headerStyle: { backgroundColor: '#1d1d2e' },
                    headerTintColor: '#FFF',
                    headerShown: true
                }}
            />
        </Stack.Navigator>
    )
}

export default AppRoutes;