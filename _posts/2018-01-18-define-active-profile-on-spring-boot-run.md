---
layout: post
title: define active profile on spring boot run
category: en
---

{{ page.title }}
================

This could help to run some CommandLineRunner only in dev stage.

```java
import org.springframework.context.annotation.Profile;
...
@Profile("dev")
public CommandLineRunner dataLoader(UserRepository repository) {
...
```

> https://github.com/spring-projects/spring-boot/issues/1095

    mvn spring-boot:run -Drun.jvmArguments="-Dspring.profiles.active=dev"

or

> https://docs.spring.io/spring-boot/docs/current/maven-plugin/examples/run-profiles.html

    mvn spring-boot:run -Drun.profiles=dev
