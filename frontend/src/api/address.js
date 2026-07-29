import apiClient from './client'

export async function getAddresses() {
  const { data } = await apiClient.get('/api/addresses')
  return data
}

export async function addAddress(addressData) {
  const { data } = await apiClient.post('/api/addresses', addressData)
  return data
}

export async function updateAddress(addressId, addressData) {
  const { data } = await apiClient.put(`/api/addresses/${addressId}`, addressData)
  return data
}

export async function deleteAddress(addressId) {
  await apiClient.delete(`/api/addresses/${addressId}`)
}