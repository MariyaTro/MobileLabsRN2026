import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

function Header() {
  return (
    <View>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://osvita.ua/doc/images/guide/2/230/zhp-230_i.png',
          }}
          style={styles.logoImage}
        />

        <Text style={styles.appName}>FirstMobileApp</Text>
      </View>
    </View>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View>
      <Header />

      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          let iconName = 'home';

          if (route.name === 'Фотогалерея') {
            iconName = 'image';
          }

          if (route.name === 'Профіль') {
            iconName = 'person';
          }

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? '#0d83ff' : '#999'}
              />

              <Text
                style={[
                  styles.tabText,
                  { color: isFocused ? '#0d83ff' : '#777' },
                ]}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function HomeScreen() {
  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>Новини</Text>

      {[1, 2, 3, 4, 5, 6, 7].map((item) => (
        <View key={item} style={styles.card}>
          <Image
            source={{
              uri: 'https://www.smile2013.com.ua/wp-content/uploads/2021/12/%D0%91%D0%B5%D0%B7-%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8-1-5.png',
            }}
            style={styles.newsImage}
          />

          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>Заголовок новини</Text>
            <Text style={styles.date}>Дата новини</Text>
            <Text style={styles.text}>Короткий текст новини</Text>
          </View>
        </View>
      ))}

      <Text style={styles.footer}>
        Trofimova Mariya Oleksandrivna, ZIPZ-22-1
      </Text>
    </ScrollView>
  );
}

function GalleryScreen() {
  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>Фотогалерея</Text>

      <View style={styles.gallery}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Image
            key={item}
            source={{
              uri: 'https://lh3.googleusercontent.com/p/AF1QipPHHa3jAtmjRjavlVYxrp8hMSqyeYlwYo7LGtp8=s680-w680-h510-rw',
            }}
            style={styles.image}
          />
        ))}
      </View>

      <Text style={styles.footer}>
        Trofimova Mariya Oleksandrivna, ZIPZ-22-1
      </Text>
    </ScrollView>
  );
}

function ProfileScreen() {
  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>Реєстрація</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Електронна пошта</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Пароль</Text>
        <TextInput style={styles.input} secureTextEntry />

        <Text style={styles.label}>Пароль (ще раз)</Text>
        <TextInput style={styles.input} secureTextEntry />

        <Text style={styles.label}>Прізвище</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Ім’я</Text>
        <TextInput style={styles.input} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Зареєструватися</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Trofimova Mariya Oleksandrivna, ZIPZ-22-1
      </Text>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen name="Головна" component={HomeScreen} />
        <Tab.Screen name="Фотогалерея" component={GalleryScreen} />
        <Tab.Screen name="Профіль" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    backgroundColor: '#fff',
    paddingTop: 45,
    paddingBottom: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logoImage: {
    width: 95,
    height: 45,
    resizeMode: 'contain',
  },

  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
  },

  tabItem: {
    alignItems: 'center',
    width: '33%',
  },

  tabText: {
    fontSize: 12,
    marginTop: 2,
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 25,
    color: '#222',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 35,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  newsImage: {
    width: 60,
    height: 60,
    marginRight: 15,
  },

  newsContent: {
    flex: 1,
  },

  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  date: {
    color: 'gray',
    fontSize: 14,
  },

  text: {
    fontSize: 14,
    color: '#333',
  },

  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  image: {
    width: 140,
    height: 140,
    margin: 8,
    borderRadius: 8,
  },

  form: {
    marginHorizontal: 35,
  },

  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },

  button: {
    backgroundColor: '#0d83ff',
    marginTop: 25,
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  footer: {
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 15,
    color: '#444',
    fontStyle: 'italic',
    fontSize: 13,
  },
});