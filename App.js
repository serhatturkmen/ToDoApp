import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AppLoading from "expo-app-loading";
import uuid from "react-native-uuid";

import { getStatusBarHeight } from "react-native-status-bar-height";

export default function App() {
  var [todos, setTodos] = React.useState([]);
  var [loading, setLoading] = React.useState(true);
  var [input, setInput] = React.useState("");

  const ToDoComponent = (route) => {
    var data = route.todo;
    return (
      <View
        key={data.key}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: "5%",
          marginVertical: 5,
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={styles.todomain}
          onPress={() => {
            handleEditToDo({
              id: data.id,
              content: data.content,
              completed: data.completed ? false : true,
            });
          }}
        >
          <Text
            style={
              data.completed ? styles.todocompleted : styles.todoNotCompleted
            }
          >
            {data.content}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 5,
            backgroundColor: "red",
            alignSelf: "center",
            borderRadius: 10,
          }}
          onPress={() => {
            handleDeleteToDo(data.id);
          }}
        >
          <Text>Sil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleClearToDos = () => {
    AsyncStorage.removeItem("todos")
      .then(() => {
        setTodos([]);
      })
      .catch((error) => console.log(error));
  };
  const loadToDos = () => {
    AsyncStorage.getItem("todos")
      .then((data) => {
        if (data !== null) {
          setTodos(JSON.parse(data));
        }
      })
      .catch((error) => console.log(error));
  };
  const handleAddToDo = () => {
    if (input.length !== 0) {
      const newtodos = [
        ...todos,
        {
          id: uuid.v4(),
          content: input,
          completed: false,
        },
      ];
      AsyncStorage.setItem("todos", JSON.stringify(newtodos))
        .then(() => {
          setTodos(newtodos);
          setLoading(true);
        })
        .catch((error) => console.log(error));
      setInput("");
    } else {
      alert("Veri girişi boş geçilemez...");
    }
  };

  const handleEditToDo = (editedtodo) => {
    const newtodos = [...todos];
    const todoIndex = todos.findIndex((todo) => todo.id === editedtodo.id);
    newtodos.splice(todoIndex, 1, editedtodo);

    AsyncStorage.setItem("todos", JSON.stringify(newtodos))
      .then(() => {
        setTodos(newtodos);
        loadToDos();
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteToDo = (todoid) => {
    const newtodos = [...todos];
    const todoIndex = todos.findIndex((todo) => todo.id === todoid);
    newtodos.splice(todoIndex, 1);

    AsyncStorage.setItem("todos", JSON.stringify(newtodos))
      .then(() => {
        setTodos(newtodos);
        loadToDos();
      })
      .catch((error) => console.log(error));
  };

  if (loading) {
    return (
      <AppLoading
        startAsync={loadToDos}
        onFinish={() => setLoading(false)}
        onError={console.warn}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>TODO APP</Text>
          <TouchableOpacity
            onPress={() => handleClearToDos()}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Hepsini Sil</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.todoflatlist}
          data={todos}
          renderItem={({ item, key }) => {
            return <ToDoComponent key={key} todo={item} />;
          }}
        />
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: "10%",
            width: "100%",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <TextInput
            placeholder={"Write to todo..."}
            style={styles.todoInput}
            placeholderTextColor={"#CCCCCC"}
            onChangeText={(text) => {
              setInput(text);
            }}
            value={input}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={async () => {
              handleAddToDo();
            }}
          >
            <Text style={styles.headerText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#332323",
    alignItems: "center",
    justifyContent: "center",
    marginTop: getStatusBarHeight(),
  },
  todomain: {
    padding: 10,

    backgroundColor: "#4F3737",
    borderRadius: 10,
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#4F3737",
    width: "100%",
    alignItems: "center",
    height: "10%",
    marginBottom: 0,
    paddingHorizontal: 20,
    alignContent: "center",
  },
  headerText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  headerButton: {
    backgroundColor: "#332323",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  headerButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  todoflatlist: {
    height: "90%",
    width: "100%",
  },
  todoNotCompleted: { fontSize: 24, color: "#FFFFFF" },
  todocompleted: {
    fontSize: 24,
    color: "#888888",
    textDecorationLine: "line-through",
  },
  addButton: {
    backgroundColor: "#4E3636",
    alignItems: "center",
    width: "10%",
    padding: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  todoInput: {
    paddingStart: 15,
    backgroundColor: "#4F3737",
    width: "80%",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    color: "#FFFFFF",
  },
});
