// gids: 3512533
// jids: 22556792
// expectIds: 6924474
// lids: c25ee8ec-9910-4ada-97ae-f2a87639eb46.f1:common:f1-b-gbdt-a-T1_2-B-2018070521.17

// fetch("https://www.zhipin.com/chat/batchAddRelation.json", {"credentials":"include","headers":{},"referrer":"https://www.zhipin.com/chat/im?mu=recommend","referrerPolicy":"no-referrer-when-downgrade","body":"gids=3512533&jids=22556792&expectIds=6924474&lids=c25ee8ec-9910-4ada-97ae-f2a87639eb46.f1%3Acommon%3Af1-b-gbdt-a-T1_2-B-2018070521.17","method":"POST","mode":"cors"});
import * as fs from 'fs';
import * as path from 'path';
import score from './score'
import axios from 'axios'
import {
    table
} from 'table';
import { cookie } from './query';
import { createTempVariable } from '../node_modules/typescript';
import { printTable } from './print'
const { FIELD, COMPANY, LAST_ACTIVE, STATUS, UNIVERSITY, KEYWORDS, DEGREE } = score;
const chalk = require('chalk')
const result = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../output.txt'), 'utf8').trim());
// 发起打招呼请求
async function say_hi(item) {
    const { greet, name } = item
    await axios(
        {
            method: 'post',
            url: 'https://www.zhipin.com/chat/batchAddRelation.json',
            params: greet,
            headers: {
                "cookie": cookie
            },
        }
    ).then(function (response) {
    })
        .catch(function (error) {
            console.log(error);
        });

}
// 计算分数然后对列表排序，取前一百
const sort_result = function () {
    let score = 0
    return result.map(item => {
        const { year, degree, age, status, experience, school, advantage, recommend, lastActive, filed } = item
        const { company, title } = experience
        // 学校、状态、活跃状态、学历、公司
        score = UNIVERSITY[school] || 0 + STATUS[status] || 0 + DEGREE[degree] || 0 + COMPANY[company] || 0 + LAST_ACTIVE[lastActive] || 0;
        // 关键字和专业
        KEYWORDS.forEach((item => {
            if (advantage.indexOf(item) > -1) {
                score += 1
            }
        }))
        FIELD.indexOf(filed) > -1 ? score += 1 : 0;
        return {
            ...item,
            score
        }
    }).sort((a, b) => {
        if (a.score > b.score) {
            return -1;
        } else if (a.score < b.score) {
            return 1;
        } else {
            return 0;
        }
    });
}
// 批量打招呼
async function run() {
    const list = sort_result().slice(0, 100)
    const count = result.length;
    await list.forEach(item => {
        say_hi(item)
    });
    console.log(chalk.green(`已向共${count}的牛人中前100人打招呼～请前往boss直聘查看!下方是候选人具体信息`))
    await printTable(list)
}
run()