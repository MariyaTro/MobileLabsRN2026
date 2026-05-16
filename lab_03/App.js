import 'react-native-gesture-handler';

import React, { useRef, useState } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const lightTheme = {
  background: '#f3f4f6',
  card: '#ffffff',
  text: '#111827',
  primary: '#2563eb',
  secondary: '#6b7280',
};

const darkTheme = {
  background: '#111827',
  card: '#1f2937',
  text: '#ffffff',
  primary: '#60a5fa',
  secondary: '#d1d5db',
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  const [score, setScore] = useState(0);

  const [stats, setStats] = useState({
    taps: 0,
    doubleTaps: 0,
    longPress: false,
    pan: false,
    flingRight: false,
    flingLeft: false,
    pinch: false,
  });

  const addScore = (value) => {
    setScore((prev) => prev + value);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.primary },
            headerTintColor: '#fff',
          }}
        >
          <Stack.Screen name="Гра">
            {(props) => (
              <GameScreen
                {...props}
                theme={theme}
                score={score}
                setScore={setScore}
                addScore={addScore}
                stats={stats}
                setStats={setStats}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Завдання">
            {(props) => (
              <TasksScreen
                {...props}
                theme={theme}
                score={score}
                stats={stats}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Налаштування">
            {(props) => (
              <SettingsScreen
                {...props}
                theme={theme}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function GameScreen({
  navigation,
  theme,
  score,
  setScore,
  addScore,
  setStats,
}) {
  const doubleTapRef = useRef(null);

  const translate = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(1);
      setStats((prev) => ({
        ...prev,
        taps: prev.taps + 1,
      }));
    }
  };

  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(2);
      setStats((prev) => ({
        ...prev,
        doubleTaps: prev.doubleTaps + 1,
      }));
    }
  };

  const onLongPress = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(15);
      setStats((prev) => ({
        ...prev,
        longPress: true,
      }));
    }
  };

  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translate.x,
          translationY: translate.y,
        },
      },
    ],
    { useNativeDriver: false }
  );

  const onPanStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      translate.extractOffset();
      addScore(5);
      setStats((prev) => ({
        ...prev,
        pan: true,
      }));
    }
  };

  const onFlingRight = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const randomScore = Math.floor(Math.random() * 20) + 5;
      addScore(randomScore);
      setStats((prev) => ({
        ...prev,
        flingRight: true,
      }));
    }
  };

  const onFlingLeft = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const randomScore = Math.floor(Math.random() * 20) + 5;
      addScore(randomScore);
      setStats((prev) => ({
        ...prev,
        flingLeft: true,
      }));
    }
  };

  const onPinch = (event) => {
    scale.setValue(event.nativeEvent.scale);
  };

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      addScore(10);
      setStats((prev) => ({
        ...prev,
        pinch: true,
      }));

      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    }
  };

  const resetGame = () => {
    setScore(0);
    setStats({
      taps: 0,
      doubleTaps: 0,
      longPress: false,
      pan: false,
      flingRight: false,
      flingLeft: false,
      pinch: false,
    });

    translate.setValue({ x: 0, y: 0 });
    translate.setOffset({ x: 0, y: 0 });
    scale.setValue(1);
  };

  return (
    <Screen theme={theme}>
      <Title theme={theme}>Гра-клікер</Title>

      <Score theme={theme}>Бали: {score}</Score>

      <Hint theme={theme}>
        Натискай, утримуй, перетягуй, свайпай або змінюй розмір об’єкта
      </Hint>

      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={onFlingRight}
      >
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={onFlingLeft}
        >
          <PinchGestureHandler
            onGestureEvent={onPinch}
            onHandlerStateChange={onPinchStateChange}
          >
            <PanGestureHandler
              onGestureEvent={onPanGestureEvent}
              onHandlerStateChange={onPanStateChange}
            >
              <LongPressGestureHandler
                minDurationMs={3000}
                onHandlerStateChange={onLongPress}
              >
                <TapGestureHandler
                  ref={doubleTapRef}
                  numberOfTaps={2}
                  onHandlerStateChange={onDoubleTap}
                >
                  <TapGestureHandler
                    waitFor={doubleTapRef}
                    onHandlerStateChange={onSingleTap}
                  >
                    <Animated.View
                      style={[
                        styles.clickObject,
                        {
                          backgroundColor: theme.primary,
                          transform: [
                            { translateX: translate.x },
                            { translateY: translate.y },
                            { scale },
                          ],
                        },
                      ]}
                    >
                      <Text style={styles.objectText}>CLICK</Text>
                    </Animated.View>
                  </TapGestureHandler>
                </TapGestureHandler>
              </LongPressGestureHandler>
            </PanGestureHandler>
          </PinchGestureHandler>
        </FlingGestureHandler>
      </FlingGestureHandler>

      <Button onPress={() => navigation.navigate('Завдання')} theme={theme}>
        <ButtonText>Переглянути завдання</ButtonText>
      </Button>

      <Button onPress={() => navigation.navigate('Налаштування')} theme={theme}>
        <ButtonText>Налаштування</ButtonText>
      </Button>

      <ResetButton onPress={resetGame}>
        <ButtonText>Скинути гру</ButtonText>
      </ResetButton>
    </Screen>
  );
}

function TasksScreen({ theme, score, stats }) {
  const tasks = [
    {
      title: 'Зробити 10 кліків',
      done: stats.taps >= 10,
    },
    {
      title: 'Зробити подвійний клік 5 разів',
      done: stats.doubleTaps >= 5,
    },
    {
      title: 'Утримувати об’єкт 3 секунди',
      done: stats.longPress,
    },
    {
      title: 'Перетягнути об’єкт',
      done: stats.pan,
    },
    {
      title: 'Зробити свайп вправо',
      done: stats.flingRight,
    },
    {
      title: 'Зробити свайп вліво',
      done: stats.flingLeft,
    },
    {
      title: 'Змінити розмір об’єкта',
      done: stats.pinch,
    },
    {
      title: 'Отримати 100 балів',
      done: score >= 100,
    },
    {
      title: 'Власне завдання: отримати 200 балів',
      done: score >= 200,
    },
  ];

  return (
    <Screen theme={theme}>
      <Title theme={theme}>Список завдань</Title>

      {tasks.map((task, index) => (
        <TaskCard key={index} theme={theme}>
          <TaskText theme={theme}>{task.title}</TaskText>
          <Status done={task.done}>
            {task.done ? 'Виконано' : 'Не виконано'}
          </Status>
        </TaskCard>
      ))}
    </Screen>
  );
}

function SettingsScreen({ theme, darkMode, setDarkMode }) {
  return (
    <Screen theme={theme}>
      <Title theme={theme}>Налаштування</Title>

      <TaskCard theme={theme}>
        <TaskText theme={theme}>Поточна тема:</TaskText>
        <Status done>{darkMode ? 'Темна' : 'Світла'}</Status>
      </TaskCard>

      <Button onPress={() => setDarkMode(!darkMode)} theme={theme}>
        <ButtonText>
          {darkMode ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
        </ButtonText>
      </Button>
    </Screen>
  );
}

const Screen = styled.ScrollView`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: ${(props) => props.theme.text};
  margin-bottom: 20px;
`;

const Score = styled.Text`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: ${(props) => props.theme.primary};
  margin-bottom: 12px;
`;

const Hint = styled.Text`
  font-size: 15px;
  text-align: center;
  color: ${(props) => props.theme.secondary};
  margin-bottom: 30px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.primary};
  padding: 14px;
  border-radius: 12px;
  margin-top: 15px;
`;

const ResetButton = styled.TouchableOpacity`
  background-color: #ef4444;
  padding: 14px;
  border-radius: 12px;
  margin-top: 15px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const TaskCard = styled.View`
  background-color: ${(props) => props.theme.card};
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 12px;
`;

const TaskText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.text};
  margin-bottom: 8px;
`;

const Status = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.done ? '#22c55e' : '#ef4444')};
`;

const styles = StyleSheet.create({
  clickObject: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    elevation: 8,
  },

  objectText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});