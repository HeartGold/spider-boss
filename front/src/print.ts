import {
    table
} from 'table';
const chalk = require('chalk')
function printTable(result: any) {
    function getInfoTab(count) {
        let list = [['姓名', '年龄', '学历', '工作经验', '公司', '简介']];
        for (let i = count * 10; i < count * 10 + 10; i++) {
            const item = result[i]
            list.push([
                item.name,
                item.age,
                item.degree,
                item.year,
                item.experience[item.experience.length - 1].company,
                item.advantage,
            ])
        }
        return list;
    }
    const config = {
        columns: {
            5: {
                width: 70,
                height: 70
            }
        }
    };
    // 由于table超过10行会错乱，这里分多次输出
    for(let count = 0; count < 10 ; count ++) {
        console.log(chalk.blue('----------------------------------------------------我是表格的分割线------------------------------------------------------------------------'))
        console.log(table(getInfoTab(count), config))
    }
}
export {
    printTable
}