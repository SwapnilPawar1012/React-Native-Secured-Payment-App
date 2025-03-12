import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';

const RootApp = () => (
    <AuthProvider>
        <AppProvider>
            <App />
        </AppProvider>
    </AuthProvider>
);

AppRegistry.registerComponent(appName, () => RootApp);
