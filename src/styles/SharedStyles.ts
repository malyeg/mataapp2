import {Platform, StyleSheet} from 'react-native';
import theme from './theme';

const sharedStyles = StyleSheet.create({
  card: {
    // borderColor: theme.colors.lightGrey,
    // borderWidth: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    marginVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: {
        borderColor: theme.colors.lightGrey,
        // borderWidth: 2,
        // paddingBottom: 10,
      },
      android: {
        shadowColor: theme.colors.grey,
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.3,
        elevation: 3,
      },
    }),
  },
  redBox: {
    borderColor: 'red',
    borderWidth: 1,
  },
  blueBox: {
    borderColor: 'blue',
    borderWidth: 1,
  },
  yellowBox: {
    borderColor: 'yellow',
    borderWidth: 1,
  },
  greenBtn: {
    backgroundColor: theme.colors.green,
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default sharedStyles;
