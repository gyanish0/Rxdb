import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../../../App';
import { businessCollectionName } from '../../store/database/InitializeDatabase';
import styles from './styles';
import ArticleManager from './ArticleManager';

const Business = () => {
  const { db } = useContext(AppContext);

  const [name, setName] = useState('');
  const [businessList, setBusinessList] = useState<any>([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (db[businessCollectionName]) {
        await db[businessCollectionName].find().$.subscribe((businesses: any) => {
          setBusinessList(businesses);
        });
      } else {
        return;
      }
    };
    fetchBusinesses();
  }, [db]);

  const addBusiness = async () => {
    if (db[businessCollectionName]) {
      const business = {
        id: `business_${Date.now()}`,
        name,
      };
      await db[businessCollectionName].insert(business);
      setBusinessList([...businessList, business]);
      setName('');
    }
  };

  const updateBusiness = async () => {
    const business = {
      id: selectedBusiness?.id,
      name,
    };
    await db[businessCollectionName].upsert(business);
    setSelectedBusiness(null);
    setName('');
  };


  return (
    <View style={styles.topContainer}>
      <Text style={styles.todoStyle}>{'Business Manager'}</Text>

      <ScrollView style={styles.todoList}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={name => setName(name)}
            placeholder="Business Name"
          />
          <TouchableOpacity
            style={styles.plusImage}
            disabled={!name}
            onPress={() => {
              !selectedBusiness ? addBusiness() : updateBusiness();
            }}>
            <Text style={styles.buttonText}>
              {!selectedBusiness ? 'Add Business' : 'Update Business'}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <ArticleManager businesses={businessList} />
        </View>

        {businessList.length === 0 && (
          <>
            <Text style={styles.noTodoStyle}>{'No Businesses'}</Text>
            <Text style={styles.noTodoStyle}>{'Add one to create'}</Text>
          </>
        )}
        {businessList.map((item: any, index: number) => (
          <View style={styles.cardTodo} key={index}>
            <View>
              <Text style={styles.todoName}>{item.name}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Business;