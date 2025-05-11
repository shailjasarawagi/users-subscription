import type { User, Subscription } from "../types"


export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/users.json')
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const response = await fetch('/subscriptions.json')
  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions')
  }
  return response.json()
}

