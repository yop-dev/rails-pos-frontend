// GraphQL Types (matching backend schema with camelCase)
export interface Product {
  id: string
  name: string
  description?: string
  priceCents: number
  currency: string
  productType: 'PHYSICAL' | 'DIGITAL'
  active: boolean
  createdAt: string
  updatedAt: string
  photoUrl?: string
  category: Category
}

export interface Category {
  id: string
  name: string
  position: number
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  fullName: string
}

export interface Address {
  id?: string
  unitFloorBuilding?: string
  street: string
  barangay: string
  city: string
  province: string
  postalCode: string
  fullAddress: string
  displayAddress: string
}

export interface Order {
  id: string
  reference: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED'
  source: 'ONLINE' | 'IN_STORE'
  subtotalCents: number
  shippingFeeCents: number
  convenienceFeeCents: number
  discountCents: number
  totalCents: number
  shippingMethodLabel?: string
  paymentMethodLabel?: string
  createdAt: string
  confirmedAt?: string
  completedAt?: string
  customer: Customer
  deliveryAddress?: Address
  orderItems: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  unitPriceCents: number
  totalPriceCents: number
  productNameSnapshot: string
  product: Product
}

export interface CartItem {
  productId: string
  name: string
  priceCents: number
  productType: 'PHYSICAL' | 'DIGITAL'
  quantity: number
  photoUrl?: string | null
}

export interface PaymentOption {
  code: string
  label: string
  convenienceFeeCents: number
}

export interface ShippingOption {
  code: string
  label: string
  feeCents: number
}

// Form Types
export interface CustomerForm {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface AddressForm {
  unitFloorBuilding?: string
  street: string
  barangay: string
  city: string
  province: string
  postalCode: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  errors?: ApiError[]
}

export interface ApiError {
  message: string
  field?: string
}

// Authentication Types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  error?: string
}

// Utility Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED'
export type OrderSource = 'ONLINE' | 'IN_STORE'
export type ProductType = 'PHYSICAL' | 'DIGITAL'

// GraphQL Input Types
export interface ProductsFilterInput {
  categoryId?: string
  search?: string
  active?: boolean
}

export interface CustomersSearchInput {
  email?: string
  phone?: string
  term?: string
}

export interface CreateOrderInput {
  source: OrderSource
  items: OrderItemInput[]
  customer: CustomerInput
  delivery?: AddressInput
  shippingMethodCode?: string
  paymentMethodCode: string
  voucherCode?: string
}

export interface OrderItemInput {
  productId: string
  quantity: number
  unitPriceCents: number
}

export interface CustomerInput {
  email: string
  firstName: string
  lastName: string
  phone: string
}

export interface AddressInput {
  street: string
  unitFloorBuilding?: string
  barangay: string
  city: string
  province: string
  postalCode?: string
  landmark?: string
  remarks?: string
}

export interface CreateProductInput {
  name: string
  description?: string
  categoryId: string
  priceCents: number
  productType: ProductType
  photo?: File
}

export interface CreateProductCategoryInput {
  name: string
  position?: number
}