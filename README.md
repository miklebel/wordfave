# Deploying to App Store

1. Open project in XCode
2. Increment "Version" and "Build"
3. In menu choose "Product", then "Build"
4. In menu, choose "Product", then "Archive"
5. "Distribute", then it goes straigh to App Store Connect

# Deploying to Play Store

1. Increment "versionCode" and "versionName" in android/app/build.gradle
2. cd /android & ./gradlew bundleRelease
3. Create new release in Google Play
4. Upload .aab from /android/app/build/outputs/bundle/release/app-release.aab

# Debugging in development

Chrome debugger (view DevTools console for output of the app):
http://localhost:8081/debugger-ui/