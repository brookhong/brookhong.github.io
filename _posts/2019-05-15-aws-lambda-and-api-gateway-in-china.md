---
layout: post
title: AWS lambda and API Gateway in China
category: cn
---

{{ page.title }}
================
AWS上的Lambda 与 API Gateway配合可以迅速搭出一个REST API，在中国情况有一点特殊。

1. 登录[lambda](https://console.amazonaws.cn/lambda/home)，创建一个Lambda Function。
![Lambda Function Hello World](https://user-images.githubusercontent.com/288207/57746655-b6164c80-7704-11e9-9c68-4d5ae036f8b2.png)

1. 登录[apigateway](https://console.amazonaws.cn/apigateway/home)，创建一个API Gateway，选择Deploy API部署到某个Stage，比如beta。
![Deploy to beta](https://user-images.githubusercontent.com/288207/57747304-92083a80-7707-11e9-8e13-dc539479c8c2.png)

到这里，如果是在中国以外的地区，现在你只要运行

    curl "https://**********.execute-api.cn-north-1.amazonaws.com.cn/beta"

就能看到

    "Hello from Lambda!"

但是这里是中国，我们有特色，你得到不一样的东西，是这个，

    {"Message":null}

原因在[这里](https://github.com/serverless/serverless/pull/4665#issuecomment-365843810)，

> You cannot open your endpoint without ICP Recordal. It always return 403 {"Message": null}. Except your function authorize by IAM.

就是说你要么用一个自己已备案的域名，要么加上IAM授权。我没有已备案域名，所以加上IAM授权，如下。
![Use AWS_IAM](https://user-images.githubusercontent.com/288207/57746949-00e49400-7706-11e9-9a5e-1b220a53d512.png)

记得点下Deploy API，再来一次

    curl "https://**********.execute-api.cn-north-1.amazonaws.com.cn/beta"

这次是下面这个，说明认证生效了。

    {"message":"Missing Authentication Token"}

AWS_IAM要求对[所有HTTP请求签名](https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html)以保证安全，就是需要对请求计算hash，加上你的AWS access/secret key再hash，得到一个签名，放到HTTP Authorization头里。你如果能手动得到这个签名，当作Authentication通过curl传给AWS，理论上也是可行的。

[awscurl](https://github.com/okigan/awscurl)自动化了这个过程，安装awscurl，通过它来调用就好了。

> pip install awscurl

> awscurl --access_key ******************** --secret_key **************************************** --region=cn-north-1 "https://**********.execute-api.cn-north-1.amazonaws.com.cn/beta"
