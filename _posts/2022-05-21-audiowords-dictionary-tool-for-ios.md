---
layout: post
title: AudioWords -- a speaking dictionary tool on iOS
category: en
---

{{ page.title }}
================

AudioWords is a dictionary tool for you to lookup a new word and read its meanings aloud, or add it into a named collection, so that you could review it afterwards and solidify it by listening to them.

* [View on App Store](https://apps.apple.com/us/app/audiowords/id1624921217)
* [App preview on YouTube](https://youtu.be/w87jnfuUshM)

# Privacy

AudioWords does not collect any data from user, all user data are stored on user's device and could be removed by user.

# Features
## Lookup

To lookup a new word, just input it in the search box. If no exact matches are found, it will return some candidates by fuzzy lookup. On the view of one word's definition, tapping another word will lead you to its definition, and so on. Navigate the browser history by swiping left/right.

![image](https://user-images.githubusercontent.com/288207/169633856-b87b0c50-9a7a-402d-8b77-c003a6778f1d.png)


## Play the word with speech synthesis engine

Press `play` button, it will read the word and its meanings for you.

![image](https://user-images.githubusercontent.com/288207/169633866-dc227d4a-1fd4-4041-a52e-ef39928f0b4f.png)


## Add into collection

Each word can be added into some collections, you can add it into a new collection by pressing the + button or add it into(remove it from) an existing collection by pressing collection name below. There are some words already added into some predefined collections which you can not modify.

![image](https://user-images.githubusercontent.com/288207/169633880-33b6fb7c-f61b-4d7d-9a88-b6a30a425d7e.png)

## Play a collection

Each collection can be reviewed in the Collections tab, where you can let AudioWords play a collection for you. You can turn off screen of your device and let AudioWords play the collection for you in background.

![image](https://user-images.githubusercontent.com/288207/169633890-b778e285-41ae-4021-b1d5-98bdfeb4f78d.png)


## Import a custom dictionary

Though AudioWords provides a built-in Engligh-To-English dictionary, you can import your own dictionary from an external URL, https://gist.githubusercontent.com/brookhong/d76fa0a92bc7bf21386b/raw/78e507c62817c5f715f3fc037b7777dcbdbbe54c/example.audiowords.

The dictionary file to be imported should have one record each line, which follows the pattern

    <word><TAB><tags of the word><TAB><definition in JSON string of the word>

Please refer to the content from above URL for example.

![image](https://user-images.githubusercontent.com/288207/169633898-d12ee476-ccad-4031-a1a8-2ed6e0cf905d.png)
