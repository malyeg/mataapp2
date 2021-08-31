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
import Card from '../core/Card';
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
  resizeMode = 'contain',
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
    <Card style={[styles.container, style]}>
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
          dotContainerStyle={styles.dotContainer}
          dotStyle={styles.paginationActiveDot}
          inactiveDotStyle={styles.paginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      )}
    </Card>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    // padding: 5,
  },
  dotContainer: {
    // backgroundColor: 'grey',
    // margin: 0,
    // padding: 0,
  },
  slideWrapper: {
    // height: itemHeight,
  },
  image: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  PaginationContainer: {
    padding: 0,
    marginTop: -20,
    marginBottom: -30,
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
    backgroundColor: theme.colors.green,
  },
});
