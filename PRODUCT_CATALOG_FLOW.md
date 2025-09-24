# Product Catalog Flow - Marketplace Style

## Overview
The ProductManager page has been redesigned to follow a marketplace-style flow similar to Lazada and Shopee, providing an intuitive shopping experience for merchants to create orders.

## Page Structure

### 1. Page Header
- **Title**: "Product Catalog" with description
- **Tabs**: 
  - "Products" tab (default active)
  - "Checkout" tab with cart item count badge

### 2. Product Catalog Section (Left Side)

#### Category Buttons
- **"All" button**: Shows all products (default selection)
- **Category buttons**: Filter products by category
- **Active state**: Primary blue background for selected category
- **Product counts**: Shows number of products in each category

#### Search/Filter
- **Search box**: Marketplace-style search with placeholder "Search products like Lazada, Shopee..."
- **Real-time filtering**: Filters products as user types
- **Search scope**: Searches both product names and descriptions

#### Products Grid
- **Responsive grid**: 1-4 columns based on screen size
- **Product cards**: Clean card design with:
  - Product image (or placeholder icon)
  - Product name (2-line clamp)
  - Price prominently displayed
  - "Add to Cart" quick-action button
- **Click interaction**: Opens product detail modal
- **Loading states**: Spinner while products load
- **Empty states**: Helpful message when no products match filters

### 3. Shopping Cart Section (Right Side)

#### Cart Header
- **Title**: "Shopping Cart"
- **Item count**: Shows total number of items

#### Cart Items
- **Empty state**: Shopping cart icon with helpful message
- **Item cards** (when cart has items):
  - Product image thumbnail
  - Product name and unit price
  - Quantity controls (+/- buttons)
  - Remove button (trash icon)
  - Item total price
- **Quantity management**: Real-time updates with visual feedback

#### Voucher Code Section
- **Input field**: For entering voucher codes
- **Apply button**: Applies discount (mock implementation with ₱10 discount)
- **Success feedback**: Shows applied discount amount

#### Order Summary
- **Subtotal**: Sum of all cart items
- **Delivery Fee**: Calculated based on shipping method (if online order)
- **Convenience Fee**: Based on payment method
- **Voucher Discount**: Applied discount (if any)
- **Grand Total**: Final amount with prominent styling

#### Continue Button
- **Large, prominent button**: "Continue to Checkout"
- **Navigation**: Switches to checkout tab or navigates to checkout page

### 4. Product Detail Modal

#### Product Information
- **Large product image**: Full-width display
- **Product name**: Large, prominent title
- **Price**: Bold, primary color
- **Description**: Full product description (if available)

#### Purchase Controls
- **Quantity selector**: +/- buttons with current quantity
- **Add to cart**: Large button showing total price for selected quantity
- **Close button**: X icon in top-right corner

#### User Experience
- **Modal overlay**: Semi-transparent background
- **Responsive**: Works on all screen sizes
- **Keyboard support**: ESC key closes modal

## Key Features

### 1. Marketplace-Like Experience
- **Visual design**: Clean, modern cards similar to e-commerce sites
- **Search functionality**: Fast, real-time product filtering
- **Category navigation**: Easy browsing by product categories
- **Shopping cart**: Always visible with real-time updates

### 2. Product Selection Methods
- **Quick add**: Single-click "Add to Cart" from product card
- **Detailed view**: Click product card to see full details and select quantity
- **Flexible quantities**: Can add multiple quantities from modal

### 3. Shopping Cart Management
- **Visual item management**: Clear display of all cart items
- **Quantity adjustments**: Easy +/- controls for each item
- **Item removal**: Quick delete with confirmation
- **Price transparency**: Clear breakdown of all costs

### 4. Voucher System
- **Code entry**: Simple input field for voucher codes
- **Instant application**: Immediate feedback when voucher applied
- **Discount visibility**: Clear display of savings in order summary

### 5. Checkout Flow
- **Tab navigation**: Easy switching between products and checkout
- **Cart persistence**: Cart maintained across tab switches
- **Item count badges**: Visual indication of cart contents

## Technical Implementation

### State Management
```typescript
const activeTab = ref('products')           // Current active tab
const selectedProduct = ref<Product | null>(null)  // Product in modal
const modalQuantity = ref(1)                // Quantity in modal
const voucherCode = ref('')                // Voucher input
```

### Product Filtering
```typescript
const filteredProducts = computed(() => {
  // Filter by active status, category, and search term
  // Real-time updates based on user input
})
```

### Cart Integration
- Uses existing `useCartStore()` for state management
- Real-time cart updates with visual feedback
- Persistent cart across page navigation

### Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Grid system**: Responsive product grid (1-4 columns)
- **Fixed cart**: Always visible cart section
- **Touch-friendly**: Large buttons and touch targets

## User Flow

### Adding Products to Cart
1. **Browse products**: Use categories or search to find products
2. **Quick add**: Click "Add to Cart" for immediate addition (quantity: 1)
3. **OR Detailed add**: 
   - Click product card to open modal
   - Adjust quantity as needed
   - Click "Add to Cart" with total price display

### Managing Cart
1. **View items**: All cart items displayed in right panel
2. **Adjust quantities**: Use +/- buttons for each item
3. **Remove items**: Click trash icon to remove completely
4. **Apply vouchers**: Enter code and click "Apply"

### Checkout Process
1. **Review order**: Check cart contents and totals
2. **Apply vouchers**: Optional discount codes
3. **Continue**: Click "Continue to Checkout"
4. **Next step**: Proceed to checkout form/payment

## Benefits

### For Users (Merchants)
- **Familiar experience**: Similar to popular e-commerce sites
- **Efficient browsing**: Quick category and search filtering
- **Flexible ordering**: Multiple ways to add products
- **Transparent pricing**: Clear cost breakdown
- **Visual feedback**: Immediate confirmation of actions

### For Development
- **Reusable components**: Modular, maintainable code
- **State management**: Centralized cart state with Pinia
- **Responsive design**: Works on all devices
- **Extensible**: Easy to add features like favorites, comparisons, etc.

## Future Enhancements

### Potential Additions
- **Product favorites**: Save products for later
- **Bulk actions**: Select multiple products at once
- **Advanced filters**: Price range, ratings, availability
- **Product comparison**: Side-by-side product comparison
- **Recently viewed**: Track and display recently viewed products
- **Recommendations**: "People also bought" suggestions
- **Inventory status**: Real-time stock levels
- **Product variants**: Size, color, model options