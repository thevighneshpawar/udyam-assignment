import axios from 'axios'

const API_BASE = import.meta.env.API_BASE

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ----- FIELD APIs -----
export const getFieldsByStep = async step => {
  const res = await api.get(`/fields/step/${step}`)
  return res.data
}

export const importFields = async () => {
  const res = await api.post(`/fields/import`)
  return res.data
}

// ----- SUBMISSION APIs -----
export const submitStep1 = async data => {
  const res = await api.post(`/udyam/step1`, data)
  return res.data
}

export const submitStep2 = async (id, data) => {
  const res = await api.post(`/udyam/step2/${id}`, data)
  return res.data
}

export const getAllSubmissions = async () => {
  const res = await api.get(`/udyam/submissions`)
  return res.data
}

export const getSubmissionStatus = async () => {
  const res = await api.get(`/udyam/status`)
  return res.data
}
