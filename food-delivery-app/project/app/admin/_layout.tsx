import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="menu-management" />
      <Stack.Screen name="order-management" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}