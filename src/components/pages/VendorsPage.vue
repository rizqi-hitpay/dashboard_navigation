<template>
  <div class="h-full overflow-y-auto bg-white" style="padding: 24px 28px;">
    <div class="flex items-center justify-between shrink-0 mb-5">
      <h1 class="text-[18px] font-medium text-[#03102f]">Vendors</h1>
      <button
        class="flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#2364dd] text-white text-[13px] font-medium transition-colors duration-150 hover:bg-[#1c54bd]"
      >
        + Add Vendor
      </button>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div
        v-for="vendor in vendors"
        :key="vendor.id"
        class="rounded-lg border border-[#E5E6EA] p-4 transition-shadow duration-150 hover:shadow-[0px_3px_22px_0px_rgba(37,41,49,0.08)] cursor-pointer"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="flex items-center justify-center w-9 h-9 rounded-full text-[13px] font-medium text-white shrink-0"
            :style="{ background: vendor.color }"
          >{{ vendor.initials }}</div>
          <div class="min-w-0">
            <p class="text-[13px] font-medium text-[#03102f] truncate">{{ vendor.name }}</p>
            <p class="text-[12px] text-[#61667c] truncate">{{ vendor.category }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[12px] text-[#61667c]">{{ vendor.bills }} bills</span>
          <span class="text-[13px] font-medium text-[#03102f]">{{ vendor.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const vendors = [
  { id: 1, name: 'Acme Supplies', category: 'Office supplies', initials: 'AS', color: '#2364dd', bills: 12, total: 'SGD 14,200' },
  { id: 2, name: 'Cloudline Hosting', category: 'Software', initials: 'CH', color: '#1b8a4b', bills: 6, total: 'SGD 2,880' },
  { id: 3, name: 'Bright Office Co.', category: 'Facilities', initials: 'BO', color: '#b25e09', bills: 9, total: 'SGD 9,640' },
  { id: 4, name: 'Northwind Logistics', category: 'Shipping', initials: 'NL', color: '#7b3fbf', bills: 4, total: 'SGD 3,920' },
  { id: 5, name: 'Pixel Studio', category: 'Marketing', initials: 'PS', color: '#c0392b', bills: 3, total: 'SGD 5,400' },
  { id: 6, name: 'Harbor Legal', category: 'Professional', initials: 'HL', color: '#0f6e8c', bills: 2, total: 'SGD 7,200' },
]
</script>
