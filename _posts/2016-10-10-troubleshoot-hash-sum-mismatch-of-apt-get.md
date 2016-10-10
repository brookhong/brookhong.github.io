---
layout: post
title: troubleshoot Hash Sum mismatch of apt-get
category: en
---

{{ page.title }}
================

When you come across error with `apt-get update` like below

    W: Failed to fetch http://ppa.launchpad.net/ubuntu-toolchain-r/test/ubuntu/dists/trusty/main/binary-amd64/Packages  Hash Sum mismatch

    E: Some index files failed to download. They have been ignored, or old ones used instead.

You may get around of this by referring [this](http://askubuntu.com/questions/41605/trouble-downloading-packages-list-due-to-a-hash-sum-mismatch-error).

What could you do if the link above does not help? Deep dive it.

1. First to save cycle time of running `apt-get update`, you could run update on some specific repository.

        sudo apt-get update -o Dir::Etc::sourcelist=/etc/apt/sources.list.d/ubuntu-toolchain-r-test-trusty.list -o Dir::Etc::sourceparts="-" -o APT::Get::List-Cleanup="0"

    You just need replace `/etc/apt/sources.list.d/ubuntu-toolchain-r-test-trusty.list` with the path to your sources.list to achieve that.

1. Instruct `apt-get` to be verbose with options as below

        -o Debug::Acquire::http=true -o Debug::pkgAcquire::Auth=true -o Debug::Hashs=true

    For example,

        sudo apt-get update -o Dir::Etc::sourcelist=/etc/apt/sources.list.d/ubuntu-toolchain-r-test-trusty.list -o Dir::Etc::sourceparts="-" -o APT::Get::List-Cleanup="0" -o Debug::Acquire::http=true -o Debug::pkgAcquire::Auth=true -o Debug::Hashs=true


1. Now we have the log.

        201 URI Done: gzip:/var/lib/apt/lists/partial/ppa.launchpad.net_ubuntu-toolchain-r_test_ubuntu_dists_trusty_main_binary-amd64_Packages
        RecivedHash: SHA256:ea0f64b188cd752f3cb76bbf5cdbe48c4c57badeb895f5baf27424c88871340c
        ExpectedHash: SHA256:cb89f35f448139f2c6d3cb40cad7fa5a163adf5bda066225162d51d0d723d954

        HTTP/1.1 302 Found
        Cache-Control: no-cache
        Location: http://120.52.72.23:80/ppa.launchpad.net/c3pr90ntc0td/ubuntu-toolchain-r/test/ubuntu/dists/trusty/main/binary-amd64/Packages.gz
        Content-Length: 0
        Date: Mon, 10 Oct 2016 09:06:59 GMT
        Via: 1.1 pek7-proxy-2.amazon.com:80 (Cisco-WSA/9.0.1-162)
        Connection: keep-alive

    Now check what we got from the repository.

        $ file /var/lib/apt/lists/partial/ppa.launchpad.net_ubuntu-toolchain-r_test_ubuntu_dists_trusty_main_binary-amd64_Package
        /var/lib/apt/lists/partial/ppa.launchpad.net_ubuntu-toolchain-r_test_ubuntu_dists_trusty_main_binary-amd64_Packages: bzip2 compressed data, block size = 900k

    The URL says it will give us a .gz file, but it actually presented a .bzip2 file.

1. We could force `apt-get` to get only .gz files by adding option

        -o Acquire::CompressionTypes::Order::="gz"

    For example,

        sudo rm -rf /var/lib/apt/lists/partial # important
        sudo apt-get update -o Dir::Etc::sourcelist=/etc/apt/sources.list.d/ubuntu-toolchain-r-test-trusty.list -o Dir::Etc::sourceparts="-" -o APT::Get::List-Cleanup="0" -o Acquire::CompressionTypes::Order::=gz

    Before which, we must clean the partial folder.

