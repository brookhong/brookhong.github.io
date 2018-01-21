---
layout: post
title: scrapy with SOCKS5 proxy
category: en
---

{{ page.title }}
================

> https://github.com/scrapy/scrapy/issues/747

```python
from txsocksx.http import SOCKS5Agent
from twisted.internet import reactor
from twisted.internet.endpoints import TCP4ClientEndpoint
from scrapy.core.downloader.webclient import _parse
from scrapy.core.downloader.handlers.http11 import HTTP11DownloadHandler, ScrapyAgent

class Socks5DownloadHandler(HTTP11DownloadHandler):

    def download_request(self, request, spider):
        """Return a deferred for the HTTP download"""
        agent = ScrapySocks5Agent(contextFactory=self._contextFactory, pool=self._pool)
        return agent.download_request(request)

class ScrapySocks5Agent(ScrapyAgent):

    def _get_agent(self, request, timeout):
        bindAddress = request.meta.get('bindaddress') or self._bindAddress
        proxy = request.meta.get('proxy')
        if proxy:
            _, _, proxyHost, proxyPort, proxyParams = _parse(proxy)
            _, _, host, port, proxyParams = _parse(request.url)
            proxyEndpoint = TCP4ClientEndpoint(reactor, proxyHost, proxyPort,
                                timeout=timeout, bindAddress=bindAddress)
            agent = SOCKS5Agent(reactor, proxyEndpoint=proxyEndpoint)
            return agent
        return self._Agent(reactor, contextFactory=self._contextFactory,
            connectTimeout=timeout, bindAddress=bindAddress, pool=self._pool)

settings.set('DOWNLOAD_HANDLERS', {'http': 'fooSpider.Socks5DownloadHandler', 'https': 'fooSpider.Socks5DownloadHandler'})
```

> [<twisted.python.failure.Failure OpenSSL.SSL.Error: [('SSL routines', 'tls_process_server_certificate', 'certificate verify failed')]>]

    pip install service_identity
    SSL_CERT_FILE="$(python -m certifi)" scrapy runspider fooSpider.py  --loglevel=INFO -o gists.json
