import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveValue(value: string | number | string[]): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeVisible(): R
      toBeChecked(): R
      toHaveClass(className: string): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toBe(expected: any): R
      toEqual(expected: any): R
      toHaveBeenCalled(): R
      toHaveBeenCalledWith(...args: any[]): R
    }

    interface Assertion {
      toBe(expected: any): Assertion
      toEqual(expected: any): Assertion
      toHaveBeenCalled(): Assertion
      toHaveBeenCalledWith(...args: any[]): Assertion
      not: Assertion
    }
  }
}
