import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Pressable, Linking, Text, View, Image, TouchableOpacity } from 'react-native';
// Icons
import { FontAwesome } from '@expo/vector-icons';
// Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
// Context
import { RenderContext } from '../contexts/RenderContext';

const Card = ({ item, disabled }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // useContext hook
  const { render, setRender } = useContext(RenderContext);

  useEffect(() => {
    AsyncStorage.getItem('resBookmarked').then((bookmarks) => {
      if (bookmarks) {
        const parsedBookmarks = JSON.parse(bookmarks);
        setIsBookmarked(parsedBookmarks.includes(item.id));
      }
    });
  }, []);

  const handleBookmark = () => {
    setIsBookmarked(prev => !prev);
    getData();
  };

  const getData = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('resBookmarked');
      jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
      
      if (jsonValue == null) {
        jsonValue = [];
        jsonValue.push(item.id);
        storeData(jsonValue);
      } else {
        if (jsonValue.includes(item.id)) {
          jsonValue = jsonValue.filter((id) => id !== item.id);
        } else {
          jsonValue.push(item.id);
        }
        storeData(jsonValue);
      }
    } catch(e) {
      // error reading value
    }
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('resBookmarked', jsonValue);
      setRender(!render);
    } catch (e) {
      // saving error
    }
  }

  return (
    <Pressable
      onPress={()=>{ Linking.openURL(item.data.link)}}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#FBDAC3" : "#FFFFFF",
        },
        styles.container
      ]}
    >
      <Image style={styles.image} source={{ uri: item.data.iconLink }} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.data.title}</Text>
        <Text style={styles.description}>{item.data.description}</Text>
        <Text style={styles.category}>{item.data.category}</Text>
      </View>
      {!disabled && <TouchableOpacity style={styles.bookmark} onPress={handleBookmark}>
        {isBookmarked ?
          <FontAwesome name="bookmark" size={24} color="#FA8532" /> :
          <FontAwesome name="bookmark-o" size={24} color="#FA8532" />
        }
      </TouchableOpacity>
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E7E7E9',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 30,
  },
  textContainer: {
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9E785E',
  },
  description: {
    width: '55%',
    fontSize: 13,
  },
  category: {
    marginTop: 10,
    fontSize: 12,
    color: '#A0A0A0',
  },
  bookmark: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
});

export default Card
