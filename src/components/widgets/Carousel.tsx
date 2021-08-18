import React, {useCallback, useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Dimensions, StyleSheet, View} from 'react-native';
import CarouselBase, {
  CarouselProperties,
  CarouselProps as CarouselBaseProps,
  Pagination,
} from 'react-native-snap-carousel';
import {ImageSource} from '../../api/itemsApi';
import theme from '../../styles/theme';
import {Image} from '../core';
import {ImageProps} from '../core/Image';

interface CarouselProps
  extends Omit<CarouselBaseProps<ImageSource>, 'renderItem' | 'data'> {
  images: ImageSource[];
  layout?: CarouselProperties<ImageSource>['layout'];
  renderItem?: CarouselBaseProps<ImageSource>['renderItem'];
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageProps['resizeMode'];
  viewImageInFullScreen?: boolean;
}

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth - theme.defaults.SCREEN_PADDING * 4;
// const itemWidth = 100;
const itemHeight = itemWidth;

const Carousel = ({
  images,
  layout = 'default',
  style,
  resizeMode = 'cover',
  renderItem,
  viewImageInFullScreen = false,
}: CarouselProps) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const renderItemHandler: any = useCallback(
    (itemInfo: {item: ImageSource; index: number}) => {
      if (renderItem) {
        return renderItem(itemInfo);
      } else {
        return (
          <Image
            uri={itemInfo.item.downloadURL!}
            style={styles.image}
            resizeMode={resizeMode}
            onPressViewInFullScreen={viewImageInFullScreen}
          />
        );
      }
    },
    [renderItem, resizeMode, viewImageInFullScreen],
  );

  const onSnapToItem = useCallback(
    (index: number) => setActiveSlide(index),
    [],
  );

  return (
    <View style={[styles.container, style]}>
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
    borderRadius: 10,
    backgroundColor: theme.colors.lightGrey,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
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
