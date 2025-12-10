'use client'

import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react'
import { Button } from './button'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ 
  title = 'Something went wrong',
  message, 
  onRetry,
  className = ""
}: ErrorMessageProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangleIcon className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-ink-800 mb-2">
        {title}
      </h3>
      
      <p className="text-ink-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCwIcon className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  )
}