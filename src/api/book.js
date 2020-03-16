import request from '@/utils/request'

export function createBook(book) {
  return request({
    url: '/file/submitPostForm',
    method: 'post',
    data: book
  })
}

export function updateBook(book) {
  return request({
    url: '/file/submitPostForm',
    method: 'post',
    data: book
  })
}

export function getBook(fileName) {
  return request({
    url: '/file/getBook',
    method: 'get',
    params: { fileName } // get方法使用params post方法使用data
  })
}

