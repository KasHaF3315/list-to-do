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
    categories,
    clearCompleted,
    completedCount,
    activeCount,
    todos,
    isLoading
  } = useTodoStore()

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [debouncedSearchQuery] = useDebounce(localSearchQuery, 300)
  
  // Calculate statistics
  const total = todos.length
  const completed = completedCount()
  const active = activeCount()

  // Update search query when debounced value changes
  React.useEffect(() => {
    setSearchQuery(debouncedSearchQuery)
  }, [debouncedSearchQuery, setSearchQuery])

  const filterOptions: { key: TodoFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: total },
    { key: 'active', label: 'Active', count: active },
    { key: 'completed', label: 'Completed', count: completed },
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
      className="space-y-4 sm:space-y-6"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search todos..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 sm:py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 dark:placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-sm"
        />
        {localSearchQuery && (
          <button
            onClick={() => setLocalSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 p-1 min-h-[44px] sm:min-h-0 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Filter Tabs - Full width on mobile */}
        <div className="w-full">
          <div className="flex items-center justify-center bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1 w-full sm:w-auto">
            {filterOptions.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-[44px] sm:min-h-0 ${
                  filter === key
                    ? 'bg-white dark:bg-secondary-700 text-primary-600 shadow-sm'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200'
                }`}
              >
                <span className="block sm:inline">{label}</span>
                {count !== undefined && (
                  <span className="block sm:inline sm:ml-1 text-xs opacity-75">({count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 flex-1 sm:flex-none">
            <SortAsc className="h-4 w-4 text-secondary-400 flex-shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as TodoSort)}
              className="flex-1 sm:flex-none text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-3 py-2 min-h-[44px] sm:min-h-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <div className="flex items-center space-x-2 flex-1 sm:flex-none">
              <Filter className="h-4 w-4 text-secondary-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 sm:flex-none text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-3 py-2 min-h-[44px] sm:min-h-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories().map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Completed */}
          {completed > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompleted}
              className="w-full sm:w-auto sm:ml-auto min-h-[44px] sm:min-h-0"
            >
              <span className="sm:hidden">Clear {completed} Completed</span>
              <span className="hidden sm:inline">Clear Completed ({completed})</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || searchQuery) && (
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <span className="text-sm text-secondary-600 dark:text-secondary-400 flex-shrink-0">
            Active filters:
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('')}
                  className="ml-2 hover:text-primary-600 p-1 min-h-[24px] min-w-[24px] flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                Search: &quot;{searchQuery}&quot;
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setLocalSearchQuery('')
                  }}
                  className="ml-2 hover:text-primary-600 p-1 min-h-[24px] min-w-[24px] flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default FilterBar
