import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const quotes = [
  { quote: "The only bad workout is the one that didn’t happen.", author: "John Raphson" },
  { quote: "The difference between the impossible and the possible lies in a person’s determination.", author: "Tommy Lasorda" },
  { quote: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { quote: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
  { quote: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { quote: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
];
const TIME_DELAY_SEC = 5;

const QuoteCarousel = () => {
  const flatListRef = useRef<FlatList|null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % quotes.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, TIME_DELAY_SEC*1000); // Change quote every TIME_DELAY seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <FlatList
      ref={flatListRef}
      data={quotes}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 20 }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.quote}>{`"${item.quote}"`}</Text>
          <Text style={styles.author}>{`- ${item.author}`}</Text>
        </View>
      )}
      onScrollToIndexFailed={() => {}}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quote: {
    fontSize: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  author: {
    fontSize: 16,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
});

export default QuoteCarousel;
