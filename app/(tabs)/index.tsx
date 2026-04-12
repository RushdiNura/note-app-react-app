import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
// headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}

export default function HomeScreen() {
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dark, setDark] = useState(true);

  useEffect(() => {
    loadNotes();
    loadTheme();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    AsyncStorage.setItem("theme", JSON.stringify(dark));
  }, [dark]);

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem("notes");
      if (data !== null) {
        setNotes(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const loadTheme = async () => {
    try {
      const t = await AsyncStorage.getItem("theme");
      if (t !== null) setDark(JSON.parse(t));
    } catch (error) {
      console.error("Error loading themes:", error);
    }
  };

  function handleAddNotes() {
    if (!input.trim()) return;
    setNotes((prev) => [...prev, { id: Date.now().toString(), text: input }]);
    setInput("");
  }

  function startEdit(todo) {
    setEditId(todo.id);
    setEditText(todo.text);
  }

  function saveEdit() {
    setNotes((p) =>
      p.map((t) => (t.id === editId ? { ...t, text: editText } : t)),
    );
    setEditId(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditId(null);
    setEditText("");
  }

  function deleteTodo(id) {
    setNotes((p) => p.filter((t) => t.id !== id));
  }

  const bg = dark ? "#121212" : "#F5F5F5";
  const text = dark ? "white" : "#121212";

  function renderItem({ item }) {
    return (
      <Swipeable
        renderRightActions={() => (
          <Pressable
            style={styles.swipeDelete}
            onPress={() => deleteTodo(item.id)}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
          </Pressable>
        )}
      >
        <View
          style={[
            styles.todoItem,
            { backgroundColor: dark ? "#1E1E1E" : "#FFF" },
          ]}
        >
          {editId === item.id ? (
            <>
              {" "}
              
                <TextInput
                  style={[styles.editInput, { color: text }]}
                  value={editText}
                  onChangeText={setEditText}
                  autoFocus
                />
                <Ionicons
                  name="checkmark"
                  size={24}
                  color="green"
                  onPress={saveEdit}
                />
                <Ionicons
                  name="close"
                  size={24}
                  color="red"
                  onPress={cancelEdit}
                />
          
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.todoText,
                  {
                    color: text,
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                    opacity: item.completed ? 0.5 : 1,
                  },
                ]}
              >
                {item.text}
              </Text>

              <Ionicons
                name="create-outline"
                size={22}
                color={text}
                onPress={() => startEdit(item)}
              />
            </>
          )}
        </View>
      </Swipeable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.cont}>
        <Text style={[styles.title, { color: text }]}>Put Your Notes Here</Text>
        <Pressable onPress={() => setDark((p) => !p)}>
          <Ionicons
            name={dark ? "sunny-outline" : "moon-outline"}
            size={26}
            color={text}
          />
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="What Do You Have In Mind, Buddy?"
          style={[styles.input, { color: text, borderColor: text }]}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAddNotes}
        />
        <Pressable style={styles.addBtn} onPress={handleAddNotes}>
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>

      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  cont:{
    flexDirection: "row",
    justifyContent:"space-between",
    padding:5
  },
  title: {
    color: "#14313aff",
    fontSize: 24,
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  inputContainer: {
    flexDirection: "row",
    width: "90%",
    gap: 10,
  },
  todoText: { flex: 1, fontSize: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical:10
  },
  addBtn: {
    backgroundColor: "dodgerblue",
    borderRadius: 8,
    padding: 10,
    marginVertical:10
  },
  editInput: {
    flex: 1,
    borderBottomWidth: 1,
    marginRight: 10,
  },
  swipeDelete: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    // width: 70,
  },
});

// inputRow: { flexDirection: "row", gap: 10 },
// input: {
//   flex: 1,
//   borderWidth: 1,
//   borderRadius: 8,
//   padding: 10,
// },
// addBtn: {
//   backgroundColor: "dodgerblue",
//   borderRadius: 8,
//   padding: 10,
// },
