'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, SortAsc, X } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useTodoStore } from '@/store/todoStore'
import { TodoFilter, TodoSort } from '@/types'
import Button from '../ui/Button'

const FilterBar = () => {
  const {
    filter,
    sort,
    searchQuery,
    selectedCategory,
    setFilter,
    setSort,
    setSearchQuery,
    setSelectedCategory,
    getCategories,
    clearCompleted,
    getStats,
  } = useTodoStore()

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [debouncedSearchQuery] = useDebounce(localSearchQuery, 300)

  const categories = getCategories()
  const stats = getStats()

  // Update search query when debounced value changes
  React.useEffect(() => {
    setSearchQuery(debouncedSearchQuery)
  }, [debouncedSearchQuery, setSearchQuery])

  const filterOptions: { key: TodoFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'active', label: 'Active', count: stats.active },
    { key: 'completed', label: 'Completed', count: stats.completed },
  ]

  const sortOptions: { key: TodoSort; label: string }[] = [
    { key: 'created', label: 'Created Date' },
    { key: 'updated', label: 'Updated Date' },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due Date' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search todos..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 dark:placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {localSearchQuery && (
          <button
            onClick={() => setLocalSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
          {filterOptions.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === key
                  ? 'bg-white dark:bg-secondary-700 text-primary-600 shadow-sm'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200'
              }`}
            >
              {label}
              {count !== undefined && (
                <span className="ml-1 text-xs opacity-75">({count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <SortAsc className="h-4 w-4 text-secondary-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as TodoSort)}
            className="text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {sortOptions.map(({ key, label }) => (
              <option key={key} value={key}>
                Sort by {label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-secondary-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Clear Completed */}
        {stats.completed > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearCompleted}
            className="ml-auto"
          >
            Clear Completed ({stats.completed})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || searchQuery) && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            Active filters:
          </span>
          {selectedCategory && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory('')}
                className="ml-1 hover:text-primary-600"
              >
                <X size={10} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
              Search: "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery('')
                  setLocalSearchQuery('')
                }}
                className="ml-1 hover:text-primary-600"
              >
                <X size={10} />
              </button>
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default FilterBar
