import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, SafeAreaView, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
// Lottie
import LottieView from 'lottie-react-native';
// Components
import Card from './components/Card';
// Firestore
import { db } from '../Config';
import { collection, getDocs } from "firebase/firestore";
// Context
import { RenderContext } from './contexts/RenderContext';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // useContext hook
  const { render } = useContext(RenderContext);

  // Scroll ref and hook
  const ref = React.useRef(null);
  useScrollToTop(React.useRef({
    scrollToTop: () => ref.current.scrollToOffset({ offset: -100 }),
  }));

  useEffect(() => {
    let tempData = [];
    let tempCategories = ['All'];

    setLoading(true);

    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "resources"));
      querySnapshot.forEach((doc) => {
        if (selectedCategory === 'All') {
          tempData.push({id: doc.id, data: doc.data()});
        } else if (doc.data().category === selectedCategory) {
          tempData.push({id: doc.id, data: doc.data()});
        }

        if (!tempCategories.includes(doc.data().category)) {
          tempCategories.push(doc.data().category);
        }
      });

      setLoading(false);
      setData(tempData);
      setCategories(tempCategories);
    }

    getData();
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LottieView
        style={{zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
        source={require('../assets/loading.json')}
        autoPlay
        loop
      />}
      {categories.length > 0 && (
        <View style={styles.categories}>
          <ScrollView contentContainerStyle={styles.categories} horizontal={true} showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => {
              return <TouchableOpacity
                key={index}
                onPress={() => setSelectedCategory(category)}
              >
                <Text 
                  key={index} 
                  style={category === selectedCategory ? styles.categoryTextSelected : styles.categoryText}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            })}
          </ScrollView>
        </View>)}
      <FlatList
        ref={ref}
        style={{opacity: loading ? 0.5 : 1, ...styles.list}}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => <Card item={item} disabled={false} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categories: {
    alignItems: 'center',
    height: 60,
    elevation: 3,
    backgroundColor: '#FFFFFF' // invisible color
  },
  categoryText: {
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D6C9C1',
    marginRight: 10,
  },
  categoryTextSelected: {
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9E785E',
    marginRight: 10,
  },
  list: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
});

export default Home