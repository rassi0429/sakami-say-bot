# sakami-say-bot

![CI Badge](https://github.com/rassi0429/sakami-say-bot/actions/workflows/docker-build-release.yaml/badge.svg)
![License MIT](https://img.shields.io/github/license/rassi0429/sakami-say-bot)

さかみさんの画像を生成するBotです

## helm repo

`https://rassi0429.github.io/helmcharts/`

## 環境変数

helmのvaluesも同じ名前になっています。

## refresh tokenの取り方

```bash
npm run auth
```
でRefresh tokenを取得してください。
CLIENT_IDとCLIENT_SECRETをつけて起動してください。

| 環境変数名 | 説明            |
|-------|---------------|
| TOKEN | misskey token |
