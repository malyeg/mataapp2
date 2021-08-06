import React, {useState} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Text} from '../core';

interface TextDescriptionProps extends TextProps {
  maxLines?: number;
  children: any;
  textStyle?: StyleProp<TextStyle>;
}
const TextDescription = ({
  children,
  maxLines = 2,
  textStyle,
}: TextDescriptionProps) => {
  const [showAll, setShowAll] = useState(false);
  const [numLines, setNumLines] = useState(maxLines);

  const toggleViewMore = () => {
    setShowAll(v => !v);
  };
  const onTextLayout = e => {
    if (e.nativeEvent.lines.length > maxLines) {
      setNumLines(e.lines);
    }
  };

  // const numberOfLines = showAll ? maxLines : minLines;
  const showLinks = numLines > maxLines;

  return (
    <Pressable style={styles.container}>
      <Text onTextLayout={onTextLayout} numberOfLines={5} style={textStyle}>
        {children}
      </Text>
      {/* {!showAll ? (
        <Text style={styles.moreText} onPress={() => setShowAll(true)}>
          view more
        </Text>
      ) : (
        <Text style={styles.moreText} onPress={() => setShowAll(false)}>
          view less
        </Text>
      )} */}
    </Pressable>
  );
};

export default TextDescription;

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
  },
  moreText: {
    color: 'red',
    // backgroundColor: 'grey',
  },
});
