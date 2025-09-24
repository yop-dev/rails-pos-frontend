import { useQuery, useLazyQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { computed, ref, watch, type Ref } from 'vue'
import type { Product, Category, ProductsFilterInput, CreateProductInput, ApiError } from '../types'

// GraphQL Queries
const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductsFilterInput) {
    products(filter: $filter) {
      id
      name
      description
      priceCents
      currency
      productType
      active
      createdAt
      updatedAt
      photoUrl
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
        priceCents
        currency
        productType
        active
        category {
          id
          name
        }
      }
      errors {
        message
        field
      }
    }
  }
`

// Composables
export function useProducts(filter: Ref<ProductsFilterInput | null> = ref(null)) {
  const { result, loading, error, refetch } = useQuery(GET_PRODUCTS, () => ({
    filter: filter.value
  }), {
    notifyOnNetworkStatusChange: true
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
  const { result, loading, error } = useQuery(GET_PRODUCT_CATEGORIES)
  
  const categories = computed(() => result.value?.productCategories ?? [])
  
  return {
    categories,
    loading,
    error
  }
}

export function useProductSearch() {
  const searchTerm = ref('')
  const selectedCategory = ref<string | null>(null)
  
  const filter = computed(() => {
    const filterObj: ProductsFilterInput = {}
    
    if (searchTerm.value) {
      filterObj.search = searchTerm.value
    }
    
    if (selectedCategory.value) {
      filterObj.categoryId = selectedCategory.value
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
  
  return {
    searchTerm,
    selectedCategory,
    products,
    loading,
    error
  }
}

export function useCreateProduct() {
  const { mutate: createProductMutation, loading, error } = useMutation(CREATE_PRODUCT)
  
  const createProduct = async (productData: CreateProductInput): Promise<{ success: boolean; product?: Product; errors?: ApiError[] }> => {
    try {
      const result = await createProductMutation({
        input: productData
      })
      
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
      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred' }]
      }
    }
  }
  
  return {
    createProduct,
    loading,
    error
  }
}