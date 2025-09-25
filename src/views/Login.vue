<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Rails POS</h1>
        <p class="mt-2 text-sm text-gray-600">Point of Sale System</p>
      </div>

      <!-- Login Form Card -->
      <div class="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="mb-6">
          <h2 class="text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the POS system
          </p>
          <p class="mt-2 text-center text-sm text-gray-600">
            Don't have an account?
            <router-link
              to="/signup"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up here
            </router-link>
          </p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <BaseInput
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            required
            :error="formErrors.email"
            autocomplete="email"
          />

          <!-- Password Field -->
          <BaseInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            :error="formErrors.password"
            autocomplete="current-password"
          />

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <!-- Forgot Password Link (placeholder) -->
            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="loginError"
            class="bg-red-50 border border-red-200 rounded-md p-4"
          >
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400 mr-2" />
              <div class="text-sm text-red-800">
                {{ loginError }}
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            class="w-full"
            size="lg"
            :loading="authStore.isLoading"
            :disabled="!isFormValid || authStore.isLoading"
          >
            Sign in
          </BaseButton>
        </form>

        <!-- System Status -->
        <div class="mt-6 text-center">
          <div
            class="flex items-center justify-center space-x-2 text-xs text-gray-500"
          ></div>
        </div>
      </div>

      <!-- Footer -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import type { LoginCredentials } from "../types";

// Composables
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

// State
const loginError = ref("");

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const formErrors = reactive({
  email: "",
  password: "",
});

// Computed
const isFormValid = computed(() => {
  return (
    form.email &&
    form.password &&
    form.email.includes("@") &&
    form.password.length >= 6
  );
});

// Methods
function resetErrors() {
  formErrors.email = "";
  formErrors.password = "";
  loginError.value = "";
}

function validateForm(): boolean {
  resetErrors();
  let isValid = true;

  if (!form.email) {
    formErrors.email = "Email is required";
    isValid = false;
  } else if (!form.email.includes("@")) {
    formErrors.email = "Please enter a valid email address";
    isValid = false;
  }

  if (!form.password) {
    formErrors.password = "Password is required";
    isValid = false;
  } else if (form.password.length < 6) {
    formErrors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  return isValid;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  try {
    resetErrors();

    const credentials: LoginCredentials = {
      email: form.email,
      password: form.password,
    };

    const result = await authStore.login(credentials);

    if (result.success) {
      globalStore.showSuccess(
        "Login Successful",
        `Welcome back, ${authStore.userName}!`
      );

      // Redirect to intended route or default to orders
      const redirect = (route.query.redirect as string) || "/orders";
      router.push(redirect);
    } else {
      loginError.value =
        result.error || "Invalid credentials. Please try again.";

      // Clear password on error
      form.password = "";
    }
  } catch (error) {
    console.error("Login error:", error);
    loginError.value = "An unexpected error occurred. Please try again.";
    form.password = "";
  }
}

// Lifecycle
onMounted(() => {
  // If already logged in, redirect to intended route
  if (authStore.isLoggedIn) {
    const redirect = (route.query.redirect as string) || "/orders";
    router.push(redirect);
    return;
  }

  // Initialize auth store (check for stored tokens)
  authStore.initializeAuth();
});
</script>
