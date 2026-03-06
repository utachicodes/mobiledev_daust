import { Redirect } from 'expo-router';

export default function RootIndex() {
    // Redirect to (app) which handles auth check
    return <Redirect href="/(app)" />;
}
