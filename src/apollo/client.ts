import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'same-origin', // Include credentials for authentication
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

// Create the Apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
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