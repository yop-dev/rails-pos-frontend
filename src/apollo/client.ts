import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { useTokenManager } from '../composables/useAuth'

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'same-origin', // Include credentials for authentication
})

// Create auth link to add authentication headers
const authLink = setContext((_, { headers }) => {
  const { getToken } = useTokenManager()
  const token = getToken()
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` })
    }
  }
})

// Create error link to handle authentication errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      
      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED' || extensions?.code === 'UNAUTHORIZED') {
        console.warn('Authentication error detected, clearing stored tokens')
        const { clearTokens } = useTokenManager()
        clearTokens()
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    })
  }
  
  if (networkError) {
    console.error(`Network error: ${networkError}`)
    
    // Handle 401 Unauthorized
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      console.warn('401 Unauthorized, clearing stored tokens')
      const { clearTokens } = useTokenManager()
      clearTokens()
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }
})

// Cache implementation with type policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          // Cache products by category filter
          keyArgs: ['filter', ['categoryId']],
        },
        orders: {
          // Cache orders separately by status
          keyArgs: ['filter', ['status']],
        },
      },
    },
    Product: {
      fields: {
        price: {
          // Always use the latest price from server
          merge: false,
        },
      },
    },
  },
})

// Combine all links
const link = from([
  errorLink,
  authLink,
  httpLink
])

// Create the Apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})