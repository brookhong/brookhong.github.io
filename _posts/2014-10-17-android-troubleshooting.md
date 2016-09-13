---
layout: post
title: Android开发常见问题
category: cn
---

{{ page.title }}
================

* [ERROR] Failed to execute goal on project slidingmenu-maps-support: Could not resolve dependencies for project com.jeremyfeinstein.slidingmenu:slidingmenu-maps-support:jar:1.3-SNAPSHOT: Failure to find com.google.android.maps:maps:jar:16_r3 in https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced -> [Help 1]

        用`SDK Manager`安装`Google APIs`
        mvn install:install-file -DgroupId=com.google.android.maps -DartifactId=maps -Dversion=16_r3 -Dpackaging=jar -Dfile=d:\tools\adt-bundle-windows-x86_64-20140702\sdk\add-ons\addon-google_apis-google-16\libs\maps.jar

* Could not find property 'Compile' on root project 'ActionBarSherlock'.

        vim build.gradle
        - tasks.withType(Compile) { options.encoding = "UTF-8" }
        + tasks.withType(JavaCompile) { options.encoding = "UTF-8" }

* Could not find any version that matches com.android.support:support-v4:??.0.

        open the SDK manager, and make sure that the "Android Support Repository" (not just Android Support Library) is installed

* org.gradle.api.plugins.PluginInstantiationException: Could not create plugin of type 'LibraryPlugin'; java.lang.NoClassDefFoundError: org/gradle/api/artifacts/result/ResolvedModuleVersionResult

        vim build.gradle
        - classpath 'com.android.tools.build:gradle:0.5.+'
        + classpath 'com.android.tools.build:gradle:0.13.+'

* failed to find target android-14

        vim build.gradle
        - compileSdkVersion 14
        + compileSdkVersion 16

* failed to find Build Tools revision 17.0.0

        vim build.gradle
        - buildToolsVersion '17.0.0'
        + buildToolsVersion '20.0.0'

* Failed to execute goal com.jayway.maven.plugins.android.generation2:android-maven-plugin:3.6.0:generate-sources (default-generate-sources) on project my-android-application: Execution default-generate-sources of goal com.jayway.maven.plugins.android.generation2:android-maven-plugin:3.6.0:generate-sources failed: A required class was missing while executing com.jayway.maven.plugins.android.generation2:android-maven-plugin:3.6.0:generate-sources: Lorg/sonatype/aether/RepositorySystem;

        vim pom.xml
        - <version>3.6.0</version>
        + <version>3.8.0</version>

* com.android.dx.cf.iface.ParseException: bad class file magic (cafebabe) or version (0034.0000)

        use jdk 1.7 instead of jdk 1.8
        vim pom.xml
        - <java.version>1.8</java.version>
        + <java.version>1.7</java.version>

* How do you install an APK file in the Android emulator?

        adb install demos\target\sample-demos-4.4.0.apk
