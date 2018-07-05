ionic cordova build android --prod --release
copy /y "D:\Projects\DoublesRun\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" "D:\Program Files\JDK\appBuild"
D:
cd "D:\Program Files\JDK\bin"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../appBuild/doublesrunkey.jks ../appBuild/app-release-unsigned.apk key0
copy /y ../appBuild/app-release-unsigned.apk "C:\Users\resha\AppData\Local\Android\Sdk\build-tools\appBuild"
C:
cd "C:\Users\resha\AppData\Local\Android\Sdk\build-tools\28.0.0"
zipalign -v 4 ../appBuild/app-release-unsigned.apk ../appBuild/doublesRun.apk
apksigner sign --ks ../appBuild/doublesrunkey.jks ../appBuild/app.apk