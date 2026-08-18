/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { runCalculation, DEFAULT_INPUTS } from "../utils/calculatorLogic";

export interface FieldValidationRule<TValue = any, TInputs = Record<string, any>> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: TValue, inputs: TInputs) => string | null | undefined;
  message?: string;
}

export type ValidationSchema<TInputs extends Record<string, any>> = {
  [K in keyof TInputs]?: FieldValidationRule<TInputs[K], TInputs>;
};

export interface UseToolEngineOptions<TInputs extends Record<string, any>, TResult = any> {
  toolId?: string;
  initialInputs?: TInputs;
  validationSchema?: ValidationSchema<TInputs>;
  calculateFn?: (inputs: TInputs) => TResult;
  autoCalculate?: boolean;
  debounceMs?: number;
}

export interface FieldMeta {
  error: string | undefined;
  hasError: boolean;
}

export interface InputFieldProps {
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | any) => void;
  onBlur: () => void;
}

export interface UseToolEngineReturn<TInputs extends Record<string, any>, TResult = any> {
  inputs: TInputs;
  errors: Partial<Record<keyof TInputs, string>>;
  calculationError: string | null;
  isCalculating: boolean;
  result: TResult | null;
  isValid: boolean;
  
  // Actions
  updateInput: <K extends keyof TInputs>(key: K, value: TInputs[K]) => void;
  updateInputs: (newInputs: Partial<TInputs>) => void;
  setInputs: (newInputs: React.SetStateAction<TInputs>) => void;
  resetInputs: () => void;
  validateField: (key: keyof TInputs, valueOverride?: any) => string | null;
  validateAll: (inputsToValidate?: TInputs) => boolean;
  calculate: () => TResult | null;
  
  // Helpers & Form binding
  getInputProps: (key: keyof TInputs) => InputFieldProps;
  getFieldMeta: (key: keyof TInputs) => FieldMeta;
  
  // Formatting & Export utilities
  formatCurrency: (amount: number, currencySymbol?: string) => string;
  formatPercent: (val: number, decimals?: number) => string;
  formatNumber: (val: number, decimals?: number) => string;
  getExportSummary: (toolTitle?: string) => {
    timestamp: string;
    toolTitle: string;
    inputs: TInputs;
    result: TResult | null;
  };
}

/**
 * Custom hook providing standardized input management, schema validation,
 * real-time calculation execution, and error handling across all calculators.
 */
export function useToolEngine<TInputs extends Record<string, any>, TResult = any>(
  options: UseToolEngineOptions<TInputs, TResult>
): UseToolEngineReturn<TInputs, TResult> {
  const {
    toolId,
    initialInputs,
    autoCalculate = true,
  } = options;

  // Ref to hold options so function identity shifts in options don't trigger infinite render loops
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  // Resolve initial inputs fallback from DEFAULT_INPUTS if toolId is supplied
  const resolvedInitialInputs = useMemo(() => {
    if (initialInputs) return initialInputs;
    if (toolId && DEFAULT_INPUTS[toolId]) {
      return DEFAULT_INPUTS[toolId] as TInputs;
    }
    return {} as TInputs;
  }, [initialInputs, toolId]);

  const [inputs, setInputsState] = useState<TInputs>(resolvedInitialInputs);
  const [errors, setErrors] = useState<Partial<Record<keyof TInputs, string>>>({});
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<TResult | null>(null);

  // Custom setInputs with shallow equality check to prevent infinite re-renders
  const setInputs = useCallback((newInputs: React.SetStateAction<TInputs>) => {
    setInputsState((prev) => {
      const next = typeof newInputs === "function" ? (newInputs as any)(prev) : newInputs;
      if (prev === next) return prev;
      if (prev && next && typeof prev === "object" && typeof next === "object") {
        const prevKeys = Object.keys(prev);
        const nextKeys = Object.keys(next);
        if (
          prevKeys.length === nextKeys.length &&
          prevKeys.every((k) => (prev as any)[k] === (next as any)[k])
        ) {
          return prev;
        }
      }
      return next;
    });
  }, []);

  // Field validator function
  const validateField = useCallback(
    (key: keyof TInputs, valueOverride?: any): string | null => {
      const schema = optionsRef.current.validationSchema || {};
      const rule = (schema as Record<keyof TInputs, FieldValidationRule | undefined>)[key];
      if (!rule) return null;

      const val = valueOverride !== undefined ? valueOverride : inputs[key];

      if (rule.required && (val === undefined || val === null || val === "" || (typeof val === "number" && isNaN(val)))) {
        return rule.message || `${String(key)} is required.`;
      }

      if (typeof val === "number") {
        if (rule.min !== undefined && val < rule.min) {
          return rule.message || `${String(key)} must be at least ${rule.min}.`;
        }
        if (rule.max !== undefined && val > rule.max) {
          return rule.message || `${String(key)} cannot exceed ${rule.max}.`;
        }
      }

      if (typeof val === "string" && rule.pattern) {
        if (!rule.pattern.test(val)) {
          return rule.message || `${String(key)} format is invalid.`;
        }
      }

      if (rule.custom) {
        const customErr = rule.custom(val, inputs);
        if (customErr) return customErr;
      }

      return null;
    },
    [inputs]
  );

  // Validate all fields
  const validateAll = useCallback(
    (inputsToValidate?: TInputs): boolean => {
      const schema = optionsRef.current.validationSchema || {};
      const currentInputs = inputsToValidate || inputs;
      const newErrors: Partial<Record<keyof TInputs, string>> = {};
      let valid = true;

      for (const key of Object.keys(schema) as (keyof TInputs)[]) {
        const rule = (schema as Record<keyof TInputs, FieldValidationRule | undefined>)[key];
        if (!rule) continue;

        const val = currentInputs[key];

        if (rule.required && (val === undefined || val === null || val === "" || (typeof val === "number" && isNaN(val)))) {
          newErrors[key] = rule.message || `${String(key)} is required.`;
          valid = false;
          continue;
        }

        if (typeof val === "number") {
          if (rule.min !== undefined && val < rule.min) {
            newErrors[key] = rule.message || `${String(key)} must be at least ${rule.min}.`;
            valid = false;
            continue;
          }
          if (rule.max !== undefined && val > rule.max) {
            newErrors[key] = rule.message || `${String(key)} cannot exceed ${rule.max}.`;
            valid = false;
            continue;
          }
        }

        if (typeof val === "string" && rule.pattern) {
          if (!rule.pattern.test(val)) {
            newErrors[key] = rule.message || `${String(key)} format is invalid.`;
            valid = false;
            continue;
          }
        }

        if (rule.custom) {
          const customErr = rule.custom(val, currentInputs);
          if (customErr) {
            newErrors[key] = customErr;
            valid = false;
          }
        }
      }

      setErrors((prevErrors) => {
        const prevKeys = Object.keys(prevErrors);
        const newKeys = Object.keys(newErrors);
        if (
          prevKeys.length === newKeys.length &&
          prevKeys.every((k) => (prevErrors as any)[k] === (newErrors as any)[k])
        ) {
          return prevErrors;
        }
        return newErrors;
      });

      return valid;
    },
    [inputs]
  );

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Core calculation function
  const calculate = useCallback((): TResult | null => {
    setIsCalculating(true);
    setCalculationError(null);

    try {
      const isInputValid = validateAll();
      if (!isInputValid) {
        setCalculationError("Please correct input validation errors before calculating.");
        setIsCalculating(false);
        return null;
      }

      let calcOutput: any = null;

      const { calculateFn, toolId: currentToolId } = optionsRef.current;

      if (calculateFn) {
        calcOutput = calculateFn(inputs);
      } else if (currentToolId) {
        calcOutput = runCalculation(currentToolId, inputs);
      } else {
        throw new Error("Neither toolId nor calculateFn was provided to useToolEngine.");
      }

      // Check if output contains invalid numeric values (NaN or Infinite)
      if (typeof calcOutput === "number") {
        if (isNaN(calcOutput) || !isFinite(calcOutput)) {
          throw new Error("Calculation returned an invalid numeric value.");
        }
      } else if (calcOutput && typeof calcOutput === "object") {
        for (const [k, v] of Object.entries(calcOutput)) {
          if (typeof v === "number" && (isNaN(v) || !isFinite(v))) {
            throw new Error(`Invalid calculation result in field '${k}'.`);
          }
        }
      }

      setResult((prevResult) => {
        if (prevResult === calcOutput) return prevResult;
        if (
          typeof prevResult === "object" &&
          typeof calcOutput === "object" &&
          prevResult !== null &&
          calcOutput !== null &&
          JSON.stringify(prevResult) === JSON.stringify(calcOutput)
        ) {
          return prevResult;
        }
        return calcOutput as TResult;
      });

      setIsCalculating(false);
      return calcOutput as TResult;
    } catch (err: any) {
      const errMsg = err?.message || "An unexpected error occurred during calculation.";
      setCalculationError(errMsg);
      setIsCalculating(false);
      return null;
    }
  }, [inputs, validateAll]);

  // Handle single input update
  const updateInput = useCallback(
    <K extends keyof TInputs>(key: K, value: TInputs[K]) => {
      setInputsState((prev) => {
        const next = { ...prev, [key]: value };
        
        // Clear field error if valid
        const err = validateField(key, value);
        setErrors((prevErrs) => {
          const newErrs = { ...prevErrs };
          if (err) {
            newErrs[key] = err;
          } else {
            delete newErrs[key];
          }
          return newErrs;
        });

        return next;
      });
    },
    [validateField]
  );

  // Handle multi-input updates
  const updateInputs = useCallback((newInputs: Partial<TInputs>) => {
    setInputsState((prev) => ({ ...prev, ...newInputs }));
  }, []);

  // Reset inputs to initial values
  const resetInputs = useCallback(() => {
    setInputsState(resolvedInitialInputs);
    setErrors({});
    setCalculationError(null);
  }, [resolvedInitialInputs]);

  // Form field binding generator
  const getInputProps = useCallback(
    (key: keyof TInputs): InputFieldProps => ({
      name: String(key),
      value: inputs[key] ?? "",
      onChange: (e: any) => {
        const val = e && e.target ? (e.target.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value) : e;
        updateInput(key, val);
      },
      onBlur: () => {
        const err = validateField(key);
        setErrors((prev) => {
          const next = { ...prev };
          if (err) next[key] = err;
          else delete next[key];
          return next;
        });
      },
    }),
    [inputs, updateInput, validateField]
  );

  const getFieldMeta = useCallback(
    (key: keyof TInputs): FieldMeta => ({
      error: errors[key],
      hasError: Boolean(errors[key]),
    }),
    [errors]
  );

  // Auto-calculate trigger on inputs change
  useEffect(() => {
    if (autoCalculate) {
      calculate();
    }
  }, [inputs, autoCalculate, calculate]);

  // Formatting utility methods
  const formatCurrency = useCallback((amount: number, currencySymbol: string = "₹"): string => {
    if (isNaN(amount) || !isFinite(amount)) return `${currencySymbol}0`;
    return `${currencySymbol}${Math.round(amount).toLocaleString("en-IN")}`;
  }, []);

  const formatPercent = useCallback((val: number, decimals: number = 2): string => {
    if (isNaN(val) || !isFinite(val)) return "0%";
    return `${val.toFixed(decimals)}%`;
  }, []);

  const formatNumber = useCallback((val: number, decimals: number = 2): string => {
    if (isNaN(val) || !isFinite(val)) return "0";
    return val.toLocaleString("en-IN", { maximumFractionDigits: decimals });
  }, []);

  const getExportSummary = useCallback(
    (toolTitle: string = toolId || "Calculator") => ({
      timestamp: new Date().toISOString(),
      toolTitle,
      inputs,
      result,
    }),
    [inputs, result, toolId]
  );

  return {
    inputs,
    errors,
    calculationError,
    isCalculating,
    result,
    isValid,
    updateInput,
    updateInputs,
    setInputs,
    resetInputs,
    validateField,
    validateAll,
    calculate,
    getInputProps,
    getFieldMeta,
    formatCurrency,
    formatPercent,
    formatNumber,
    getExportSummary,
  };
}

