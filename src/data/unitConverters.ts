import { ToolItem } from './categoriesAndTools';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratioToBase: number; // multiplier relative to base unit (or custom fn for temperature)
}

export interface UnitCategorySpec {
  id: string;
  name: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const UNIT_CONVERSION_SPECS: Record<string, UnitCategorySpec> = {
  length: {
    id: 'length',
    name: 'Length & Distance',
    baseUnit: 'meter',
    units: [
      { id: 'meter', name: 'Meters', symbol: 'm', ratioToBase: 1 },
      { id: 'kilometer', name: 'Kilometers', symbol: 'km', ratioToBase: 1000 },
      { id: 'centimeter', name: 'Centimeters', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'millimeter', name: 'Millimeters', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'micrometer', name: 'Micrometers', symbol: 'μm', ratioToBase: 1e-6 },
      { id: 'nanometer', name: 'Nanometers', symbol: 'nm', ratioToBase: 1e-9 },
      { id: 'mile', name: 'Miles', symbol: 'mi', ratioToBase: 1609.344 },
      { id: 'yard', name: 'Yards', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'foot', name: 'Feet', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'inch', name: 'Inches', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'nautical_mile', name: 'Nautical Miles', symbol: 'nmi', ratioToBase: 1852 }
    ]
  },
  mass: {
    id: 'mass',
    name: 'Weight & Mass',
    baseUnit: 'kilogram',
    units: [
      { id: 'kilogram', name: 'Kilograms', symbol: 'kg', ratioToBase: 1 },
      { id: 'gram', name: 'Grams', symbol: 'g', ratioToBase: 0.001 },
      { id: 'milligram', name: 'Milligrams', symbol: 'mg', ratioToBase: 1e-6 },
      { id: 'metric_ton', name: 'Metric Tons', symbol: 't', ratioToBase: 1000 },
      { id: 'pound', name: 'Pounds', symbol: 'lb', ratioToBase: 0.45359237 },
      { id: 'ounce', name: 'Ounces', symbol: 'oz', ratioToBase: 0.028349523125 },
      { id: 'stone', name: 'Stones', symbol: 'st', ratioToBase: 6.35029318 },
      { id: 'us_ton', name: 'US Short Tons', symbol: 'ton', ratioToBase: 907.18474 }
    ]
  },
  area: {
    id: 'area',
    name: 'Area & Land Measurement',
    baseUnit: 'sq_meter',
    units: [
      { id: 'sq_meter', name: 'Square Meters', symbol: 'm²', ratioToBase: 1 },
      { id: 'sq_kilometer', name: 'Square Kilometers', symbol: 'km²', ratioToBase: 1e6 },
      { id: 'sq_centimeter', name: 'Square Centimeters', symbol: 'cm²', ratioToBase: 0.0001 },
      { id: 'sq_foot', name: 'Square Feet', symbol: 'ft²', ratioToBase: 0.09290304 },
      { id: 'sq_yard', name: 'Square Yards', symbol: 'yd²', ratioToBase: 0.83612736 },
      { id: 'sq_mile', name: 'Square Miles', symbol: 'mi²', ratioToBase: 2589988.110336 },
      { id: 'acre', name: 'Acres', symbol: 'ac', ratioToBase: 4046.8564224 },
      { id: 'hectare', name: 'Hectares', symbol: 'ha', ratioToBase: 10000 }
    ]
  },
  volume: {
    id: 'volume',
    name: 'Volume & Liquid Capacity',
    baseUnit: 'liter',
    units: [
      { id: 'liter', name: 'Liters', symbol: 'L', ratioToBase: 1 },
      { id: 'milliliter', name: 'Milliliters', symbol: 'mL', ratioToBase: 0.001 },
      { id: 'cubic_meter', name: 'Cubic Meters', symbol: 'm³', ratioToBase: 1000 },
      { id: 'cubic_centimeter', name: 'Cubic Centimeters', symbol: 'cm³', ratioToBase: 0.001 },
      { id: 'cubic_foot', name: 'Cubic Feet', symbol: 'ft³', ratioToBase: 28.316846592 },
      { id: 'cubic_inch', name: 'Cubic Inches', symbol: 'in³', ratioToBase: 0.016387064 },
      { id: 'us_gallon', name: 'US Gallons', symbol: 'gal', ratioToBase: 3.785411784 },
      { id: 'us_quart', name: 'US Quarts', symbol: 'qt', ratioToBase: 0.946352946 },
      { id: 'us_pint', name: 'US Pints', symbol: 'pt', ratioToBase: 0.473176473 },
      { id: 'us_cup', name: 'US Cups', symbol: 'cup', ratioToBase: 0.2365882365 },
      { id: 'us_fl_oz', name: 'US Fluid Ounces', symbol: 'fl oz', ratioToBase: 0.0295735295625 }
    ]
  },
  data_storage: {
    id: 'data_storage',
    name: 'Data Storage & Digital Bandwidth',
    baseUnit: 'byte',
    units: [
      { id: 'byte', name: 'Bytes', symbol: 'B', ratioToBase: 1 },
      { id: 'kilobyte', name: 'Kilobytes', symbol: 'KB', ratioToBase: 1024 },
      { id: 'megabyte', name: 'Megabytes', symbol: 'MB', ratioToBase: 1048576 },
      { id: 'gigabyte', name: 'Gigabytes', symbol: 'GB', ratioToBase: 1073741824 },
      { id: 'terabyte', name: 'Terabytes', symbol: 'TB', ratioToBase: 1099511627776 },
      { id: 'petabyte', name: 'Petabytes', symbol: 'PB', ratioToBase: 1125899906842624 },
      { id: 'bit', name: 'Bits', symbol: 'b', ratioToBase: 0.125 },
      { id: 'kilobit', name: 'Kilobits', symbol: 'Kb', ratioToBase: 128 },
      { id: 'megabit', name: 'Megabits', symbol: 'Mb', ratioToBase: 131072 },
      { id: 'gigabit', name: 'Gigabits', symbol: 'Gb', ratioToBase: 134217728 }
    ]
  },
  speed: {
    id: 'speed',
    name: 'Speed & Velocity',
    baseUnit: 'm_per_s',
    units: [
      { id: 'm_per_s', name: 'Meters per second', symbol: 'm/s', ratioToBase: 1 },
      { id: 'km_per_h', name: 'Kilometers per hour', symbol: 'km/h', ratioToBase: 0.2777777777777778 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', ratioToBase: 0.44704 },
      { id: 'knot', name: 'Knots', symbol: 'kn', ratioToBase: 0.5144444444444444 },
      { id: 'ft_per_s', name: 'Feet per second', symbol: 'ft/s', ratioToBase: 0.3048 },
      { id: 'mach', name: 'Mach (Speed of Sound)', symbol: 'Mach', ratioToBase: 343 },
      { id: 'speed_of_light', name: 'Speed of Light', symbol: 'c', ratioToBase: 299792458 }
    ]
  },
  temperature: {
    id: 'temperature',
    name: 'Temperature Scale',
    baseUnit: 'celsius',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C', ratioToBase: 1 },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1 },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K', ratioToBase: 1 },
      { id: 'rankine', name: 'Rankine', symbol: '°R', ratioToBase: 1 }
    ]
  },
  pressure: {
    id: 'pressure',
    name: 'Pressure & Stress',
    baseUnit: 'pascal',
    units: [
      { id: 'pascal', name: 'Pascals', symbol: 'Pa', ratioToBase: 1 },
      { id: 'kilopascal', name: 'Kilopascals', symbol: 'kPa', ratioToBase: 1000 },
      { id: 'megapascal', name: 'Megapascals', symbol: 'MPa', ratioToBase: 1e6 },
      { id: 'bar', name: 'Bar', symbol: 'bar', ratioToBase: 100000 },
      { id: 'psi', name: 'Pounds per sq inch', symbol: 'PSI', ratioToBase: 6894.757293168 },
      { id: 'atmosphere', name: 'Standard Atmospheres', symbol: 'atm', ratioToBase: 101325 },
      { id: 'torr', name: 'Torr / mmHg', symbol: 'Torr', ratioToBase: 133.322368421 }
    ]
  },
  time: {
    id: 'time',
    name: 'Time & Duration',
    baseUnit: 'second',
    units: [
      { id: 'second', name: 'Seconds', symbol: 's', ratioToBase: 1 },
      { id: 'millisecond', name: 'Milliseconds', symbol: 'ms', ratioToBase: 0.001 },
      { id: 'microsecond', name: 'Microseconds', symbol: 'μs', ratioToBase: 1e-6 },
      { id: 'minute', name: 'Minutes', symbol: 'min', ratioToBase: 60 },
      { id: 'hour', name: 'Hours', symbol: 'hr', ratioToBase: 3600 },
      { id: 'day', name: 'Days', symbol: 'd', ratioToBase: 86400 },
      { id: 'week', name: 'Weeks', symbol: 'wk', ratioToBase: 604800 },
      { id: 'month', name: 'Months (30d)', symbol: 'mo', ratioToBase: 2592000 },
      { id: 'year', name: 'Years (365d)', symbol: 'yr', ratioToBase: 31536000 }
    ]
  },
  energy: {
    id: 'energy',
    name: 'Energy & Work',
    baseUnit: 'joule',
    units: [
      { id: 'joule', name: 'Joules', symbol: 'J', ratioToBase: 1 },
      { id: 'kilojoule', name: 'Kilojoules', symbol: 'kJ', ratioToBase: 1000 },
      { id: 'calorie', name: 'Calories (cal)', symbol: 'cal', ratioToBase: 4.184 },
      { id: 'kilocalorie', name: 'Kilocalories (kcal)', symbol: 'kcal', ratioToBase: 4184 },
      { id: 'watt_hour', name: 'Watt-hours', symbol: 'Wh', ratioToBase: 3600 },
      { id: 'kilowatt_hour', name: 'Kilowatt-hours', symbol: 'kWh', ratioToBase: 3.6e6 },
      { id: 'btu', name: 'British Thermal Units', symbol: 'BTU', ratioToBase: 1055.05585262 },
      { id: 'electronvolt', name: 'Electronvolts', symbol: 'eV', ratioToBase: 1.602176634e-19 },
      { id: 'foot_pound', name: 'Foot-pounds', symbol: 'ft-lbf', ratioToBase: 1.3558179483314004 }
    ]
  },
  power: {
    id: 'power',
    name: 'Power & Wattage',
    baseUnit: 'watt',
    units: [
      { id: 'watt', name: 'Watts', symbol: 'W', ratioToBase: 1 },
      { id: 'kilowatt', name: 'Kilowatts', symbol: 'kW', ratioToBase: 1000 },
      { id: 'megawatt', name: 'Megawatts', symbol: 'MW', ratioToBase: 1e6 },
      { id: 'horsepower_metric', name: 'Horsepower (Metric)', symbol: 'hp(M)', ratioToBase: 735.49875 },
      { id: 'horsepower_imperial', name: 'Horsepower (Imperial)', symbol: 'hp(I)', ratioToBase: 745.6998715822702 },
      { id: 'btu_per_hour', name: 'BTU per Hour', symbol: 'BTU/h', ratioToBase: 0.29307107 },
      { id: 'cal_per_second', name: 'Calories per second', symbol: 'cal/s', ratioToBase: 4.184 }
    ]
  },
  force: {
    id: 'force',
    name: 'Force & Mechanical Load',
    baseUnit: 'newton',
    units: [
      { id: 'newton', name: 'Newtons', symbol: 'N', ratioToBase: 1 },
      { id: 'kilonewton', name: 'Kilonewtons', symbol: 'kN', ratioToBase: 1000 },
      { id: 'pound_force', name: 'Pound-force', symbol: 'lbf', ratioToBase: 4.4482216152605 },
      { id: 'dyne', name: 'Dynes', symbol: 'dyn', ratioToBase: 1e-5 },
      { id: 'kilogram_force', name: 'Kilogram-force', symbol: 'kgf', ratioToBase: 9.80665 },
      { id: 'ounce_force', name: 'Ounce-force', symbol: 'ozf', ratioToBase: 0.2780138509537812 }
    ]
  },
  density: {
    id: 'density',
    name: 'Mass Density',
    baseUnit: 'kg_per_m3',
    units: [
      { id: 'kg_per_m3', name: 'Kilograms per cubic meter', symbol: 'kg/m³', ratioToBase: 1 },
      { id: 'g_per_cm3', name: 'Grams per cubic centimeter', symbol: 'g/cm³', ratioToBase: 1000 },
      { id: 'g_per_ml', name: 'Grams per milliliter', symbol: 'g/mL', ratioToBase: 1000 },
      { id: 'lb_per_ft3', name: 'Pounds per cubic foot', symbol: 'lb/ft³', ratioToBase: 16.01846337396 },
      { id: 'lb_per_in3', name: 'Pounds per cubic inch', symbol: 'lb/in³', ratioToBase: 27679.90471019 }
    ]
  },
  angle: {
    id: 'angle',
    name: 'Angle & Plane Geometry',
    baseUnit: 'degree',
    units: [
      { id: 'degree', name: 'Degrees', symbol: '°', ratioToBase: 1 },
      { id: 'radian', name: 'Radians', symbol: 'rad', ratioToBase: 57.29577951308232 },
      { id: 'gradian', name: 'Gradians', symbol: 'grad', ratioToBase: 0.9 },
      { id: 'arcminute', name: 'Arcminutes', symbol: '′', ratioToBase: 1 / 60 },
      { id: 'arcsecond', name: 'Arcseconds', symbol: '″', ratioToBase: 1 / 3600 },
      { id: 'revolution', name: 'Revolutions / Turns', symbol: 'rev', ratioToBase: 360 }
    ]
  },
  frequency: {
    id: 'frequency',
    name: 'Frequency & Oscillations',
    baseUnit: 'hertz',
    units: [
      { id: 'hertz', name: 'Hertz', symbol: 'Hz', ratioToBase: 1 },
      { id: 'kilohertz', name: 'Kilohertz', symbol: 'kHz', ratioToBase: 1000 },
      { id: 'megahertz', name: 'Megahertz', symbol: 'MHz', ratioToBase: 1e6 },
      { id: 'gigahertz', name: 'Gigahertz', symbol: 'GHz', ratioToBase: 1e9 },
      { id: 'rpm', name: 'Revolutions per minute', symbol: 'RPM', ratioToBase: 1 / 60 },
      { id: 'rad_per_sec', name: 'Radians per second', symbol: 'rad/s', ratioToBase: 0.15915494309189535 }
    ]
  }
};

/**
 * Universal Unit Converter Logic
 */
export function convertUnitValue(
  categoryKey: string,
  value: number,
  fromUnitId: string,
  toUnitId: string
): {
  result: number;
  formula: string;
  fromSymbol: string;
  toSymbol: string;
  breakdown: Record<string, number>;
} {
  const spec = UNIT_CONVERSION_SPECS[categoryKey];
  if (!spec) {
    return { result: value, formula: 'Direct value', fromSymbol: '', toSymbol: '', breakdown: {} };
  }

  const fromDef = spec.units.find(u => u.id === fromUnitId) || spec.units[0];
  const toDef = spec.units.find(u => u.id === toUnitId) || spec.units[1] || spec.units[0];

  let result = 0;
  let formula = '';

  // Special handling for Temperature scales
  if (categoryKey === 'temperature') {
    // Convert to Celsius first
    let celsiusVal = value;
    if (fromDef.id === 'fahrenheit') celsiusVal = (value - 32) * (5 / 9);
    else if (fromDef.id === 'kelvin') celsiusVal = value - 273.15;
    else if (fromDef.id === 'rankine') celsiusVal = (value - 491.67) * (5 / 9);

    // Convert from Celsius to target
    if (toDef.id === 'celsius') result = celsiusVal;
    else if (toDef.id === 'fahrenheit') result = celsiusVal * (9 / 5) + 32;
    else if (toDef.id === 'kelvin') result = celsiusVal + 273.15;
    else if (toDef.id === 'rankine') result = (celsiusVal + 273.15) * (9 / 5);

    formula = `${value} ${fromDef.symbol} → ${result.toFixed(4)} ${toDef.symbol}`;
  } else {
    // Standard Ratio-to-Base conversion
    const baseValue = value * fromDef.ratioToBase;
    result = baseValue / toDef.ratioToBase;
    formula = `1 ${fromDef.symbol} = ${(fromDef.ratioToBase / toDef.ratioToBase).toPrecision(6)} ${toDef.symbol}`;
  }

  // Generate complete conversion table breakdown for all units in category
  const breakdown: Record<string, number> = {};
  spec.units.forEach(u => {
    if (categoryKey === 'temperature') {
      let cVal = value;
      if (fromDef.id === 'fahrenheit') cVal = (value - 32) * (5 / 9);
      else if (fromDef.id === 'kelvin') cVal = value - 273.15;
      else if (fromDef.id === 'rankine') cVal = (value - 491.67) * (5 / 9);

      if (u.id === 'celsius') breakdown[u.name] = Number(cVal.toFixed(4));
      else if (u.id === 'fahrenheit') breakdown[u.name] = Number((cVal * (9 / 5) + 32).toFixed(4));
      else if (u.id === 'kelvin') breakdown[u.name] = Number((cVal + 273.15).toFixed(4));
      else if (u.id === 'rankine') breakdown[u.name] = Number(((cVal + 273.15) * (9 / 5)).toFixed(4));
    } else {
      const baseValue = value * fromDef.ratioToBase;
      const converted = baseValue / u.ratioToBase;
      breakdown[u.name] = Number(converted.toPrecision(8));
    }
  });

  return {
    result: Number(result.toPrecision(8)),
    formula,
    fromSymbol: fromDef.symbol,
    toSymbol: toDef.symbol,
    breakdown
  };
}

/**
 * 15 Unique High-Utility Unit Converter Tools Catalog Entries
 */
export const UNIT_CONVERTER_TOOLS: ToolItem[] = [
  {
    id: 'tool_unit_length',
    slug: 'length-unit-converter',
    number: 'UC-01',
    name: 'Length & Distance Unit Converter',
    description: 'Convert between meters, kilometers, miles, feet, inches, yards, millimeters, and nautical miles with high-precision ratios.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isPopular: true,
    isTrending: true,
    freeAlternativeTo: 'Google Unit Converter / ConvertUnits',
    tags: ['length converter', 'meters to feet', 'miles to km', 'inches to cm', 'distance calculator'],
    interactiveType: 'unit-converter',
    rating: 4.9,
    useCount: '240.5k'
  },
  {
    id: 'tool_unit_mass',
    slug: 'weight-mass-unit-converter',
    number: 'UC-02',
    name: 'Weight & Mass Unit Converter',
    description: 'Instant conversion between kilograms, grams, milligrams, pounds, ounces, stones, and metric tons.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isPopular: true,
    isTrending: true,
    freeAlternativeTo: 'Metric Conversions Pro',
    tags: ['weight converter', 'kg to lbs', 'grams to ounces', 'mass conversion', 'stone to kg'],
    interactiveType: 'unit-converter',
    rating: 4.9,
    useCount: '215.1k'
  },
  {
    id: 'tool_unit_area',
    slug: 'area-unit-converter',
    number: 'UC-03',
    name: 'Area & Land Measurement Converter',
    description: 'Convert land measurements between square meters, square feet, acres, hectares, square kilometers, and square miles.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isPopular: true,
    freeAlternativeTo: 'Land Area Calculator',
    tags: ['area converter', 'acres to sq ft', 'hectares to acres', 'sq meters to sq feet', 'land measurement'],
    interactiveType: 'unit-converter',
    rating: 4.8,
    useCount: '198.3k'
  },
  {
    id: 'tool_unit_volume',
    slug: 'volume-liquid-converter',
    number: 'UC-04',
    name: 'Volume & Liquid Capacity Converter',
    description: 'Convert liters, milliliters, US gallons, quarts, cups, fluid ounces, cubic meters, and cubic feet.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isPopular: true,
    freeAlternativeTo: 'Liquid Volume Calculator',
    tags: ['volume converter', 'liters to gallons', 'ml to cups', 'fluid ounces to ml', 'cubic meters'],
    interactiveType: 'unit-converter',
    rating: 4.9,
    useCount: '182.7k'
  },
  {
    id: 'tool_unit_data_storage',
    slug: 'data-storage-bandwidth-converter',
    number: 'UC-05',
    name: 'Data Storage & Digital Bandwidth Converter',
    description: 'Convert Bytes, KB, MB, GB, TB, PB and network transfer speeds in Mbps, Gbps, and bits.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isPopular: true,
    isTrending: true,
    freeAlternativeTo: 'Network Bandwidth Calc',
    tags: ['data storage converter', 'gb to mb', 'tb to gb', 'mbps to gbps', 'byte converter'],
    interactiveType: 'unit-converter',
    rating: 4.9,
    useCount: '228.4k'
  },
  {
    id: 'tool_unit_speed',
    slug: 'speed-velocity-converter',
    number: 'UC-06',
    name: 'Speed & Velocity Unit Converter',
    description: 'Translate speeds between m/s, km/h, mph, knots, feet/sec, and Mach speed of sound.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isTrending: true,
    freeAlternativeTo: 'Speedometer Tools',
    tags: ['speed converter', 'kmh to mph', 'knots to mph', 'meters per second', 'mach speed'],
    interactiveType: 'unit-converter',
    rating: 4.8,
    useCount: '164.9k'
  },
  {
    id: 'tool_unit_temperature',
    slug: 'temperature-unit-converter',
    number: 'UC-07',
    name: 'Temperature Scale Converter',
    description: 'Seamlessly convert between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R).',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isPopular: true,
    freeAlternativeTo: 'Weather Temperature Converter',
    tags: ['temperature converter', 'celsius to fahrenheit', 'kelvin to celsius', 'temp scales'],
    interactiveType: 'unit-converter',
    rating: 4.9,
    useCount: '205.6k'
  },
  {
    id: 'tool_unit_pressure',
    slug: 'pressure-stress-converter',
    number: 'UC-08',
    name: 'Pressure & Mechanical Stress Converter',
    description: 'Convert pressure values between Pascals, kPa, MPa, Bar, PSI, Standard Atmospheres, and Torr/mmHg.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    freeAlternativeTo: 'Barometer Pro',
    tags: ['pressure converter', 'psi to bar', 'kpa to psi', 'atm to pascal', 'barometer'],
    interactiveType: 'unit-converter',
    rating: 4.8,
    useCount: '142.3k'
  },
  {
    id: 'tool_unit_time',
    slug: 'time-duration-converter',
    number: 'UC-09',
    name: 'Time & Duration Unit Converter',
    description: 'Convert time spans across milliseconds, seconds, minutes, hours, days, weeks, months, and years.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isPopular: true,
    freeAlternativeTo: 'Time Duration Calculator',
    tags: ['time converter', 'hours to minutes', 'seconds to hours', 'days to weeks', 'time duration'],
    interactiveType: 'unit-converter',
    rating: 4.9,
    useCount: '189.2k'
  },
  {
    id: 'tool_unit_energy',
    slug: 'energy-work-converter',
    number: 'UC-10',
    name: 'Energy & Mechanical Work Converter',
    description: 'Convert energy units between Joules, Kilojoules, Calories, Kilocalories (kcal), kWh, BTU, and Electronvolts.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isTrending: true,
    freeAlternativeTo: 'Physics Energy Calculator',
    tags: ['energy converter', 'joules to calories', 'kwh to joules', 'btu to kwh', 'kcal converter'],
    interactiveType: 'unit-converter',
    rating: 4.8,
    useCount: '153.8k'
  },
  {
    id: 'tool_unit_power',
    slug: 'power-wattage-converter',
    number: 'UC-11',
    name: 'Power & Engine Wattage Converter',
    description: 'Convert electric power and engine power between Watts, Kilowatts, Megawatts, Horsepower (hp), and BTU/h.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    freeAlternativeTo: 'Horsepower Converter',
    tags: ['power converter', 'watts to horsepower', 'kw to hp', 'megawatts', 'btu per hour'],
    interactiveType: 'unit-converter',
    rating: 4.8,
    useCount: '137.4k'
  },
  {
    id: 'tool_unit_force',
    slug: 'force-load-converter',
    number: 'UC-12',
    name: 'Force & Mechanical Load Converter',
    description: 'Convert physical force values between Newtons, Kilonewtons (kN), Pound-force (lbf), Dynes, and kgf.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    freeAlternativeTo: 'Engineering Force Calc',
    tags: ['force converter', 'newtons to lbf', 'kn to newton', 'dyne converter', 'kgf to newtons'],
    interactiveType: 'unit-converter',
    rating: 4.7,
    useCount: '118.9k'
  },
  {
    id: 'tool_unit_density',
    slug: 'mass-density-converter',
    number: 'UC-13',
    name: 'Mass Density Unit Converter',
    description: 'Convert substance density between kg/m³, g/cm³, g/mL, lb/ft³, and lb/in³.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    freeAlternativeTo: 'Material Density Calc',
    tags: ['density converter', 'kg/m3 to g/cm3', 'lb/ft3 converter', 'mass density', 'material weight'],
    interactiveType: 'unit-converter',
    rating: 4.7,
    useCount: '105.2k'
  },
  {
    id: 'tool_unit_angle',
    slug: 'angle-plane-angle-converter',
    number: 'UC-14',
    name: 'Angle & Geometry Plane Converter',
    description: 'Convert geometric angles between Degrees, Radians, Gradians, Arcminutes, Arcseconds, and Revolutions.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    freeAlternativeTo: 'Trigonometry Angle Calc',
    tags: ['angle converter', 'degrees to radians', 'radians to degrees', 'arcseconds', 'gradians'],
    interactiveType: 'unit-converter',
    rating: 4.8,
    useCount: '129.6k'
  },
  {
    id: 'tool_unit_frequency',
    slug: 'frequency-wavelength-converter',
    number: 'UC-15',
    name: 'Frequency & Oscillation Converter',
    description: 'Convert signal frequencies across Hertz (Hz), Kilohertz (kHz), Megahertz (MHz), Gigahertz (GHz), and RPM.',
    category: 'unit-converter',
    complexity: 'Easy',
    readTime: 'Instant',
    isTrending: true,
    freeAlternativeTo: 'RF Frequency Converter',
    tags: ['frequency converter', 'hz to khz', 'mhz to ghz', 'rpm to hz', 'signal frequency'],
    interactiveType: 'unit-converter',
    rating: 4.8,
    useCount: '147.0k'
  }
];
