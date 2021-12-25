import request from '@/utils/request'

export function getLoginLogPageList(params: any) {
  return request({
    url: '/api/web/system/log/getLoginLogPageList',
    method: 'get',
    params
  })
}
