import React from 'react';
import { UnitConverterEngine } from './UnitConverterEngine';
import { ToolItem } from '../data/categoriesAndTools';

export interface UnitConverterComponentProps {
  tool: ToolItem;
}

export function UnitConverterComponent({ tool }: UnitConverterComponentProps) {
  return <UnitConverterEngine tool={tool} />;
}

export default UnitConverterComponent;
