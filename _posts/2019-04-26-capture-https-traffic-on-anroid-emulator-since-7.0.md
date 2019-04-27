---
layout: post
title: capture HTTPS traffic on Anroid emulator since 7.0
category: en
---

{{ page.title }}
================
Before Android 7.0, it's pretty easy to capture HTTPS traffic, what you need to do are

1. Set up a proxy on desktop with OWASP ZAP or others.
1. Save the `Dynamic SSL Certificates`.
1. Push the certificate to your device.
1. Install the certificate on your device.

Then all your traffic from your device will be captured by the proxy on your desktop with OWASP ZAP.

After Anroid 7.0, it does not work after you followed exactly the steps above. If you use `adb logcat`, you could see exception as below:

> Exception on request to https://api.????.com/: javax.net.ssl.SSLHandshakeException: java.security.cert.CertPathValidatorException: Trust anchor for certification path not found.

There are other two steps to be needed.

1. Follow the instructions on [Network security configuration | Android Developers](https://developer.android.com/training/articles/security-config) to let your APP trust the user-installed certificates.

        <base-config cleartextTrafficPermitted="true">
            <trust-anchors>
                <certificates src="system" />
                <certificates src="user" />
            </trust-anchors>
        </base-config>

    It is not all set, you'll get another exception:

    > Exception on request to https://api.????.com/: javax.net.ssl.SSLPeerUnverifiedException: Hostname api.????.com not verified:

1. Now you need tell your `HttpsURLConnection` not to verify hostname with code change.

        HostnameVerifier hostnameVerifier = new HostnameVerifier() {
            @Override
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };

        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
        conn.setHostnameVerifier(hostnameVerifier);
