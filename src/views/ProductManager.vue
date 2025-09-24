<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p class="text-gray-600 mt-1">
            Browse and add products to your order
          </p>
        </div>

        <!-- Add Product Button -->
        <BaseButton
          @click="showCreateProductModal = true"
          size="lg"
          :left-icon="PlusIcon"
        >
          Add Product
        </BaseButton>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Side: Product Catalog -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Category Buttons -->
        <div class="bg-white border-b border-gray-200 px-6 py-4">
          <div class="flex flex-wrap gap-2">
            <button
              @click="selectedCategory = null"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              All
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ category.name }}
              <span class="ml-1 text-xs opacity-75"
                >({{ category.productsCount }})</span
              >
            </button>
          </div>
        </div>

        <!-- Search/Filter -->
        <div class="bg-white border-b border-gray-200 px-6 py-4">
          <div class="relative max-w-md">
            <MagnifyingGlassIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search for products"
              class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Products Grid -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
            ></div>
          </div>

          <!-- Products Grid -->
          <div
            v-else-if="filteredProducts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              @click="openProductModal(product)"
            >
              <!-- Product Image -->
              <div
                class="aspect-square bg-gray-100 rounded-t-lg overflow-hidden"
              >
                <img
                  v-if="product.photoUrl"
                  :src="product.photoUrl"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <CubeIcon class="h-12 w-12 text-gray-400" />
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <h3 class="font-medium text-gray-900 mb-1 line-clamp-2">
                  {{ product.name }}
                </h3>
                <p class="text-lg font-bold text-primary-600 mb-2">
                  {{ product.price.formatted }}
                </p>

                <!-- Quick Add to Cart -->
                <button
                  @click.stop="quickAddToCart(product)"
                  class="w-full bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon class="h-4 w-4 inline mr-1" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <CubeIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p class="text-gray-500">
              Try adjusting your search or category filter
            </p>
          </div>
        </div>
      </div>

      <!-- Right Side: Cart Section -->
      <div class="w-96 bg-white border-l border-gray-200 flex flex-col">
        <!-- Cart Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <p class="text-sm text-gray-600">{{ cartStore.totalItems }} items</p>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div v-if="cartStore.isEmpty" class="text-center py-8">
            <ShoppingCartIcon class="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">Your cart is empty</p>
            <p class="text-sm text-gray-400 mt-1">
              Add products to get started
            </p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.productId"
              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <!-- Product Image -->
              <div
                class="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0"
              >
                <img
                  v-if="item.photoUrl"
                  :src="item.photoUrl"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <CubeIcon class="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <!-- Item Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ item.name }}
                </p>
                <p class="text-sm text-gray-600">
                  ₱{{ formatPrice(item.priceCents) }}
                </p>

                <!-- Quantity Controls -->
                <div class="flex items-center space-x-2 mt-2">
                  <button
                    @click="decreaseQuantity(item.productId)"
                    class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    :disabled="item.quantity <= 1"
                  >
                    <MinusIcon class="h-3 w-3" />
                  </button>
                  <span class="text-sm font-medium w-6 text-center">{{
                    item.quantity
                  }}</span>
                  <button
                    @click="increaseQuantity(item.productId)"
                    class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <PlusIcon class="h-3 w-3" />
                  </button>
                  <button
                    @click="removeFromCart(item.productId)"
                    class="ml-2 text-red-500 hover:text-red-700"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Item Total -->
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">
                  ₱{{ formatPrice(item.priceCents * item.quantity) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Voucher Code -->
        <div
          v-if="!cartStore.isEmpty"
          class="px-6 py-4 border-t border-gray-200"
        >
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Voucher Code</label
            >
            <div class="flex space-x-2">
              <input
                v-model="voucherCode"
                type="text"
                placeholder="Enter voucher code"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <BaseButton
                @click="applyVoucher"
                size="sm"
                variant="secondary"
                :disabled="!voucherCode.trim()"
              >
                Apply
              </BaseButton>
            </div>
            <div
              v-if="cartStore.voucherDiscount > 0"
              class="text-sm text-green-600"
            >
              Voucher applied: -₱{{ formatPrice(cartStore.voucherDiscount) }}
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div
          v-if="!cartStore.isEmpty"
          class="px-6 py-4 border-t border-gray-200 bg-gray-50"
        >
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium"
                >₱{{ formatPrice(cartStore.subtotalCents) }}</span
              >
            </div>
            <div
              v-if="cartStore.shippingFeeCents > 0"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-600">Delivery Fee</span>
              <span class="font-medium"
                >₱{{ formatPrice(cartStore.shippingFeeCents) }}</span
              >
            </div>
            <div
              v-if="cartStore.convenienceFeeCents > 0"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-600">Convenience Fee</span>
              <span class="font-medium"
                >₱{{ formatPrice(cartStore.convenienceFeeCents) }}</span
              >
            </div>
            <div
              v-if="cartStore.voucherDiscount > 0"
              class="flex justify-between text-sm text-green-600"
            >
              <span>Voucher Discount</span>
              <span class="font-medium"
                >-₱{{ formatPrice(cartStore.voucherDiscount) }}</span
              >
            </div>
            <div class="border-t border-gray-300 pt-2 flex justify-between">
              <span class="font-semibold text-gray-900">Grand Total</span>
              <span class="font-bold text-primary-600"
                >₱{{ formatPrice(cartStore.totalCents) }}</span
              >
            </div>
          </div>

          <!-- Continue Button -->
          <BaseButton @click="proceedToCheckout" class="w-full mt-4" size="lg">
            Continue to Checkout
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div
      v-if="selectedProduct"
      class="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div class="flex-shrink-0 relative">
          <!-- Close Button -->
          <button
            @click="closeProductModal"
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow-sm"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>

          <!-- Product Image -->
          <div class="aspect-square bg-gray-100">
            <img
              v-if="selectedProduct.photoUrl"
              :src="selectedProduct.photoUrl"
              :alt="selectedProduct.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <CubeIcon class="h-16 w-16 text-gray-400" />
            </div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="flex-1 overflow-y-auto p-4">
          <h2 class="text-xl font-bold text-gray-900 mb-2">
            {{ selectedProduct.name }}
          </h2>
          <p class="text-2xl font-bold text-primary-600 mb-3">
            {{ selectedProduct.price.formatted }}
          </p>

          <div v-if="selectedProduct.description" class="mb-4">
            <h3 class="text-sm font-medium text-gray-900 mb-1">
              Description
            </h3>
            <p class="text-sm text-gray-700">{{ selectedProduct.description }}</p>
          </div>

          <!-- Quantity Selector -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-700">Quantity:</span>
            <div class="flex items-center space-x-2">
              <button
                @click="modalQuantity = Math.max(1, modalQuantity - 1)"
                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <MinusIcon class="h-4 w-4" />
              </button>
              <span class="text-lg font-medium w-8 text-center">{{
                modalQuantity
              }}</span>
              <button
                @click="modalQuantity++"
                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <PlusIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Add to Cart Button -->
          <BaseButton @click="addToCartFromModal" class="w-full" size="lg">
            <PlusIcon class="h-5 w-5 mr-2" />
            Add to Cart (₱{{
              formatPrice(selectedProduct.priceCents * modalQuantity)
            }})
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Create Product Modal -->
    <CreateProductModal
      v-model="showCreateProductModal"
      @success="handleProductCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  MagnifyingGlassIcon,
  CubeIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/vue/24/outline";
import {
  useProductSearch,
  useProductCategories,
} from "../composables/useProducts";
import { useCartStore } from "../stores/cart";
import { useGlobalStore } from "../stores/global";
import BaseButton from "../components/BaseButton.vue";
import CreateProductModal from "../components/CreateProductModal.vue";
import type { Product } from "../types";

// Composables
const router = useRouter();
const {
  searchTerm,
  selectedCategory,
  activeOnly,
  products,
  loading,
  error,
  refetch,
} = useProductSearch();
const { categories } = useProductCategories();
const cartStore = useCartStore();
const globalStore = useGlobalStore();

// State
const selectedProduct = ref<Product | null>(null);
const modalQuantity = ref(1);
const voucherCode = ref("");
const showCreateProductModal = ref(false);

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value.filter((product) =>
    activeOnly.value ? product.active : true
  );

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (product) => product.category.id === selectedCategory.value
    );
  }

  if (searchTerm.value.trim()) {
    const query = searchTerm.value.toLowerCase().trim();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description &&
          product.description.toLowerCase().includes(query))
    );
  }

  return filtered;
});

// Methods
function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

function openProductModal(product: Product) {
  selectedProduct.value = product;
  modalQuantity.value = 1;
}

function closeProductModal() {
  selectedProduct.value = null;
  modalQuantity.value = 1;
}

function quickAddToCart(product: Product) {
  cartStore.addToCart(product, 1);

  globalStore.showSuccess(
    "Added to Cart",
    `${product.name} has been added to your cart`
  );
}

function addToCartFromModal() {
  if (selectedProduct.value) {
    cartStore.addToCart(selectedProduct.value, modalQuantity.value);

    globalStore.showSuccess(
      "Added to Cart",
      `${selectedProduct.value.name} (${modalQuantity.value}x) has been added to your cart`
    );

    closeProductModal();
  }
}

function increaseQuantity(productId: string) {
  const item = cartStore.items.find((item) => item.productId === productId);
  if (item) {
    cartStore.updateQuantity(productId, item.quantity + 1);
  }
}

function decreaseQuantity(productId: string) {
  const item = cartStore.items.find((item) => item.productId === productId);
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1);
  }
}

function removeFromCart(productId: string) {
  cartStore.removeFromCart(productId);
  globalStore.showInfo("Item Removed", "Item has been removed from your cart");
}

function applyVoucher() {
  if (voucherCode.value.trim()) {
    // Mock voucher application - in real app, this would call an API
    const discountAmount = 1000; // 10.00 discount
    cartStore.applyVoucher(voucherCode.value, discountAmount);

    globalStore.showSuccess(
      "Voucher Applied",
      `Discount of ₱${formatPrice(discountAmount)} has been applied`
    );

    voucherCode.value = "";
  }
}

function proceedToCheckout() {
  console.log("Continue to Checkout button clicked");

  // Check if cart has items before proceeding
  if (cartStore.isEmpty) {
    console.log("Cart is empty, showing warning");
    globalStore.showWarning(
      "Cart Empty",
      "Please add some products to your cart before proceeding to checkout"
    );
    return;
  }

  console.log(
    "Navigating to CreateOrder page with cart items:",
    cartStore.totalItems
  );

  // Navigate directly to the customer tab to skip product selection
  router.push({
    name: "CreateOrder",
    query: { tab: "customer" },
  });
}

function handleProductCreated(product: Product) {
  showCreateProductModal.value = false;
  
  // Refresh the products list to show the new product
  refetch();
  
  globalStore.showSuccess(
    "Product Created",
    `${product.name} has been added to your catalog`
  );
}

// Initialize with active products only
activeOnly.value = true;
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
