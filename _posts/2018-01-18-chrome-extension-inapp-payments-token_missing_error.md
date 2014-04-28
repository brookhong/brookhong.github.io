---
layout: post
title: Chrome Extension InApp Payments - TOKEN_MISSING_ERROR
category: en
---

{{ page.title }}
================

> https://console.developers.google.com/apis/credentials

Create credentials, select `OAuth client ID`, Application type as `Chrome App`.

In your manifest.json,

```json
"oauth2": {
    "client_id": "??????.apps.googleusercontent.com",
    "scopes": [
        "https://www.googleapis.com/auth/chromewebstore.readonly"
    ]
},
```
