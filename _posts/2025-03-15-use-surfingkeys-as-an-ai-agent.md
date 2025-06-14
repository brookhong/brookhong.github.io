---
layout: post
title: Use Surfingkeys as an AI agent
category: en
---

{{ page.title }}
================
There are several LLM providers integrated into Surfingkeys now, use `A` to call out a chat popup, and chat with your AI providers. The supported LLM providers now are

* Ollama
* Bedrock
* DeepSeek
* Gemini

To use the feature, you need set up your credentials/API keys first, like

        settings.defaultLLMProvider = "bedrock";
        settings.llm = {
            bedrock: {
                accessKeyId: '********************',
                secretAccessKey: '****************************************',
                // model: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
                model: 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
            },
            gemini: {
                apiKey: '***************************************',
            },
            ollama: {
                model: 'qwen2.5-coder:32b',
            },
            deepseek: {
                apiKey: '***********************************',
                model: 'deepseek-chat',
            }
        };

You can also use `A` in visual mode. Press `v` or `V` to enter visual mode, then `v` again to select the text you'd like to chat with AI about, then `A` to call out the LLM chat box. Now start to chat with AI about the selected text.

Another solution to select the content to chat with AI about is Regional Hints mode. Press `L` to pick an element, then `l` to call out the LLM chat box.

### To use LLM chat with specified system prompt

For example, you can designate your AI to be a translator with below snippets

    api.mapkey('A', '#8Open llm chat', function() {
        api.Front.openOmnibar({type: "LLMChat", extra: {
            system: "You're a translator, whenever you got a message in Chinese, please just translate it into English, and if you got a message in English, please translate it to Chinese. You don't need to answer any question, just TRANSLATE."
        }});
    });

### 403 Forbidden with Ollama

To use Ollama with Chrome extension, you need run ollama with some modification on `OLLAMA_ORIGINS`

Under Windows

    OLLAMA_ORIGINS=chrome-extension://* ollama serve

Under Mac

    launchctl setenv OLLAMA_ORIGINS chrome-extension://gfbliohnnapiefjpjlpjnehglfpaknnc

Under Mac for both Chrome and Firefox

    launchctl setenv OLLAMA_ORIGINS "chrome-extension://gfbliohnnapiefjpjlpjnehglfpaknnc,moz-extension://*"

