import fs from "fs/promises"
import axios from "axios"
const data = (await fs.readFile("./fonts.txt")).toString()
const lines = data.split("\n")
for(let i = 6; i < lines.length-8; i += 9) {
    const url = lines[i].trim().replace("src: url(","").replace(") format('woff2');","")
    const split = url.split("/")
    console.log(split[split.length-1])
    const res = await axios.get(url, {responseType: 'arraybuffer'});
    await fs.writeFile(`./static/webfont/${split[split.length-1]}`, new Buffer.from(res.data), 'binary');
}