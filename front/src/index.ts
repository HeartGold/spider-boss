import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { defaultQuery, cookie } from './query'
import { uids } from './uid'
const ora = require('ora');
const outputPath = path.resolve(__dirname, '../output.txt')

async function main() {
  try {
    fs.exists(outputPath, function (exists) {
      exists ?  execSync(`rm ${outputPath}`) : ''
    });
  } catch (error) { }
  const spinner = ora(`正在获取候选人信息，请稍后...`).start();
  const labelsArr = await Promise.all(
    require('./config/jobs.json').map(async ({ id, desc }) => {
      try {
        const data = await getList(id)
        const labels = await getLabels(data)
        return labels.map(label => ({ ...label, jobid: desc }))
      } catch (error) {
        return null
      }
    })
  )
  let labels = []
  labelsArr.filter(i => !!i).forEach(i => {
    labels = labels.concat(i)
  })

  fs.writeFile(outputPath, JSON.stringify(labels), err => {
    if (err) console.error('error')
    spinner.succeed(`获取候选人数据成功,共${labels.length}人`)
  })
}

export interface ILabel {
  year: string
  degree: string
  age: string
  name: string
  company: string
  school: string[] // egg: ['school', '专业']
  salary: string
  advantage: string
  greet: {
    gids: string
    jids: string
    expectIds: string
    lids: string

    // 其他
    eid: string
  }
  info: any
}

async function getLabels(htmlList): Promise<any> {
  const $ = cheerio.load(htmlList)
  const labels = $('.sider-op')
    .map((i, item) => {
      const dom = $(item).parent()
      const dataDom = dom.find('.icon-coop')
      const greetDom = dom.find('.btn-greet')
      const recommendDom = dom.find('.recommend-reason')
      const uid = dataDom.data('uid')

      // 去重和去除已沟通
      if (!greetDom.html() || uids[uid]) {
        return false
      }

      // ugly
      uids[uid] = true

      const infos = dom
        .find('.info-labels')
        .find('.label-text')
        .map((ei, eitem) => {
          return $(eitem).text()
        })
        .get()
      const recommend = dom
        .find('.recommend-reason')
        .find('span')
        .map((ei, eitem) => {
          return $(eitem).text()
        }).get()
      return {
        year: infos[1],
        degree: infos[2],
        age: infos[3],
        name: dom.find('.geek-name').text(),
        status: infos[4],
        lastActive: infos[5],
        recommend: recommend,
        experience: dom
          .find('.experience > span')
          .map((ei, eitem) => {
            const [company, title] = $(eitem)
              .text()
              .split(' • ')
            return {
              company: company.replace(/(现|曾)任 /, ''),
              title
            }
          })
          .get(),
        school: dom
          .find('.experience')
          .next()
          .text()
          .split(' • ')[0],
        filed: dom
          .find('.experience')
          .next()
          .text()
          .split(' • ')[1],
        salary: dom.find('.badge-salary').text(),
        advantage: dom.find('.advantage > p').text(),
        greet: {
          gids: uid,
          jids: dataDom.data('jid'),
          expectIds: dataDom.data('expect'),
          lids: greetDom.data('lid'),
          // 其他
          eid: dataDom.data('eid')
        }
      }
    })
    .get()
    // 过滤掉已沟通的
    .filter(i => !!i)

  return await Promise.all(
    labels.map(async (item: any) => {
      const info = await getInfo({
        uid: item.greet.eid,
        jid: item.greet.jids,
        lid: item.greet.lids,
        expectId: item.greet.expectIds
      })

      return { ...item, info }
    })
  )
}

async function getList(jobid) {
  const getData = async (page, htmlList) => {
    const { data } = await axios.get(
      'https://www.zhipin.com/boss/recommend/geeks.json',
      {
        params: { ...defaultQuery, page, jobid },
        headers: {
          cookie
        }
      }
    )

    if (data.hasMore) {
      page++
      htmlList += data.htmlList
      return await getData(page, htmlList)
    }
    return htmlList
  }

  return await getData(1, '')
}

async function getInfo(opts: any = {}) {
  return;
  try {
    const { data } = await axios.get(
      'https://www.zhipin.com/chat/geek/info?GET',
      {
        params: opts,
        headers: {
          cookie,
          referer: 'https://www.zhipin.com/chat/im?mu=recommend'
        },
        timeout: 1500
      }
    )

    const $ = cheerio.load(data)

    return $('.resume-box').text()
  } catch (error) {
    return `拉取info 失败, ${opts.uid}`
  }
}

main()
