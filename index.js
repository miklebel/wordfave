import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import Instabug from 'instabug-reactnative';

Instabug.start('a8ba688d71a773c42448e490ee0db2b5', [Instabug.invocationEvent.shake, Instabug.invocationEvent.screenshot]);

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
