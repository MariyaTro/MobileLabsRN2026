import 'react-native-gesture-handler';

import * as React from 'react';
import { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
  Image,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function generateNews(count, start = 0) {
  return Array.from({ length: count }, (_, index) => ({
    id: String(start + index + 1),
    title: `Новина ${start + index + 1}`,
    description:
    image: `https://picsum.photos/300/200?random=${start + index + 1}`,
  }));
}

function MainScreen({ navigation }) {
  const [news, setNews] = useState(generateNews(15));
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setNews(generateNews(15));
      setRefreshing(false);
    }, 1500);
  };

  const loadMoreNews = () => {
    if (loadingMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const moreNews = generateNews(8, news.length);
      setNews((prevNews) => [...prevNews, ...moreNews]);
      setLoadingMore(false);
    }, 1000);
  };

  const renderNewsItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.newsCard}
        onPress={() => navigation.navigate('DetailsScreen', { news: item })}
      >
        <Image source={{ uri: item.image }} style={styles.newsImage} />

        <View style={styles.newsContent}>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreNews}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.mainTitle}>Список новин</Text>
            <Text style={styles.subtitle}>
              FlatList, Pull-to-Refresh та Infinite Scroll
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.listFooter}>
            <Text style={styles.footerText}>
              {loadingMore ? 'Завантаження новин...' : 'Кінець списку'}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </SafeAreaView>
  );
}

function DetailsScreen({ route }) {
  const { news } = route.params;

  return (
    <View style={styles.detailsContainer}>
      <Image source={{ uri: news.image }} style={styles.detailsImage} />

      <Text style={styles.detailsTitle}>{news.title}</Text>

      <Text style={styles.detailsDescription}>{news.description}</Text>

      <Text style={styles.detailsText}>
        На цьому екрані відображається детальна інформація про обрану новину.
        Дані передані з головного екрана через параметри навігації.
      </Text>

      <Text style={styles.detailsId}>ID новини: {news.id}</Text>
    </View>
  );
}

function NewsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainScreen" component={MainScreen} />

      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={({ route }) => ({
          title: route.params.news.title,
        })}
      />
    </Stack.Navigator>
  );
}

function ContactsScreen() {
  const sections = [
    {
      title: 'Викладачі',
      data: [
        {
          id: '1',
          name: 'Іваненко Іван Іванович',
          phone: '+380 67 111 11 11',
        },
        {
          id: '2',
          name: 'Петренко Петро Петрович',
          phone: '+380 67 222 22 22',
        },
        {
          id: '3',
          name: 'Сидоренко Олена Василівна',
          phone: '+380 67 333 33 33',
        },
      ],
    },
    {
      title: 'Студенти',
      data: [
        {
          id: '4',
          name: 'Трофімова Марія',
          phone: '+380 67 444 44 44',
        },
        {
          id: '5',
          name: 'Коваленко Андрій',
          phone: '+380 67 555 55 55',
        },
        {
          id: '6',
          name: 'Мельник Оксана',
          phone: '+380 67 666 66 66',
        },
      ],
    },
    {
      title: 'Адміністрація',
      data: [
        {
          id: '7',
          name: 'Деканат факультету',
          phone: '+380 67 777 77 77',
        },
        {
          id: '8',
          name: 'Кафедра комп’ютерних наук',
          phone: '+380 67 888 88 88',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.mainTitle}>Контакти</Text>
            <Text style={styles.subtitle}>SectionList з групуванням даних</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={{
            uri: 'https://picsum.photos/120/120',
          }}
          style={styles.avatar}
        />

        <Text style={styles.drawerName}>Trofimova Mariya</Text>
        <Text style={styles.drawerFullName}>
          Trofimova Mariya Oleksandrivna
        </Text>
        <Text style={styles.drawerGroup}>Група: ZIPZ-22-1</Text>
      </View>

      <DrawerItem
        label="Новини"
        onPress={() => props.navigation.navigate('News')}
      />

      <DrawerItem
        label="Контакти"
        onPress={() => props.navigation.navigate('Contacts')}
      />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#ffffff',
            width: 260,
          },
          headerStyle: {
            backgroundColor: '#1d4ed8',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen
          name="News"
          component={NewsStackNavigator}
          options={{
            title: 'Новини',
            headerShown: true,
          }}
        />

        <Drawer.Screen
          name="Contacts"
          component={ContactsScreen}
          options={{
            title: 'Контакти',
            headerShown: true,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  listHeader: {
    padding: 20,
    backgroundColor: '#ffffff',
  },

  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 6,
  },

  newsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  newsImage: {
    width: 95,
    height: 75,
    borderRadius: 10,
    marginRight: 12,
  },

  newsContent: {
    flex: 1,
  },

  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },

  newsDescription: {
    fontSize: 14,
    color: '#4b5563',
  },

  separator: {
    height: 10,
  },

  listFooter: {
    padding: 20,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },

  detailsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },

  detailsImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },

  detailsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
  },

  detailsDescription: {
    fontSize: 17,
    color: '#374151',
    marginTop: 10,
  },

  detailsText: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 15,
    lineHeight: 22,
  },

  detailsId: {
    marginTop: 20,
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },

  contactItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 15,
    borderRadius: 10,
  },

  contactName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },

  contactPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  sectionHeader: {
    backgroundColor: '#dbeafe',
    color: '#1e3a8a',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 10,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },

  drawerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },

  drawerFullName: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 4,
  },

  drawerGroup: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '600',
    marginTop: 6,
  },
});