import puppeteer from "puppeteer"
import {v4 as uuidv4} from 'uuid';
import express from "express"
import axios from "axios"

const app = express()
app.use("/internal", express.static('static'));
app.use("/image", express.static('img'));

app.listen(3000, () => console.log("express ok"))

const generateJELLYImage = async (text) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true});
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 720});
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");
    await page.goto("http://localhost:3000/internal/index.html?text=" + text, {waitUntil: 'networkidle0'});
    await page.waitForTimeout(2600);
    const uuid = uuidv4()
    await page.screenshot({path: `./img/${uuid}.png`});
    await browser.close();
    return uuid
}

import WebsocketClient from "websocket";
import fs from "fs"
import FormData from "form-data"

const TOKEN = process.env.TOKEN
const WS_URL = 'wss://misskey.neos.love/streaming?i=' + TOKEN

const client = new WebsocketClient.client()

client.on("connect", (connection) => {
    console.log("open")
    connection.send(JSON.stringify({
        "type": "connect",
        "body": {
            "channel": "localTimeline",
            "id": "test"
        }
    }))

    connection.on("message", async (message) => {
        if(message.type !== "utf8") return
        const data = JSON.parse(message.utf8Data)
        if(data.body.type !== "note") return
        if(data.body.body.text?.includes("@okimoti_sakami")) {
            // remove all mentions in body text
            const renderText = data.body.body.text.replace(/@[a-zA-Z0-9_]+/g, "")
            const uuid = await generateJELLYImage(renderText)
            const file_id = await uploadFile(uuid)
            await create_reply(data.body.body.id, renderText, file_id)
        }
    })

    connection.on("close", () => {
        console.log("close")
        // reconnect
         client.connect(WS_URL);
    })
})

client.connect(WS_URL);


const API_URL = "https://misskey.neos.love/api/notes/create"

const uploadFile = async (file) => {
    try {

        const formData = new FormData()
        formData.append('file', fs.createReadStream(`./img/${file}.png`), {
            filename: file + '.png',
            contentType: 'image/png',
        });
        formData.append("i", TOKEN)
        formData.append("name", file + ".png")
        const res = await axios.post("https://misskey.neos.love/api/drive/files/create", formData, {
            headers: {
                "Content-Type": "application/json"
            },

        })
        return res.data.id
    } catch (e) {
        console.log(e)
    }
}

const create_reply = async (replyId, text, imageUrl) => {
    try {
        await axios.post(API_URL, {
            "i": TOKEN,
            "text": text,
            "replyId": replyId,
            "fileIds": imageUrl ? [imageUrl] : []
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (e) {
        console.log(e)
    }
}
