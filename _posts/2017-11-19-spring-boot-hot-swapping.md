---
layout: post
title: Spring boot hot swapping
category: en
---

{{ page.title }}
================

Hot swapping is a productive feature for your development, which helps to reload classes automatically without restarting container.

The only setting is to add below into your `pom.xml`, as it is said [here](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-devtools.html).

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
    </dependency>

Applications that use `spring-boot-devtools` will automatically restart whenever files on the classpath change.

Now,

1. `mvn spring-boot:run &` to launch your application background.
2. edit a java file in `vim` and save it.

    Nothing happens?!

    Don't panic, that's right, `spring-boot-devtools` watches only files on the classpath as mentioned above. The last step is to build your java source file to propagate changes to classpath such as `target/classes`.

3. `mvn compile`

    You could see your application automatically restarted. If you'are using IDE, this step could be mitigated by [enabling automatic build](https://stackoverflow.com/questions/23155244/spring-boot-hotswap-with-intellij-ide).

As a `vim` user, I don't use IDE even when coding with Java, here is the way I facilitate quick build from `vim`.

Add below into your `~/.vim/ftplugin/java.vim`.

    function! SearchFileBackwards(fn)
        let fp = expand('%:p')
        let pos = len(fp) - 1
        while pos > 0
            let pom = ""
            if fp[pos] == '/'
                let pom = strpart(fp, 0, pos + 1) . a:fn
                if filereadable(pom)
                    break
                endif
            endif
            let pos = pos - 1
        endwhile
        return pom
    endfunction

    function! BuildMavenProject()
        let pom = SearchFileBackwards("pom.xml")
        if pom != ""
            exec '!mvn -f '.SearchFileBackwards("pom.xml").' compile'
        else
            echohl WarningMsg | echo "No pom.xml found." | echohl None
        endif
    endfunction

    " comment out below line to enable automatic build on maven project.
    " autocmd BufWritePost *.java :call BuildMavenProject()

    " Press <F8> to build current maven project.
    nnoremap <buffer> <silent> <F8> :call BuildMavenProject()<CR>
