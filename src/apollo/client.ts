import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  // Remove credentials for now to test without authentication
  // credentials: 'same-origin', 
})

// Simple error link for debugging
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