<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h1 class="text-lg font-semibold text-gray-900">IP History</h1>
      <div class="flex items-center space-x-2">
        <div class="relative md:hidden" ref="mobileSortContainerRef">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md transition-colors"
            :class="
              hasActiveSort
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            "
            @click.stop="toggleMobileSortPanel"
            ref="mobileSortButtonRef"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M7 12h10M10 18h4"
              />
            </svg>
          </button>

          <transition name="fade">
            <div
              v-if="mobileSortOpen"
              class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-3 space-y-3"
              ref="mobileSortPanelRef"
            >
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="option in sortOptions"
                  :key="option.key"
                  class="border border-gray-200 rounded-md px-3 py-2 space-y-2"
                >
                  <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        :checked="isMobileSortSelected(option.key)"
                        @change.stop="toggleMobileSortOption(option.key)"
                      />
                      <span class="text-sm text-gray-700">{{ option.label }}</span>
                    </label>
                    <span v-if="isMobileSortSelected(option.key)" class="text-xs text-gray-500">
                      #{{ getMobileSortPosition(option.key) }}
                    </span>
                  </div>
                  <div v-if="isMobileSortSelected(option.key)" class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      class="px-2 py-1 text-xs font-medium rounded border"
                      :class="
                        getMobileSortOrder(option.key) === 'asc'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300'
                      "
                      @click.stop="setMobileSortOrder(option.key, 'asc')"
                    >
                      Ascending
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs font-medium rounded border"
                      :class="
                        getMobileSortOrder(option.key) === 'desc'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300'
                      "
                      @click.stop="setMobileSortOrder(option.key, 'desc')"
                    >
                      Descending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <button
          @click="multi"
          class="hidden md:inline-flex p-2 rounded transition-colors"
          :class="
            multiSort
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          "
          :title="multiSort ? 'Disable multi-sort' : 'Enable multi-sort'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h12M4 14h8M4 18h4"
            />
          </svg>
        </button>
        <button
          @click="reset"
          class="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title="Reset sorting"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="px-4 sm:px-6 py-6">
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th
                @click="sortBy('oldIp')"
                class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                :class="getSortHeaderClass('oldIp')"
              >
                <div class="flex items-center space-x-1">
                  <span>Old IP</span>
                  <span class="ml-1 text-xs">{{ getSortIndicator('oldIp') }}</span>
                </div>
              </th>

              <th
                @click="sortBy('newIp')"
                class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                :class="getSortHeaderClass('newIp')"
              >
                <div class="flex items-center space-x-1">
                  <span>New IP</span>
                  <span class="ml-1 text-xs">{{ getSortIndicator('newIp') }}</span>
                </div>
              </th>

              <th
                @click="sortBy('version')"
                class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                :class="getSortHeaderClass('version')"
              >
                <div class="flex items-center space-x-1">
                  <span>Version</span>
                  <span class="ml-1 text-xs">{{ getSortIndicator('version') }}</span>
                </div>
              </th>

              <th
                @click="sortBy('updated')"
                class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                :class="getSortHeaderClass('updated')"
              >
                <div class="flex items-center space-x-1">
                  <span>Updated</span>
                  <span class="ml-1 text-xs">{{ getSortIndicator('updated') }}</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <tr v-if="loading">
              <td colspan="4" class="py-12 px-4 text-center text-gray-500">
                <div class="flex justify-center">
                  <svg
                    class="animate-spin h-6 w-6 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </td>
            </tr>

            <tr v-else-if="histories.length === 0">
              <td colspan="4" class="py-12 px-4 text-center text-gray-500">
                No history records found
              </td>
            </tr>

            <tr
              v-else
              v-for="item in histories"
              :key="item.newIp"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-4 px-4 text-sm text-gray-900 font-mono" :title="item.oldIp || '-'">
                <div class="whitespace-pre-line break-all">
                  {{ (item.oldIp || '-').replace(/,/g, '\n') }}
                </div>
              </td>

              <td class="py-4 px-4 text-sm text-gray-900 font-mono" :title="item.newIp">
                <div class="whitespace-pre-line break-all">
                  {{ item.newIp.replace(/,/g, '\n') }}
                </div>
              </td>

              <td class="py-4 px-4 text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    item.version === 'V4'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  "
                >
                  {{ item.version }}
                </span>
              </td>

              <td class="py-4 px-4 text-sm text-gray-500" :title="item.updated">
                {{ item.updated }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden">
        <div v-if="loading" class="py-12 text-center text-gray-500">
          <div class="flex justify-center">
            <svg
              class="animate-spin h-6 w-6 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>

        <div v-else-if="histories.length === 0" class="py-12 text-center text-gray-500">
          No history records found
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in histories"
            :key="`${item.newIp}-${item.updated}`"
            class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3"
          >
            <div>
              <p class="text-xs uppercase text-gray-500">Old IP</p>
              <p class="mt-1 font-mono text-sm text-gray-900 whitespace-pre-line break-all">
                {{ (item.oldIp || '-').replace(/,/g, '\n') }}
              </p>
            </div>

            <div>
              <p class="text-xs uppercase text-gray-500">New IP</p>
              <p class="mt-1 font-mono text-sm text-gray-900 whitespace-pre-line break-all">
                {{ item.newIp.replace(/,/g, '\n') }}
              </p>
            </div>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="
                  item.version === 'V4'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                "
              >
                {{ item.version }}
              </span>
              <p class="text-sm text-gray-500" :title="item.updated">{{ item.updated }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && total > 0"
      class="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 mt-4 sm:mt-6"
    >
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, total) }} of {{ total }} results
        </div>

        <div class="flex items-center space-x-1">
          <button
            @click="goToPage(1)"
            :disabled="currentPage <= 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>

          <button
            @click="previousPage"
            :disabled="currentPage <= 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div class="flex space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium border rounded-md',
                page === currentPage
                  ? 'text-white bg-indigo-600 border-indigo-600 hover:bg-indigo-700'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>

          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage >= totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as history from '@/api/history'
import type { History, SortItem } from '@/types/history'
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'

const sortItems = ref<SortItem[]>([])
const loading = ref(true)
const total = ref(0)
const histories = ref<History[]>([])
const multiSort = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const sortOptions = [
  { key: 'oldIp', label: 'Old IP' },
  { key: 'newIp', label: 'New IP' },
  { key: 'version', label: 'Version' },
  { key: 'updated', label: 'Updated' },
]

const mobileSortOpen = ref(false)
const mobileSortOrder = ref<string[]>([])
const mobileSortDirections = ref<Record<string, 'asc' | 'desc'>>({})
const mobileSortButtonRef = ref<HTMLElement | null>(null)
const mobileSortPanelRef = ref<HTMLElement | null>(null)
const mobileSortContainerRef = ref<HTMLElement | null>(null)

const hasActiveSort = computed(() => sortItems.value.length > 0)

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

function multi() {
  multiSort.value = !multiSort.value

  if (!multiSort.value && sortItems.value.length > 1) {
    sortItems.value = sortItems.value.slice(0, 1)
    loadHistory()
  }
}

const isMobileSortSelected = (key: string) => mobileSortOrder.value.includes(key)

const getMobileSortOrder = (key: string) => mobileSortDirections.value[key] ?? 'asc'

const getMobileSortPosition = (key: string) => mobileSortOrder.value.indexOf(key) + 1

function applyMobileSort() {
  sortItems.value = mobileSortOrder.value.map((key) => ({
    key,
    order: mobileSortDirections.value[key] ?? 'asc',
  }))
  multiSort.value = sortItems.value.length > 1
  loadHistory()
}

function toggleMobileSortOption(key: string) {
  if (isMobileSortSelected(key)) {
    mobileSortOrder.value = mobileSortOrder.value.filter((item) => item !== key)
    const updatedDirections = { ...mobileSortDirections.value }
    delete updatedDirections[key]
    mobileSortDirections.value = updatedDirections
  } else {
    mobileSortOrder.value = [...mobileSortOrder.value, key]
    mobileSortDirections.value = { ...mobileSortDirections.value, [key]: 'asc' }
  }

  applyMobileSort()
}

function setMobileSortOrder(key: string, order: 'asc' | 'desc') {
  if (!isMobileSortSelected(key)) return
  if (getMobileSortOrder(key) === order) return

  mobileSortDirections.value = { ...mobileSortDirections.value, [key]: order }
  applyMobileSort()
}

function toggleMobileSortPanel() {
  mobileSortOpen.value = !mobileSortOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (!mobileSortOpen.value) return

  const targets = [
    mobileSortButtonRef.value,
    mobileSortPanelRef.value,
    mobileSortContainerRef.value,
  ].filter((el): el is HTMLElement => Boolean(el))

  const clickedInside = targets.some((el) => el.contains(event.target as Node))
  if (!clickedInside) {
    mobileSortOpen.value = false
  }
}

function reset() {
  sortItems.value = []
  loadHistory()
}

function sortBy(key: string) {
  if (!multiSort.value) {
    sortItems.value = sortItems.value.filter((item) => item.key === key)
  }

  const existingSort = sortItems.value.find((item) => item.key === key)
  if (existingSort) {
    if (existingSort.order === 'asc') {
      existingSort.order = 'desc'
    } else {
      sortItems.value = sortItems.value.filter((item) => item.key !== key)
    }
  } else {
    sortItems.value.push({ key, order: 'asc' })
  }

  loadHistory()
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadHistory()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadHistory()
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    loadHistory()
  }
}

function getSortHeaderClass(key: string) {
  const sortItem = sortItems.value.find((item) => item.key === key)
  if (sortItem) {
    return 'text-blue-600 bg-blue-50'
  }
  return 'text-gray-500'
}

function getSortIndicator(key: string) {
  const sortItem = sortItems.value.find((item) => item.key === key)
  if (sortItem) {
    const index = sortItems.value.findIndex((item) => item.key === key)
    const orderSymbol = sortItem.order === 'asc' ? '↑' : '↓'
    return multiSort.value && sortItems.value.length > 1
      ? `${orderSymbol}${index + 1}`
      : orderSymbol
  }
  return ''
}

async function loadHistory() {
  loading.value = true
  try {
    const result = await history.get(currentPage.value, itemsPerPage.value, sortItems.value)
    histories.value = result.histories
    total.value = result.total
  } catch (error) {
    console.error('Failed to load history:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHistory()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(
  sortItems,
  (items) => {
    mobileSortOrder.value = items.map((item) => item.key)
    mobileSortDirections.value = items.reduce<Record<string, 'asc' | 'desc'>>((acc, item) => {
      acc[item.key] = item.order
      return acc
    }, {})
  },
  { deep: true, immediate: true },
)
</script>
