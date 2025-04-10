import { inject } from 'vue'

export const TooltipProviderContext = Symbol('TooltipProviderContext')

export interface TooltipProviderContextValue {
  delayDuration: number
}

export const useTooltipProvider = () => {
  const context = inject<TooltipProviderContextValue>(TooltipProviderContext)
  if (!context) {
    throw new Error('useTooltipProvider must be used within a TooltipProvider')
  }
  return context
} 