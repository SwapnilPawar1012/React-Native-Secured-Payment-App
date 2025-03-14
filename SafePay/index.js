import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { AppLockProvider } from './src/context/AppLockContext';

const RootApp = () => (
    <AppLockProvider>
        <AuthProvider>
            <AppProvider>
                <App />
            </AppProvider>
        </AuthProvider>
    </AppLockProvider>
);

AppRegistry.registerComponent(appName, () => RootApp);
