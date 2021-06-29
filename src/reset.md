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

## app start icon
xcode => Images.xcassets upload from assets appicon folder

