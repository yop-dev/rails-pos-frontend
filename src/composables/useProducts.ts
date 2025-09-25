import { useQuery, useLazyQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { computed, ref, watch, type Ref } from 'vue'
import type { Product, Category, ApiError } from '../types'
import { useAuthStore } from '../stores/auth'

// GraphQL Queries
const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductsFilterInput) {
    products(filter: $filter) {
      id
      name
      description
      productType
      priceCents
      price {
        cents
        currency
        formatted
      }
      currency
      photoUrl
      active
      createdAt
      updatedAt
      category {
        id
        name
      }
    }
  }
`

const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories {
    productCategories {
      id
      name
      position
      productsCount
    }
  }
`

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        id
        name
        description
        productType
        priceCents
        price {
          cents
          currency
          formatted
        }
        currency
        photoUrl
        active
        category {
          id
          name
        }
      }
      errors {
        message
        path
      }
    }
  }
`

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
    updateProduct(id: $id, input: $input) {
      product {
        id
        name
        description
        productType
        priceCents
        price {
          cents
          currency
          formatted
        }
        currency
        photoUrl
        active
        category {
          id
          name
        }
      }
      errors {
        message
        path
      }
    }
  }
`

const CREATE_PRODUCT_CATEGORY = gql`
  mutation CreateProductCategory($input: CreateProductCategoryInput!) {
    createProductCategory(input: $input) {
      category {
        id
        name
        position
        productsCount
      }
      errors {
        message
        path
      }
    }
  }
`

// Composables
export function useProducts(filter: Ref<any> = ref(null)) {
  const { result, loading, error, refetch } = useQuery(GET_PRODUCTS, () => ({
    filter: filter.value
  }), {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  })

  const products = computed(() => result.value?.products ?? [])
  
  return {
    products,
    loading,
    error,
    refetch
  }
}

export function useProductCategories() {
  const { result, loading, error, refetch } = useQuery(GET_PRODUCT_CATEGORIES, {}, {
    fetchPolicy: 'cache-and-network'
  })
  
  const categories = computed(() => result.value?.productCategories ?? [])
  
  return {
    categories,
    loading,
    error,
    refetch
  }
}

export function useProductSearch() {
  const searchTerm = ref('')
  const selectedCategory = ref<string | null>(null)
  const activeOnly = ref(true)
  
  const filter = computed(() => {
    const filterObj: any = {}
    
    if (searchTerm.value) {
      filterObj.search = searchTerm.value
    }
    
    if (selectedCategory.value) {
      filterObj.categoryId = selectedCategory.value
    }
    
    if (activeOnly.value) {
      filterObj.active = true
    }
    
    return Object.keys(filterObj).length > 0 ? filterObj : null
  })
  
  const { products, loading, error, refetch } = useProducts(filter)
  
  // Debounce search
  let searchTimeout: number
  watch(searchTerm, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      refetch()
    }, 300)
  })
  
  watch(selectedCategory, () => {
    refetch()
  })

  watch(activeOnly, () => {
    refetch()
  })
  
  return {
    searchTerm,
    selectedCategory,
    activeOnly,
    products,
    loading,
    error,
    refetch
  }
}

export function useCreateProduct() {
  const { mutate: createProductMutation, loading, error } = useMutation(CREATE_PRODUCT)
  
  const createProduct = async (productData: any): Promise<{ success: boolean; product?: Product; errors?: ApiError[] }> => {
    try {
      const result = await createProductMutation({
        input: {
          input: productData
        }
      })
      
      if (result?.data?.createProduct?.errors?.length && result.data.createProduct.errors.length > 0) {
        return {
          success: false,
          errors: result.data.createProduct.errors
        }
      }
      
      return {
        success: true,
        product: result?.data?.createProduct?.product
      }
    } catch (err) {
      console.error('Error creating product:', err)
      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred while creating the product' }]
      }
    }
  }
  
  return {
    createProduct,
    loading,
    error
  }
}

export function useUpdateProduct() {
  const { mutate: updateProductMutation, loading, error } = useMutation(UPDATE_PRODUCT)
  
  const updateProduct = async (productId: string, updateData: any): Promise<{ success: boolean; product?: Product; errors?: ApiError[] }> => {
    try {
      const result = await updateProductMutation({
        id: productId,
        input: updateData
      })
      
      if (result?.data?.updateProduct?.errors?.length && result.data.updateProduct.errors.length > 0) {
        return {
          success: false,
          errors: result.data.updateProduct.errors
        }
      }
      
      return {
        success: true,
        product: result?.data?.updateProduct?.product
      }
    } catch (err) {
      console.error('Error updating product:', err)
      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred while updating the product' }]
      }
    }
  }
  
  return {
    updateProduct,
    loading,
    error
  }
}


export function useCreateProductWithPhoto() {
  const isLoading = ref(false)
  
  const createProductWithPhoto = async (
    productData: any, 
    photoFile: File
  ): Promise<{ 
    success: boolean; 
    product?: Product; 
    errors?: ApiError[] 
  }> => {
    isLoading.value = true
    
    try {
      // Prepare GraphQL multipart upload
      const formData = new FormData()
      
      const operations = JSON.stringify({
        query: `mutation CreateProduct($input: CreateProductInput!) { 
          createProduct(input: $input) { 
            product { 
              id 
              name 
              description 
              productType 
              priceCents 
              price { 
                cents 
                currency 
                formatted 
              } 
              currency 
              photoUrl 
              active 
              category { 
                id 
                name 
              } 
            } 
            errors { 
              message 
              path 
            } 
          } 
        }`,
        variables: {
          input: {
            input: {
              ...productData,
              photo: null // Will be mapped via form data
            }
          }
        }
      })
      
      const map = JSON.stringify({
        '0': ['variables.input.input.photo']
      })
      
      formData.append('operations', operations)
      formData.append('map', map)
      formData.append('0', photoFile)
      
      // Get auth token for headers
      const authStore = useAuthStore()
      const headers: Record<string, string> = {}
      
      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
      }
      
      console.log('Sending multipart GraphQL request...')
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers,
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result?.errors?.length > 0) {
        return {
          success: false,
          errors: result.errors.map((err: any) => ({ message: err.message }))
        }
      }
      
      if (result?.data?.createProduct?.errors?.length > 0) {
        return {
          success: false,
          errors: result.data.createProduct.errors
        }
      }
      
      return {
        success: true,
        product: result?.data?.createProduct?.product
      }
    } catch (err) {
      console.error('Error creating product with photo:', err)
      return {
        success: false,
        errors: [{ message: 'Failed to create product with photo. Please try again.' }]
      }
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    createProductWithPhoto,
    loading: isLoading
  }
}

export function useCreateProductCategory() {
  const { mutate: createCategoryMutation, loading, error } = useMutation(CREATE_PRODUCT_CATEGORY)
  
  const createCategory = async (categoryData: any): Promise<{ success: boolean; category?: Category; errors?: ApiError[] }> => {
    try {
      const result = await createCategoryMutation({
        input: categoryData
      })
      
      if (result?.data?.createProductCategory?.errors?.length && result.data.createProductCategory.errors.length > 0) {
        return {
          success: false,
          errors: result.data.createProductCategory.errors
        }
      }
      
      return {
        success: true,
        category: result?.data?.createProductCategory?.category
      }
    } catch (err) {
      console.error('Error creating product category:', err)
      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred while creating the category' }]
      }
    }
  }
  
  return {
    createCategory,
    loading,
    error
  }
}

// Utility function to format price for display (works with cents)
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

// Utility function to convert price to cents
export function priceToCents(price: number): number {
  return Math.round(price * 100)
}

// Utility function to extract cents from Product price object
export function getPriceCents(product: Product): number {
  return product.price.cents
}

// Utility function to get formatted price from Product
export function getFormattedPrice(product: Product): string {
  return product.price.formatted
}