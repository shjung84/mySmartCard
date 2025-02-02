import axios from 'axios'

export function getPosts() {
  return axios.get('http://localhost:5500/posts')
}

export function getPostById(id) {
  return axios.get(`http://localhost:5500/posts/${id}`)
}

export function createPost(post) {
  return axios.post('http://localhost:5500/posts', post)
}

export function updatePost(id, post) {
  return axios.put(`http://localhost:5500/posts/${id}`, post)
}

export function deletePost(id) {
  return axios.delete(`http://localhost:5500/posts/${id}`)
}
