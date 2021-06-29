import React from 'react';
import {ActivityIndicator, View, ViewProps} from 'react-native';
import create from '../../styles/EStyleSheet';
import theme from '../../styles/theme';

const Loader = (props: ViewProps) => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.white} />
      </View>
    </View>
  );
};

const styles = create({
  container: {
    // flex: 1,
    // height: '100%',
    flex: 1,
    // backgroundColor: 'rgba(255,255,255, 0.1)',
    backgroundColor: theme.colors.white,
    // backgroundColor: theme.colors.white,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    backgroundColor: 'rgba(52, 52, 52, 0.9)', // TODO replace with theme
    justifyContent: 'center',
    width: 80,
    height: 60,
    borderRadius: 10,
    marginBottom: 70,
  },
});

export default React.memo(Loader);
