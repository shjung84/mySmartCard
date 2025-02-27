import axios from 'axios'

const BASE_URL = 'http://localhost:5500/posts'

export function getPosts() {
  return axios.get(BASE_URL)
}

export function getPostById(id) {
  return axios.get(`${BASE_URL}/${id}`)
}

export function createPost(post) {
  return axios.post(BASE_URL, post)
}

export function updatePost(id, post) {
  return axios.put(`${BASE_URL}/${id}`, post)
}

export function deletePost(id) {
  return axios.delete(`${BASE_URL}/${id}`)
}
