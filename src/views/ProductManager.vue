<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Product Manager</h1>
          <p class="text-gray-600 mt-1">
            Manage your product catalog
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
              class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group"
            >
              <!-- Edit Button -->
              <button
                @click="startEditing(product)"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-10"
                title="Edit product"
              >
                <PencilIcon class="h-4 w-4 text-gray-600" />
              </button>

              <!-- Product Image -->
              <div
                class="aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer"
                @click="openProductModal(product)"
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
                <!-- Edit Mode -->
                <div v-if="editingProductId === product.id" class="space-y-3">
                  <!-- Product Name Input -->
                  <input
                    v-model="editForm.name"
                    @keyup.enter="saveProduct()"
                    @keyup.escape="cancelEditing()"
                    class="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Product name"
                    ref="nameInput"
                  />
                  
                  <!-- Product Price Input -->
                  <div class="relative">
                    <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-primary-600 font-bold">₱</span>
                    <input
                      v-model="editForm.price"
                      @keyup.enter="saveProduct()"
                      @keyup.escape="cancelEditing()"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full pl-6 pr-2 py-1 text-sm font-bold text-primary-600 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <!-- Save/Cancel Buttons -->
                  <div class="flex space-x-2">
                    <button
                      @click="saveProduct()"
                      :disabled="saving || !editForm.name || !editForm.price"
                      class="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ saving ? 'Saving...' : 'Save' }}
                    </button>
                    <button
                      @click="cancelEditing()"
                      :disabled="saving"
                      class="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-700 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                
                <!-- Display Mode -->
                <div v-else>
                  <h3 class="font-medium text-gray-900 mb-1 line-clamp-2">
                    {{ product.name }}
                  </h3>
                  <p class="text-lg font-bold text-primary-600">
                    {{ product.price.formatted }}
                  </p>
                  
                  <!-- Product Status -->
                  <div class="mt-2">
                    <span 
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        product.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ product.active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
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

          <!-- Product Status -->
          <div class="mb-4">
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                selectedProduct.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ selectedProduct.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          
          <!-- Category -->
          <div class="mb-4" v-if="selectedProduct.category">
            <h3 class="text-sm font-medium text-gray-900 mb-1">Category</h3>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ selectedProduct.category.name }}
            </span>
          </div>
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
import {
  MagnifyingGlassIcon,
  CubeIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon
} from "@heroicons/vue/24/outline";
import {
  useProductSearch,
  useProductCategories,
  useUpdateProduct,
  priceToCents
} from "../composables/useProducts";
import { useGlobalStore } from "../stores/global";
import BaseButton from "../components/BaseButton.vue";
import CreateProductModal from "../components/CreateProductModal.vue";
import type { Product } from "../types";

// Composables
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
const { updateProduct, loading: updating } = useUpdateProduct();
const globalStore = useGlobalStore();

// State
const selectedProduct = ref<Product | null>(null);
const showCreateProductModal = ref(false);

// Edit state
const editingProductId = ref<string | null>(null);
const editForm = ref({ name: '', price: '' });
const saving = ref(false);
const nameInput = ref<HTMLInputElement | null>(null);

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
}

function closeProductModal() {
  selectedProduct.value = null;
}

// Edit functions
function startEditing(product: Product) {
  editingProductId.value = product.id;
  editForm.value.name = product.name;
  editForm.value.price = (product.priceCents / 100).toString();
  
  // Focus the name input after Vue updates the DOM
  setTimeout(() => {
    if (nameInput.value && typeof nameInput.value.focus === 'function') {
      nameInput.value.focus();
    }
  }, 100);
}

function cancelEditing() {
  editingProductId.value = null;
  editForm.value = { name: '', price: '' };
}

async function saveProduct() {
  if (!editingProductId.value || !editForm.value.name || !editForm.value.price) {
    return;
  }
  
  saving.value = true;
  
  try {
    const result = await updateProduct(editingProductId.value, {
      name: editForm.value.name,
      price_cents: priceToCents(parseFloat(editForm.value.price))
    });
    
    if (result.success) {
      globalStore.showSuccess(
        "Product Updated",
        `${editForm.value.name} has been updated successfully`
      );
      
      // Refresh the products list
      refetch();
      
      // Exit edit mode
      cancelEditing();
    } else {
      globalStore.showError(
        "Update Failed",
        result.errors?.[0]?.message || "Failed to update product"
      );
    }
  } catch (error) {
    console.error('Error updating product:', error);
    globalStore.showError(
      "Update Failed",
      "An unexpected error occurred while updating the product"
    );
  } finally {
    saving.value = false;
  }
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
