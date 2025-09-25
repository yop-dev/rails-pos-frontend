<template>
  <div id="print-receipt" class="print-content">
    <!-- Receipt Header -->
    <div class="receipt-header">
      <h1 class="receipt-title">Order Receipt</h1>
      <div class="receipt-info">
        <p><strong>Order:</strong> {{ order.reference }}</p>
        <p><strong>Date:</strong> {{ formatDate(order.createdAt) }}</p>
        <p><strong>Status:</strong> {{ getStatusLabel(order.status) }}</p>
      </div>
    </div>

    <!-- Customer Information -->
    <div class="receipt-section">
      <h2>Customer Information</h2>
      <div class="customer-info">
        <p><strong>Name:</strong> {{ order.customer.fullName }}</p>
        <p><strong>Email:</strong> {{ order.customer.email }}</p>
        <p v-if="order.customer.phone"><strong>Phone:</strong> {{ order.customer.phone }}</p>
      </div>
    </div>

    <!-- Delivery Address -->
    <div v-if="order.deliveryAddress" class="receipt-section">
      <h2>Delivery Address</h2>
      <div class="address-info">
        <p v-if="order.deliveryAddress.unitFloorBuilding">
          {{ order.deliveryAddress.unitFloorBuilding }}
        </p>
        <p>{{ order.deliveryAddress.street }}</p>
        <p>{{ order.deliveryAddress.barangay }}, {{ order.deliveryAddress.city }}</p>
        <p>{{ order.deliveryAddress.province }} {{ order.deliveryAddress.postalCode }}</p>
      </div>
    </div>

    <!-- Order Items -->
    <div class="receipt-section">
      <h2>Order Items</h2>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.id">
            <td>
              <div class="item-name">{{ item.productName }}</div>
              <div v-if="item.product?.productType" class="item-type">
                {{ item.product.productType === 'DIGITAL' ? 'Digital' : 'Physical' }}
              </div>
            </td>
            <td class="text-center">{{ item.quantity }}</td>
            <td class="text-right">{{ item.unitPrice.formatted }}</td>
            <td class="text-right font-semibold">{{ item.totalPrice.formatted }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Summary -->
    <div class="receipt-section">
      <h2>Order Summary</h2>
      <table class="summary-table">
        <tr>
          <td>Subtotal:</td>
          <td class="text-right">{{ order.subtotal.formatted }}</td>
        </tr>
        <tr v-if="order.shippingFee">
          <td>{{ order.shippingMethodLabel || 'Shipping' }}:</td>
          <td class="text-right">{{ order.shippingFee.formatted }}</td>
        </tr>
        <tr v-if="order.convenienceFee">
          <td>Convenience Fee:</td>
          <td class="text-right">{{ order.convenienceFee.formatted }}</td>
        </tr>
        <tr class="total-row">
          <td><strong>Total:</strong></td>
          <td class="text-right"><strong>{{ order.total.formatted }}</strong></td>
        </tr>
      </table>
    </div>

    <!-- Payment Information -->
    <div class="receipt-section">
      <h2>Payment & Delivery</h2>
      <div class="payment-info">
        <p v-if="order.paymentMethodLabel">
          <strong>Payment Method:</strong> {{ order.paymentMethodLabel }}
        </p>
        <p v-if="order.shippingMethodLabel">
          <strong>Delivery Method:</strong> {{ order.shippingMethodLabel }}
        </p>
        <p><strong>Order Source:</strong> {{ order.source === 'ONLINE' ? 'Online' : 'In-Store' }}</p>
      </div>
    </div>

    <!-- Order Timeline -->
    <div class="receipt-section">
      <h2>Order Status</h2>
      <div class="timeline-info">
        <p><strong>Created:</strong> {{ formatDateTime(order.createdAt) }}</p>
        <p v-if="order.confirmedAt"><strong>Confirmed:</strong> {{ formatDateTime(order.confirmedAt) }}</p>
        <p v-if="order.completedAt"><strong>Completed:</strong> {{ formatDateTime(order.completedAt) }}</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="receipt-footer">
      <p>Thank you for your order!</p>
      <p class="print-date">Printed on {{ new Date().toLocaleDateString() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '../types'

const props = defineProps<{
  order: Order
}>()

function print() {
  const printContent = document.getElementById('print-receipt')
  const windowPrint = window.open('', '', 'width=800,height=600')
  
  if (windowPrint && printContent) {
    windowPrint.document.write(`
      <html>
        <head>
          <title>Receipt - ${props.order.reference}</title>
          <style>
            ${getReceiptStyles()}
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    windowPrint.document.close()
    windowPrint.focus()
    windowPrint.print()
    windowPrint.close()
  }
}

function getReceiptStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .receipt-header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
    }
    
    .receipt-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .receipt-info p {
      margin: 2px 0;
    }
    
    .receipt-section {
      margin-bottom: 15px;
    }
    
    .receipt-section h2 {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 2px;
    }
    
    .customer-info p,
    .address-info p,
    .payment-info p,
    .timeline-info p {
      margin: 3px 0;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    
    .items-table th,
    .items-table td {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: left;
    }
    
    .items-table th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    
    .item-name {
      font-weight: 500;
    }
    
    .item-type {
      font-size: 10px;
      color: #666;
    }
    
    .summary-table {
      width: 100%;
      margin: 10px 0;
    }
    
    .summary-table td {
      padding: 4px 8px;
      border-bottom: 1px dotted #ccc;
    }
    
    .total-row {
      font-size: 14px;
      border-top: 2px solid #000 !important;
    }
    
    .total-row td {
      border-bottom: 2px solid #000;
      padding-top: 8px;
    }
    
    .voucher-code {
      font-size: 10px;
      color: #666;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .text-red {
      color: #dc2626;
    }
    
    .receipt-footer {
      text-align: center;
      margin-top: 30px;
      border-top: 1px solid #ccc;
      padding-top: 15px;
    }
    
    .print-date {
      font-size: 10px;
      color: #666;
      margin-top: 10px;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 15px;
      }
      
      .receipt-section {
        page-break-inside: avoid;
      }
    }
  `
}

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'CONFIRMED':
      return 'Confirmed'
    case 'COMPLETED':
      return 'Completed'
    default:
      return status
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Expose the print method to parent component
defineExpose({
  print
})
</script>

<style scoped>
.print-content {
  display: none;
}

@media print {
  .print-content {
    display: block;
  }
}
</style>