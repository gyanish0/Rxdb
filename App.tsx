import React, { createContext, useEffect, useState } from 'react';
import { LogBox, SafeAreaView } from 'react-native';
import styles from './src/modules/Todos/styles';
import initializeDB from './src/store/database/InitializeDatabase';
import Business from './src/modules/Todos/Business';
import NetInfo from '@react-native-community/netinfo';

export const AppContext = createContext({});

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);

const App = () => {
  const [db, setDb] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  console.log(isOnline, "isOnline");
  const checkConnectivity = async () => {
    const state = await NetInfo.fetch();
    console.log('Connection type:', state.type);
    console.log('Is connected?', state.isConnected);
    console.log('Has internet?', state.isInternetReachable);
  };

  useEffect(() => {
    const initDB = async () => {
      const DB = await initializeDB();
      setDb(DB);
    };
    initDB().then();
  }, [db]);


  return (
    <AppContext.Provider value={{ db }}>
      <SafeAreaView style={styles.container}>
        <Business />
      </SafeAreaView>
    </AppContext.Provider>
  );
};

export default App;
