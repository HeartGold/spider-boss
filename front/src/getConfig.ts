import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { cookie } from './query'
const outputPath = path.resolve(__dirname, './config/jobs.json')
const ora = require('ora');
async function getConfig() {
  try {
    const spinner = ora(`正在获取职位，请稍后...`).start();
    const { data } = await axios.get(
      'https://www.zhipin.com/chat/im?mu=recommend',
      {
        headers: {
          cookie,
          referer: 'https://www.zhipin.com/chat/im?mu=recommend'
        },
        timeout: 1500
      }
    ) 
    const $ = cheerio.load(data)
    const jobs = $('li[ka^=recommend-job-]').map((ei, eitem) => {
      return {
        id: $(eitem).data('jobid'),
        desc: $(eitem).text()
      }
    })
    .get()

    fs.writeFile(outputPath, JSON.stringify(jobs), err => {
      if (err) console.error('error')
      spinner.succeed(`获取职位信息成功,共${jobs.length}个职位`)
    })
  } catch (error) {
    console.log(error)
    return
  }

}

getConfig()
