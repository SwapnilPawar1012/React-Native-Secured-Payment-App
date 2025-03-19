import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { AppLockProvider } from './src/context/AppLockContext';
import { AdvanceProtectionProvider } from './src/context/AdvanceProtectionContext';

const RootApp = () => (
    <AppLockProvider>
        <AdvanceProtectionProvider>
            <AuthProvider>
                <AppProvider>
                    <App />
                </AppProvider>
            </AuthProvider>
        </AdvanceProtectionProvider>
    </AppLockProvider>
);

AppRegistry.registerComponent(appName, () => RootApp);
