import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { theme } from './colors.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setTodos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToDos();
  }, []);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload)
  const saveToDos = async (toSave) => {
    try {
      const jsonValue = JSON.stringify(toSave)
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
    } catch (error) {
      console.log(error)
    }
  }
  const loadToDos = async () => {
    try {
      const loadedToDos = await AsyncStorage.getItem(STORAGE_KEY)
      if(loadedToDos) {
        setTodos(JSON.parse(loadedToDos))
      }
      setLoading(false)

    } catch (error) {
      console.log("now error is occured in loadToDos")
      console.log(error)
    }
  }
  const addToDo = async () => {
    if(text === "") {
      return
    }
    const newToDos = {...toDos, [Date.now()]: {working, text}}
    setTodos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteTodo = async (id) => {
    Alert.alert(
      "Delete To Do",
      "Are you sure?",
      [
        {text: "Cancel"},
        {
          text: "Yes",
          onPress: () => {
            const newToDos = {...toDos}
            delete newToDos[id]
            setTodos(newToDos);
            saveToDos(newToDos);
          },
          style: "destructive"
        },
      ]
    )
    return;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.button, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.button, color: working ? theme.grey : "white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          value={text}
          returnKeyType="done"
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.textInput}
        />
      </View>
      {
        loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <ScrollView>
            {Object.keys(toDos).map((key) =>
              toDos[key].working === working ? (
                <View style={styles.toDo} key={key}>
                  <Text style={styles.toDoText}>{toDos[key].text}</Text>
                  <TouchableOpacity onPress={() => deleteTodo(key)}>
                    <Text><Fontisto name="trash" size={24} color="white" /></Text> 
                  </TouchableOpacity>
                </View>
              ) : null
            )}
          </ScrollView>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: 'row',
    marginTop: 100,
  },
  button: {
    fontSize: 38,
    fontWeight: 600,
  },
  textInput: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 18,
    fontWeight: 500
  }
});
