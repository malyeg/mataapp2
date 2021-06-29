import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Entity} from '../../types/DataTypes';

const SEPARATOR = '=>';
interface BreadcrumbProps {
  path: Entity[];
}
const Breadcrumb = ({path}: BreadcrumbProps) => {
  return (
    <View style={styles.container}>
      {path.map((i, index) => (
        <Text key={index}>
          {i.name} {index < path.length - 1 ? SEPARATOR : ''}
        </Text>
      ))}
    </View>
  );
};

export default Breadcrumb;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
