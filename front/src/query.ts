import * as fs from 'fs';
import * as path from 'path';
// 登录后的 document.cookie
// export const cookie =
//   'sid=sem_pz_bdpc_dasou_title; JSESSIONID=""; __g=sem_pz_bdpc_dasou_title; Hm_lvt_194df3105ad7148dcf2b98a91b5e727a=1531636400; __c=1531637578; __l=r=https%3A%2F%2Fwww.zhipin.com%2F%3Fsid%3Dsem_pz_bdpc_dasou_title&l=%2Fwww.zhipin.com%2Fc101210100-p100102%2F%3Fka%3Dhot-position-3&g=%2Fwww.zhipin.com%2F%3Fsid%3Dsem_pz_bdpc_dasou_ti; lastCity=101010100; toUrl=https%3A%2F%2Fwww.zhipin.com%2Fjob_detail%2F%3Fquery%3D%25E6%259D%25AD%25E5%25B7%259E%26scity%3D101010100%26position%3D100102; t=qPar0X7rahf3EzPs; wt=qPar0X7rahf3EzPs; Hm_lpvt_194df3105ad7148dcf2b98a91b5e727a=1531641540; __a=70411124.1531636399.1531636399.1531637578.14.2.13.14'

export const cookie = fs.readFileSync(path.resolve(__dirname, './config/cookie.txt'), 'utf8').trim();


export enum SALARY {
  '不限' = '0',
  '10_20' = '405',
  '20_50' = '406',
  '50以上' = '407'
}

export enum EXPERIENCE {
  '不限' = '0'
}

export enum DEGREE {
  '不限' = '0'
}

export interface IQuery {
  page?: number
  status: number
  jobid?: string
  salary: SALARY
  experience: EXPERIENCE
  degree: DEGREE
}

export const defaultQuery: IQuery = {
  status: 0,
  salary: SALARY['不限'],
  experience: EXPERIENCE.不限,
  degree: DEGREE.不限
}
