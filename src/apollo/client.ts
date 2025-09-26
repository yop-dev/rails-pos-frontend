import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

// Load Apollo Client error messages in development
if (import.meta.env.DEV) {
  loadDevMessages()
  loadErrorMessages()
}

// HTTP connection to the GraphQL API
// Use environment variable for GraphQL URI, fallback to localhost for development
const graphqlUri = import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:3000/graphql'
console.log('🔗 GraphQL URI:', graphqlUri)
console.log('🔧 All Vite env vars:', import.meta.env)
console.log('🎯 VITE_GRAPHQL_URI specifically:', import.meta.env.VITE_GRAPHQL_URI)

const httpLink = createHttpLink({
  uri: graphqlUri,
  // Remove credentials for now to test without authentication
  // credentials: 'same-origin', 
})

// Enhanced error link with cold start handling
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })
  }
  
  if (networkError) {
    console.error(`Network error: ${networkError}`)
    
    // Check if this might be a cold start (connection timeout/refused)
    if (networkError.message.includes('Failed to fetch') || 
        networkError.message.includes('CONNECTION_REFUSED') ||
        networkError.message.includes('timeout')) {
      console.log('🤶 Backend might be starting up (cold start). This can take 30-60 seconds on free tier.')
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

// Combine links (removing authLink for now)
const link = from([
  errorLink,
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
