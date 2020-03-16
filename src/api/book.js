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
    url: '/file/update',
    method: 'post',
    data: book
  })
}

