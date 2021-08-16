# Mata

## Setup

### configure splash screen: 
<https://github.com/crazycodeboy/react-native-splash-screen>
https://www.youtube.com/watch?v=PlubOKfi46o
### location permissions
https://github.com/Agontuk/react-native-geolocation-service/blob/master/docs/setup.md
https://rnfirebase.io/

### icons
https://github.com/oblador/react-native-vector-icons#installation

### reanimated
https://docs.swmansion.com/react-native-reanimated/docs/installation/

### performance tuning

enable proguard (android)
enable hermes (android/ios)
https://reactnative.dev/docs/performance
https://www.codementor.io/blog/react-optimization-5wiwjnf9hj
https://blog.codemagic.io/improve-react-native-app-performance/
https://reactnative.dev/docs/profiling

### check list
https://shift.infinite.red/react-native-final-steps-691a01f9d895


### OTA
https://pagepro.co/blog/react-native-over-the-air-updates/
https://docs.microsoft.com/en-us/appcenter/distribution/codepush/rn-updates



# Reset
# reset configuration

## performance and memory
gradle.properties
```
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true
```

https://rnfirebase.io/enabling-multidex

## bootsplash 
```
yarn react-native generate-bootsplash src/assets/images/splash.png \
  --assets-path=src/assets/images --background-color=#FCFCFC --logo-width=400 \
  --flavor=main
```
ios: https://github.com/zoontek/react-native-bootsplash#ios-1
android: https://github.com/zoontek/react-native-bootsplash#android-1

## firebase
- comment useFlipper in podfile (doesn't work with firebase)
https://rnfirebase.io/#3-ios-setup
https://rnfirebase.io/dynamic-links/usage#ios-setup
https://rnfirebase.io/#2-android-setup

https://rnfirebase.io/messaging/ios-permissions

https://rnfirebase.io/messaging/usage/ios-setup
https://rnfirebase.io/analytics/usage#disable-ad-id-usage-on-ios
## google maps
https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md


## fastlane
```
# ios
fastlane add_plugin firebase_app_distribution
fastlane add_plugin fastlane-plugin-versioning
# android
fastlane add_plugin increment_version_code
fastlane add_plugin firebase_app_distribution

```
from xcode in sigining section, select team

##  icons
https://github.com/oblador/react-native-vector-icons#android
https://github.com/oblador/react-native-vector-icons#ios
## app start icon
xcode => Images.xcassets upload from assets appicon folder

## svg
https://github.com/kristerkari/react-native-svg-transformer#for-react-native-v057-or-newer--expo-sdk-v3100-or-newer
https://github.com/kristerkari/react-native-svg-transformer#configuring-svgr-how-svg-images-get-transformed
