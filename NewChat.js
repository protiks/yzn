import React, { useState, useEffect, useRef } from 'react';
import { FlatList, View, Button, StyleSheet, TextInput, Text } from 'react-native';
import { onSnapshot, serverTimestamp, addDoc, getFirestore, getDocs, startAfter, query, collection, orderBy, limit } from 'firebase/firestore'
import { app } from './firebase';

export default function NewChat(props) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sortedData, setSortedData] = useState([])
  const [lastDoc, setLastDoc] = useState(null);
  const [data, setData] = useState([]);
  const flatListRef = useRef();
  const db = getFirestore(app);
  const { name } = props

  useEffect(() => {

    if (data) {
      const arr = [...data].sort((a, b) => a.timestamp - b.timestamp)
      setSortedData(arr)
    }

  }, [data])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'chat'),
        orderBy('timestamp', 'desc'),
        limit(5)
      ),
      (querySnapshot) => {

        const messagesFirestore = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            id: doc.id,
            ...firebaseData,
            timestamp: firebaseData.timestamp ? firebaseData.timestamp.toDate().getTime() : null,
          };
          return data;
        });
        setData(messagesFirestore.reverse());
      }
    );

    return () => unsubscribe();
  }, [db]);

  const loadMoreMessages = async () => {
    if (isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);

    let querySnapshot;

    if (lastDoc) {
      querySnapshot = await getDocs(
        query(
          collection(db, 'chat'),
          orderBy('timestamp', 'desc'),
          startAfter(lastDoc),
          limit(1)
        )
      );
    } else {
      querySnapshot = await getDocs(
        query(
          collection(db, 'chat'),
          orderBy('timestamp', 'desc'),
          limit(1)
        )
      );
    }

    const newMessages = querySnapshot.docs.map((doc) => {
      const firebaseData = doc.data();
      const data = {
        id: doc.id,
        ...firebaseData,
        timestamp: firebaseData.timestamp ? firebaseData.timestamp.toDate().getTime() : null,
      };
      return data;
    });

    if (querySnapshot.docs.length > 0) {
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }
    setData((prevMessages) => [...prevMessages, ...newMessages.reverse()]);

    setIsLoadingMore(false);
  };

  const handleSend = async () => {
    if (newMessage !== '') {
      try {
        await addDoc(collection(db, 'chat'), {
          name: name,
          message: newMessage,
          timestamp: serverTimestamp(),
        });
        setNewMessage('');
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  useEffect(() => {
    loadMoreMessages();
  }, []);

  const handleScroll = (event) => {
    const scrollPositionY = event.nativeEvent.contentOffset.y;
    if (scrollPositionY < -90) {
      loadMoreMessages()
      console.log('Top of scroll view pulled down and snapped back');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  }

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View style={styles.chatContainer}>
          <View style={styles.chatContent}>
            {sortedData ? (
              <FlatList
                ref={flatListRef}
                data={sortedData}
                keyExtractor={(item, index) => index.toString()}
                onScroll={handleScroll}
                onScrollEventThrottle={16}
                renderItem={({ item }) => (
                  <View style={styles.message}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{item.name[0]}</Text>
                    </View>
                    <View style={styles.messageContent}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.messageText}>{item.message}</Text>
                      <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                    </View>
                  </View>
                )}
              />
            )
              : (null)}

          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setNewMessage}
            value={newMessage}
            placeholder="Type your message"
            onSubmitEditing={handleSend}
            blurOnSubmit={true}
            returnKeyType="send"
          />
          <Button onPress={handleSend} title="Send" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  footer: {
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  message: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'flex-end',
    maxWidth: '60%',
    backgroundColor: '#0f8bfe',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start', 
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 4,
  },
  timestamp: {
    color: '#fff',
    fontSize: 12,
    alignSelf: 'flex-end',
    opacity: 0.6,
  },
});