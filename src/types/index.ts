// GraphQL Types (matching backend schema with camelCase)
export interface Money {
  cents: number
  currency: string
  formatted: string
}

export interface Product {
  id: string
  name: string
  description?: string
  priceCents: number
  price: Money
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
  productsCount: number
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
  postalCode?: string
  landmark?: string
  remarks?: string
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
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  unitPriceCents: number
  totalPriceCents: number
  productName: string
  product: Product
}

export interface CartItem {
  productId: string
  name: string
  priceCents: number  // Local cart storage uses cents for calculations
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
  customerId?: string
  deliveryAddress?: AddressInput
  paymentMethodCode: string
  notes?: string
}

export interface OrderItemInput {
  productId: string
  quantity: number
}

export interface CustomerInput {
  email: string
  firstName: string
  lastName: string
  phone: string
}

export interface AddressInput {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
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

// UI Component Types
export interface NavigationRoute {
  name: string
  label: string
  path: string
  icon?: any
  badge?: string | number
  children?: NavigationRoute[]
}

export interface BreadcrumbItem {
  label: string
  path?: string
  active?: boolean
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface TableAction {
  key: string
  label: string
  icon?: any
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

// Notification Types (from global store)
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

// Form Validation Types
export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
  options?: Array<{ value: string; label: string }>
}

// Money and Currency Types (already defined above)

export interface PriceRange {
  min: number
  max: number
}

// Pagination Types
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNext: boolean
  hasPrev: boolean
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  priceRange?: PriceRange
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
  label: string
}

// Modal and Dialog Types
export interface ModalProps {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  persistent?: boolean
  showClose?: boolean
}

export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

// Component Event Types
export interface ComponentEvents {
  'update:modelValue': [value: any]
  'change': [value: any]
  'click': [event: MouseEvent]
  'submit': [data: any]
  'cancel': []
  'close': []
}

// Store State Types
export interface CartState {
  items: CartItem[]
  customer: Customer | null
  deliveryAddress: Address | null
  paymentMethod: string
  shippingMethod: string
  isOnlineOrder: boolean
  voucherCode: string
  voucherDiscount: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
}

export interface GlobalState {
  isLoading: boolean
  loadingMessage: string
  notifications: Notification[]
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}

// Additional Utility Types
export type Theme = 'light' | 'dark'
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
export type InputSize = 'sm' | 'md' | 'lg'
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Generic API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationInfo
  errors?: ApiError[]
}

export interface MutationResponse<T> {
  data?: T
  success: boolean
  errors?: ApiError[]
  message?: string
}

// Vue Router Meta Types
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  layout?: string
  breadcrumb?: BreadcrumbItem[]
}
