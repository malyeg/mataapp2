import React, {useCallback, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import CarouselBase, {
  CarouselProperties,
  CarouselProps as CarouselBaseProps,
  Pagination,
} from 'react-native-snap-carousel';
import {ImageSource} from '../../api/itemsApi';
import theme from '../../styles/theme';
import {Image} from '../core';

type RenderItemType = CarouselProperties<ImageSource>['renderItem'];

interface CarouselProps
  extends Omit<CarouselBaseProps<ImageSource>, 'renderItem' | 'data'> {
  images: ImageSource[];
  layout?: CarouselProperties<ImageSource>['layout'];
  // renderItem?: ListRenderItem<ImageSource>;
  renderItem?: CarouselBaseProps<ImageSource>['renderItem'];
}

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth - theme.defaults.SCREEN_PADDING * 4;
// const itemWidth = 100;
const itemHeight = itemWidth;

const Carousel = ({images, layout = 'default', renderItem}: CarouselProps) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const renderItemHandler: any = useCallback(
    (itemInfo: {item: ImageSource; index: number}) => {
      if (renderItem) {
        return renderItem(itemInfo);
      }

      return (
        <Image
          uri={itemInfo.item.downloadURL!}
          style={styles.image}
          resizeMode="cover"
        />
      );
    },
    [renderItem],
  );

  const onSnapToItem = useCallback(
    (index: number) => setActiveSlide(index),
    [],
  );

  return (
    <View style={styles.container}>
      <CarouselBase
        layout={layout}
        data={images}
        sliderWidth={itemWidth}
        itemWidth={itemWidth}
        sliderHeight={itemHeight}
        itemHeight={itemHeight}
        renderItem={renderItemHandler}
        onSnapToItem={onSnapToItem}
        slideStyle={styles.slideWrapper}
      />
      {!!images && images.length > 0 && (
        <Pagination
          dotsLength={images.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.PaginationContainer}
          dotStyle={styles.paginationActiveDot}
          inactiveDotStyle={styles.paginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      )}
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: 100,
    // backgroundColor: 'red',
  },
  slideWrapper: {
    // height: itemHeight,
  },
  image: {
    borderRadius: 20,
  },
  PaginationContainer: {
    // backgroundColor: 'rgba(0, 0, 0, 0.75)'
    // backgroundColor: 'red',
    // height: 50,
    padding: 0,
    marginVertical: -20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // marginHorizontal: 8,
    backgroundColor: theme.colors.grey,
  },
  paginationActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // marginHorizontal: 8,
    backgroundColor: theme.colors.green,
  },
});
