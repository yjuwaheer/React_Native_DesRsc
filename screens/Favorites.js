import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
// Firestore
import { db } from '../Config';
import { doc, getDoc } from "firebase/firestore";
// Icons
import { FontAwesome5 } from '@expo/vector-icons';
// Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
// Lottie
import LottieView from 'lottie-react-native';
// Components
import Card from './components/Card';
// Context
import { RenderContext } from './contexts/RenderContext';

const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // useContext hook
  const { render } = useContext(RenderContext);

  // Scroll ref and hook
  const ref = React.useRef(null);
  useScrollToTop(React.useRef({
    scrollToTop: () => ref.current.scrollToOffset({ offset: -100 }),
  }));

  useEffect(() => {
    AsyncStorage.getItem('resBookmarked').then((bookmarks) => {
      if (bookmarks && bookmarks !== '[]') {
        let tempBookmarks = [];
        const parsedBookmarks = JSON.parse(bookmarks);

        parsedBookmarks.forEach(async (bookmark) => {
          const docRef = doc(db, "resources", bookmark);
          const docSnap = await getDoc(docRef);
          await tempBookmarks.push({id: docSnap.id, data: docSnap.data()});

          setFavorites(tempBookmarks);
        });
      } else {
        setFavorites([]);
      }
    }).then(() => {
      setLoading(false);
    });
  }, [render]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}><FontAwesome5 name="grin-hearts" size={32} color="#FA8532" /> Favorites</Text>

      {favorites.length > 0 && (
        <FlatList
          ref={ref}
          style={{opacity: loading ? 0.5 : 1, ...styles.list}}
          showsVerticalScrollIndicator={false}
          data={favorites}
          renderItem={({ item }) => <Card item={item} disabled={true} />}
        />
      )}

      {!loading && favorites.length === 0 && (
        <View>
          <LottieView
            style={{width: Dimensions.get('window').width}}
            source={require('../assets/empty.json')}
            autoPlay
            loop={false}
          />
          <Text style={styles.noFavorites}>- No favorites yet -</Text>
        </View>
      )}
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#9E785E',
    textAlign: 'center',
    marginBottom: 5,
  },
  noFavorites: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C0C0C0',
    textAlign: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    textShadowRadius: 1,
  },
  list: {
    paddingTop: 10,
    paddingHorizontal: 5,
  },
});

export default Favorites
