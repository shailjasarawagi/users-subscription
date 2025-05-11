export interface User {
    id: number
    first_name: string
    middle_name: string
    last_name: string
    username: string
    email: string
    password: string
    active: string
    address: string
    country: string
    join_date: string
  }
  
  export interface Subscription {
    id: number
    user_id: string
    package: string
    expires_on: string
  }
  
  export interface UserWithSubscription extends User {
    subscription?: Subscription
  }
  
  export type SortField = "name" | "join_date" | "active" | "package" | "expires_on"
  export type SortDirection = "asc" | "desc"
  
  export interface FilterOptions {
    status?: string
    package?: string
    country?: string
    search?: string
  }
  