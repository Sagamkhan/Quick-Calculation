/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shared categories and structural definitions for all 30 calculators
export interface CalcItem {
  id: string;
  name: string;
  desc: string;
  title: string;
  seoDescription: string;
}

export interface CalcCategory {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  items: CalcItem[];
}

export const CALCULATOR_CATEGORIES: CalcCategory[] = [
  {
    id: "finance",
    name: "Personal Finance & Investments",
    emoji: "💰",
    desc: "Mutual funds, long-term wealth, loan EMIs, and crypto calculations with detailed reports.",
    items: [
      {
        id: "sip",
        name: "SIP Calculator",
        desc: "Long-term mutual funds investments ke estimated returns check karne ke liye.",
        title: "SIP (Systematic Investment Plan) Calculator - Mutual Fund Returns",
        seoDescription: "Calculate the future value and estimated returns of your monthly Systematic Investment Plan (SIP) in mutual funds with accurate inflation-adjusted returns and dynamic compound wealth tables."
      },
      {
        id: "compound",
        name: "Compound Interest Calculator",
        desc: "Wealth growth aur interest-on-interest track karne ke liye sabsay viral tool.",
        title: "Compound Interest Calculator - Multi-Frequency Wealth Growth",
        seoDescription: "Track your long-term wealth growth, interest-on-interest earnings, and compounding effects across daily, monthly, quarterly, or annual compound frequencies."
      },
      {
        id: "emi",
        name: "EMI (Loan) Calculator",
        desc: "Home loan, car loan ya personal loan ki monthly installments ke liye high-intent tool.",
        title: "EMI Loan Calculator - Home, Car, & Personal Loans",
        seoDescription: "Instantly estimate your monthly EMI installments, total payable interest, and complete amortization schedule for home loans, auto loans, or personal bank loans in India."
      },
      {
        id: "buy_rent",
        name: "Buy vs. Rent Calculator",
        desc: "Ghar kharidna sasta padega ya rent pe lena? Net wealth comparison check karein.",
        title: "Buy vs. Rent Calculator - Real Estate Decision Matrix",
        seoDescription: "Perform a comprehensive financial comparison between purchasing real estate (downpayment + home loan EMIs) vs renting a house and investing the savings over a 10-year period."
      },
      {
        id: "crypto",
        name: "Crypto Profit Calculator",
        desc: "Crypto coins ki buying/selling pricing aur exchange fees ke baad pure net profit calculator.",
        title: "Crypto Profit & Net ROI Calculator - Tax & Fee Adjusted",
        seoDescription: "Calculate your exact cryptocurrency trading net profit or loss, capital gains tax, and exchange transaction fees for coins like Bitcoin, Ethereum, or Solana."
      },
      {
        id: "inflation",
        name: "Inflation Calculator",
        desc: "Check karein ki aaj ke ₹1,00,000 ki real value 10-20 saal baad kitni hogi.",
        title: "Inflation Calculator - Future Money Value & Purchasing Power",
        seoDescription: "Analyze the purchasing power drop over time and find the real future cost of any item based on current inflation rates in India."
      }
    ]
  },
  {
    id: "business",
    name: "Business & Tax Calculators",
    emoji: "📊",
    desc: "Calculate GST, freelance hourly rates, annual take-home salary, and marketing ROI.",
    items: [
      {
        id: "gst",
        name: "GST / Sales Tax Calculator",
        desc: "Kisi bhi product ya service par quick GST calculation (CGST + SGST) rates ke liye.",
        title: "GST Calculator - Indian Central & State Sales Tax Split",
        seoDescription: "Instantly add or remove GST from your product cost. Get the exact split for CGST, SGST, or IGST based on standard slabs (5%, 12%, 18%, 28%)."
      },
      {
        id: "salary",
        name: "Salary (Take-Home) Calculator",
        desc: "Taxes, PF contributors aur other deductions ke baad monthly take-home salary estimate karein.",
        title: "Salary Take-Home Pay Calculator - Income Tax Regime India",
        seoDescription: "Estimate your monthly in-hand take-home salary, provident fund contributions, professional taxes, and income tax slab under the modern Indian tax regime."
      },
      {
        id: "freelance",
        name: "Freelance Rate Calculator",
        desc: "Desired monthly income aur annual business expenses ke hisab se hourly rate nikalen.",
        title: "Freelance Hourly Rate & Project Pricing Calculator",
        seoDescription: "Work out the exact hourly freelance billing rate you need to charge clients based on your target net earnings, business overheads, and billable weeks."
      },
      {
        id: "roi",
        name: "ROI (Return on Investment) Calculator",
        desc: "Digital campaigns, real estate, ya startup equity par absolute profit and CAGR tracker.",
        title: "ROI Calculator - CAGR & Absolute Investment Return",
        seoDescription: "Determine the absolute Return on Investment (ROI) and Compound Annual Growth Rate (CAGR) for business marketing campaigns, real estate acquisitions, or financial assets."
      },
      {
        id: "discount",
        name: "Discount & Profit Margin Calculator",
        desc: "Shoppers ke liye saved amount, aur e-commerce sellers ke liye markup & profit margin.",
        title: "Discount & Profit Margin Calculator - Markups and Savings",
        seoDescription: "Calculate markdown discounts, final sales prices, net profits, profit margins, and markup ratios for e-commerce listings, retail shops, or shopping sales."
      }
    ]
  },
  {
    id: "health",
    name: "Health & Fitness Trackers",
    emoji: "🏥",
    desc: "Body index, daily metabolic calorie targets, pregnancy dates, and hydration guides.",
    items: [
      {
        id: "bmi",
        name: "BMI (Body Mass Index) Calculator",
        desc: "Height aur weight ke baseline ratios par healthy mass status check karein.",
        title: "BMI Calculator - Body Mass Index & Weight Categories",
        seoDescription: "Calculate your Body Mass Index (BMI) to understand your weight category (Underweight, Normal, Overweight, Obese) and find your ideal target weight range."
      },
      {
        id: "calorie",
        name: "Calorie / BMR Calculator",
        desc: "Diet plans aur weight control goals ke liye daily baseline calorie energy needs.",
        title: "Calorie & BMR Calculator - Daily Energy Expenditure (TDEE)",
        seoDescription: "Find your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to plan calorie intake for weight loss, maintenance, or muscle gain."
      },
      {
        id: "pregnancy",
        name: "Pregnancy Due Date Calculator",
        desc: "Last menstrual period se due date aur milestones (trimesters) check karein.",
        title: "Pregnancy Due Date Calculator - Gestational Age & Milestones",
        seoDescription: "Calculate your baby's estimated due date (EDD), current gestational age in weeks/days, conception date, and active trimester milestones based on Naegele's rule."
      },
      {
        id: "body_fat",
        name: "Body Fat Percentage Calculator",
        desc: "US Navy body tape measurements technique se exact lean/fat mass composition.",
        title: "Body Fat Percentage Calculator - US Navy Fat Tape Standard",
        seoDescription: "Estimate your body fat percentage, total fat mass, and lean muscle mass using the highly accurate US Navy circumference measurement method."
      },
      {
        id: "water",
        name: "Water Intake Calculator",
        desc: "Weight, activities, aur weather temperature indicators par daily hydration needs.",
        title: "Daily Water Intake Calculator - Hydration Volume Scheduler",
        seoDescription: "Calculate how many liters and glasses of water you should drink daily based on body weight, workout durations, and climate temperatures."
      }
    ]
  },
  {
    id: "everyday",
    name: "Everyday Utility & Converters",
    emoji: "🛠️",
    desc: "Exact age counter, percentage calculations, remote shift hours, GPA cards, and road fuel cost splits.",
    items: [
      {
        id: "age",
        name: "Age Calculator",
        desc: "Date of birth se exact years, months, weeks, days aur next birthday countdown.",
        title: "Age Calculator - Exact Years, Months, Days & Birthday Timer",
        seoDescription: "Instantly find your exact age in years, months, weeks, days, and hours, plus a real-time countdown to your next upcoming birthday and day of birth."
      },
      {
        id: "percentage",
        name: "Percentage Calculator",
        desc: "Percentage increase, decrease, what percent of, and absolute ratios solver.",
        title: "Percentage Calculator - Increase, Decrease & Fraction Solver",
        seoDescription: "Solve common percentage queries such as: What is X% of Y? X is what percentage of Y? and find the percentage change from value X to Y."
      },
      {
        id: "time",
        name: "Time/Hours Calculator",
        desc: "Shift hours, breaks, decimal sheets, aur hourly rate based income estimator.",
        title: "Work Time & Hours Sheet Calculator - Decimal Hours & Wages",
        seoDescription: "Calculate net work hours between shift start and end times, adjust for unpaid breaks, and estimate total gross earnings using hourly payroll wages."
      },
      {
        id: "gpa",
        name: "GPA / Grade Calculator",
        desc: "Track subject semester grades, credit points, and overall GPA scales.",
        title: "GPA & Semester Grade Point Average Calculator",
        seoDescription: "Easily compute your semester Grade Point Average (GPA) based on custom academic grades (A+, A, B, etc.) and weighted credit hours."
      },
      {
        id: "fuel",
        name: "Fuel Cost / Trip Calculator",
        desc: "Road trips par mileage aur fuel prices parameters par direct passengers splitter.",
        title: "Fuel Cost & Road Trip Shared Expense Calculator",
        seoDescription: "Calculate the total fuel volume, total fuel cost, and cost per passenger split for any road trip based on vehicle mileage and current petrol/diesel prices."
      }
    ]
  },
  {
    id: "seo",
    name: "SEO, Tech & Digital Utilities",
    emoji: "💻",
    desc: "Word statistics, high-entropy password creator, social engagement parameters, and loading speed values.",
    items: [
      {
        id: "word_count",
        name: "Word & Character Counter",
        desc: "Capping requirements, reading/speaking speed rates, and total paragraphs stats.",
        title: "Word & Character Counter - Reading Time & Stats Analyzer",
        seoDescription: "Analyze text counts in real-time, including words, characters (with and without spaces), sentences, paragraphs, and estimated reading/speaking durations."
      },
      {
        id: "password",
        name: "Password Strength & Generator",
        desc: "Generate random secure passwords and check active entropy strength bits.",
        title: "Password Strength Calculator & Random Hash Generator",
        seoDescription: "Generate customized high-security passwords and measure their entropy strength in bits to defend against modern brute-force algorithms."
      },
      {
        id: "ai_roi",
        name: "AI Content ROI Calculator",
        desc: "Traditional writers cost vs AI assisted output and budget savings analysis.",
        title: "AI Content Cost & Resource ROI Calculator",
        seoDescription: "Compare the financial expenses and output capacity of human-only content creation versus AI-assisted content drafting and review workflows."
      },
      {
        id: "engagement",
        name: "Social Media Engagement",
        desc: "Followers, likes, shares, comments parameters par engagement rate benchmarks.",
        title: "Social Media Engagement Rate & Quality Benchmark Tracker",
        seoDescription: "Find your social media engagement rate (likes, comments, shares divided by follower count) and compare against industry-standard reach quality benchmarks."
      },
      {
        id: "speed_impact",
        name: "Website Speed Impact",
        desc: "Page load speed delays par customer bounce rate and monthly revenue loss calculator.",
        title: "Website Speed & Conversion Revenue Loss Calculator",
        seoDescription: "See how slow web page load times affect your checkout conversion rates, customer retention, and estimated monthly e-commerce revenue."
      }
    ]
  },
  {
    id: "math",
    name: "Developer, Math & Industrial",
    emoji: "📐",
    desc: "Trigonometric scientific evaluations, square footage volume, HEX/RGB conversions, and CIDR subnet tables.",
    items: [
      {
        id: "scientific",
        name: "Scientific Calculator (Advanced)",
        desc: "Advanced mathematical operations, trigs, brackets, log, sqrt, aur constant variables.",
        title: "Scientific Calculator - Advanced Arithmetic, Log & Trig Evaluator",
        seoDescription: "Use an advanced scientific computational keyboard supporting trigonometry, log base 10, natural ln, brackets, square root, powers, and math constants."
      },
      {
        id: "sqft",
        name: "Square Footage & Concrete",
        desc: "Area square footage measurements, cubic volume, and concrete bags needed.",
        title: "Square Footage & Concrete Volume Bag Calculator",
        seoDescription: "Calculate absolute area in square feet, volume in cubic feet or yards, and find the number of standard 80-lb concrete bags required for home slab construction."
      },
      {
        id: "hex_rgb",
        name: "HEX to RGB Color Code Converter",
        desc: "HEX colors parsing to RGB/RGBA codes, HSL arrays, CSS variables and preview.",
        title: "HEX to RGB/RGBA Color Converter & CSS Code Maker",
        seoDescription: "Convert HEX codes to RGB, RGBA, or HSL. Get dynamic CSS styling snippet configurations, contrast scores, and instant color palette swatch previews."
      },
      {
        id: "subnet",
        name: "Subnet Calculator",
        desc: "Subnet masks, network ids, broadcast boundaries, usable host pools, and CIDR CIDR maps.",
        title: "Subnet Mask & usable Host IP Range Calculator",
        seoDescription: "Enter an IP address and CIDR prefix to calculate subnet masks, wildcard masks, network bounds, broadcast addresses, and usability pools."
      }
    ]
  }
];

export const DEFAULT_INPUTS: Record<string, any> = {
  sip: { monthly: 5000, rate: 12, years: 10 },
  compound: { principal: 50000, rate: 8, years: 10, frequency: "12" },
  emi: { principal: 1000000, rate: 8.5, years: 15 },
  buy_rent: { price: 5000000, rent: 15000, appreciation: 5, inflation: 6, returnRate: 10 },
  crypto: { investment: 25000, buyPrice: 500000, sellPrice: 580000, fee: 0.2 },
  inflation: { cost: 100000, rate: 6, years: 15 },
  gst: { amount: 10000, rate: 18, type: "add" },
  salary: { ctc: 1200000, pt: 2400, pf: 12, deductions: 150000 },
  freelance: { income: 80000, hours: 35, vacation: 4, expenses: 15000 },
  roi: { capital: 100000, revenue: 150000, years: 2 },
  discount: { original: 5000, discount: 20, costPrice: 3500 },
  bmi: { weight: 70, height: 175 },
  calorie: { age: 28, gender: "male", weight: 70, height: 175, activity: "1.375" },
  pregnancy: { lmp: new Date().toISOString().split('T')[0] },
  body_fat: { gender: "male", age: 28, weight: 70, waist: 82, neck: 38, hip: 94 },
  water: { weight: 70, activity: 60, weather: "temperate" },
  age: { dob: "1998-05-15", refDate: new Date().toISOString().split('T')[0] },
  percentage: { val1: 500, val2: 2500, type: "percent_of" },
  time: { start: "09:00", end: "17:30", breakMins: 45, hourlyRate: 500 },
  gpa: {
    courses: [
      { grade: "A", credits: 4 },
      { grade: "B", credits: 3 },
      { grade: "A", credits: 3 },
      { grade: "C", credits: 4 }
    ]
  },
  fuel: { distance: 350, price: 96.72, mileage: 15, passengers: 4 },
  word_count: { text: "ToolHub is India's leading cost-cutting suite. Swapping expensive SaaS services with top open-source frameworks saves builders lakhs of Rupees." },
  password: { length: 14, upper: true, lower: true, numbers: true, symbols: true },
  ai_roi: { costPerArt: 5000, articles: 20, aiCost: 2000, aiMultiplier: 4 },
  engagement: { followers: 15000, likes: 620, comments: 45, shares: 12 },
  speed_impact: { traffic: 50000, convRate: 2.5, aov: 1500, currentSpeed: 4.2, targetSpeed: 1.8 },
  scientific: { expression: "2 * (15 + 4) / sin(45)" },
  sqft: { length: 20, width: 15, depth: 4 },
  hex_rgb: { hex: "#4f46e5" },
  subnet: { ip: "192.168.1.1", cidr: "24" }
};

// All mathematical functions structured compactly in a single runner
export function runCalculation(id: string, inputs: any): any {
  switch (id) {
    case "sip": {
      const p = parseFloat(inputs?.monthly ?? 5000);
      const r = parseFloat(inputs?.rate ?? 12);
      const y = parseFloat(inputs?.years ?? 10);
      const i = (r / 100) / 12;
      const n = y * 12;
      const totalInvestment = p * n;
      const totalWealth = i > 0 ? p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : totalInvestment;
      const estReturns = totalWealth - totalInvestment;
      return { totalInvestment, estReturns, totalWealth };
    }
    case "compound": {
      const p = parseFloat(inputs?.principal ?? 50000);
      const r = parseFloat(inputs?.rate ?? 8) / 100;
      const y = parseFloat(inputs?.years ?? 10);
      const freq = parseInt(inputs?.frequency ?? 12, 10);
      const totalAmount = p * Math.pow(1 + r / freq, freq * y);
      const interestEarned = totalAmount - p;
      return { principal: p, totalAmount, interestEarned };
    }
    case "emi": {
      const p = parseFloat(inputs?.principal ?? 1000000);
      const annualRate = parseFloat(inputs?.rate ?? 8.5);
      const y = parseFloat(inputs?.years ?? 15);
      const r = (annualRate / 12) / 100;
      const n = y * 12;
      const emi = r > 0 ? p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : p / n;
      const totalAmount = emi * n;
      const totalInterest = totalAmount - p;
      return { emi, totalInterest, totalAmount };
    }
    case "buy_rent": {
      const price = parseFloat(inputs?.price ?? 5000000);
      const rent = parseFloat(inputs?.rent ?? 15000);
      const appreciation = parseFloat(inputs?.appreciation ?? 5) / 100;
      const rentInflation = parseFloat(inputs?.inflation ?? 6) / 100;
      const returnRate = parseFloat(inputs?.returnRate ?? 10) / 100;
      const years = 10;
      const downpayment = price * 0.2;
      const loanAmount = price * 0.8;
      const r = (8.5 / 12) / 100;
      const n = 15 * 12;
      const monthlyEmi = loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalBuyingExpenses = downpayment + (monthlyEmi * years * 12);
      const propertyValueAfterYears = price * Math.pow(1 + appreciation, years);
      const buyingNetWealth = propertyValueAfterYears - (loanAmount * 0.5); // Simplified remainder loan estimate
      let currentRent = rent;
      let rentInvestment = downpayment;
      for (let yr = 1; yr <= years; yr++) {
        const monthlyDiff = Math.max(0, (monthlyEmi - currentRent));
        rentInvestment = (rentInvestment + monthlyDiff * 12) * (1 + returnRate);
        currentRent *= (1 + rentInflation);
      }
      const rentingNetWealth = rentInvestment;
      const betterOption = buyingNetWealth > rentingNetWealth ? "Buying" : "Renting";
      const diff = Math.abs(buyingNetWealth - rentingNetWealth);
      return { buyingNetWealth, rentingNetWealth, betterOption, diff };
    }
    case "crypto": {
      const invest = parseFloat(inputs?.investment ?? 25000);
      const buyPrice = parseFloat(inputs?.buyPrice ?? 500000);
      const sellPrice = parseFloat(inputs?.sellPrice ?? 580000);
      const feePct = parseFloat(inputs?.fee ?? 0.2) / 100;
      const buyFee = invest * feePct;
      const coins = (invest - buyFee) / buyPrice;
      const grossSell = coins * sellPrice;
      const sellFee = grossSell * feePct;
      const finalValue = grossSell - sellFee;
      const netProfit = finalValue - invest;
      const roi = (netProfit / invest) * 100;
      return { buyFee, coins, finalValue, netProfit, roi };
    }
    case "inflation": {
      const cost = parseFloat(inputs?.cost ?? 100000);
      const rate = parseFloat(inputs?.rate ?? 6) / 100;
      const years = parseFloat(inputs?.years ?? 15);
      const futureCost = cost * Math.pow(1 + rate, years);
      const purchasingPowerToday = cost / Math.pow(1 + rate, years);
      return { futureCost, purchasingPowerToday };
    }
    case "gst": {
      const amount = parseFloat(inputs?.amount ?? 10000);
      const rate = parseFloat(inputs?.rate ?? 18);
      const type = inputs?.type ?? "add";
      let gstAmount = 0;
      let baseAmount = amount;
      let totalAmount = amount;
      if (type === "add") {
        gstAmount = (amount * rate) / 100;
        totalAmount = amount + gstAmount;
      } else {
        totalAmount = amount;
        baseAmount = amount / (1 + rate / 100);
        gstAmount = totalAmount - baseAmount;
      }
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      return { baseAmount, gstAmount, cgst, sgst, totalAmount };
    }
    case "salary": {
      const ctc = parseFloat(inputs?.ctc ?? 1200000);
      const pt = parseFloat(inputs?.pt ?? 2400);
      const otherDeducts = parseFloat(inputs?.deductions ?? 150000);
      const standardDeduction = 75000;
      const taxableIncome = Math.max(0, ctc - standardDeduction);
      let tax = 0;
      if (taxableIncome > 700000) {
        let temp = taxableIncome;
        if (temp > 1500000) { tax += (temp - 1500000) * 0.3; temp = 1500000; }
        if (temp > 1200000) { tax += (temp - 1200000) * 0.2; temp = 1200000; }
        if (temp > 900000) { tax += (temp - 900000) * 0.15; temp = 900000; }
        if (temp > 600000) { tax += (temp - 600000) * 0.1; temp = 600000; }
        if (temp > 300000) { tax += (temp - 300000) * 0.05; }
      }
      const monthlyGross = ctc / 12;
      const monthlyPf = (ctc * 0.10) / 12;
      const monthlyPt = pt / 12;
      const monthlyTax = tax / 12;
      const monthlyTakeHome = monthlyGross - monthlyPf - monthlyPt - monthlyTax - (otherDeducts / 12);
      return { taxableIncome, annualTax: tax, monthlyGross, monthlyPf, monthlyTakeHome };
    }
    case "freelance": {
      const income = parseFloat(inputs?.income ?? 80000) * 12;
      const hours = parseFloat(inputs?.hours ?? 35);
      const vacation = parseFloat(inputs?.vacation ?? 4);
      const expenses = parseFloat(inputs?.expenses ?? 15000) * 12;
      const totalBillableWeeks = 52 - vacation;
      const totalBillableHours = totalBillableWeeks * hours;
      const requiredAnnualRevenue = income + expenses;
      const hourlyRate = requiredAnnualRevenue / totalBillableHours;
      const dailyTarget = (requiredAnnualRevenue / totalBillableWeeks) / 5;
      return { requiredAnnualRevenue, totalBillableHours, hourlyRate, dailyTarget };
    }
    case "roi": {
      const capital = parseFloat(inputs?.capital ?? 100000);
      const revenue = parseFloat(inputs?.revenue ?? 150000);
      const years = parseFloat(inputs?.years ?? 2);
      const netProfit = revenue - capital;
      const totalRoi = (netProfit / capital) * 100;
      const cagr = (years > 0 && capital > 0 && revenue > 0) ? (Math.pow(revenue / capital, 1 / years) - 1) * 100 : 0;
      return { netProfit, totalRoi, cagr };
    }
    case "discount": {
      const orig = parseFloat(inputs?.original ?? 5000);
      const disc = parseFloat(inputs?.discount ?? 20) / 100;
      const cost = parseFloat(inputs?.costPrice ?? 3500);
      const savedAmount = orig * disc;
      const finalPrice = orig - savedAmount;
      const profit = finalPrice - cost;
      const profitMargin = (profit / finalPrice) * 100;
      const profitMarkup = (profit / cost) * 100;
      return { savedAmount, finalPrice, profit, profitMargin, profitMarkup };
    }
    case "bmi": {
      const w = parseFloat(inputs?.weight ?? 70);
      const h = parseFloat(inputs?.height ?? 175) / 100;
      const bmi = w / (h * h);
      let category = "Normal";
      let color = "text-emerald-500 bg-emerald-50";
      if (bmi < 18.5) { category = "Underweight"; color = "text-amber-500 bg-amber-50"; }
      else if (bmi >= 25 && bmi < 30) { category = "Overweight"; color = "text-orange-500 bg-orange-50"; }
      else if (bmi >= 30) { category = "Obese"; color = "text-red-500 bg-red-50"; }
      const minIdeal = 18.5 * (h * h);
      const maxIdeal = 24.9 * (h * h);
      return { bmi, category, color, minIdeal, maxIdeal };
    }
    case "calorie": {
      const age = parseFloat(inputs?.age ?? 28);
      const gender = inputs?.gender ?? "male";
      const weight = parseFloat(inputs?.weight ?? 70);
      const height = parseFloat(inputs?.height ?? 175);
      const activity = parseFloat(inputs?.activity ?? 1.375);
      const bmr = gender === "male"
        ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      const tdee = bmr * activity;
      return { bmr, tdee };
    }
    case "pregnancy": {
      const lmpStr = inputs?.lmp ?? new Date().toISOString().split('T')[0];
      const lmpDate = new Date(lmpStr);
      const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
      const conceptionDate = new Date(lmpDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      const today = new Date();
      const diffTime = Math.max(0, today.getTime() - lmpDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      const trimester = weeks >= 27 ? "Third" : weeks >= 13 ? "Second" : "First";
      return { dueDate: dueDate.toDateString(), conceptionDate: conceptionDate.toDateString(), weeks, remainingDays, trimester };
    }
    case "body_fat": {
      const gender = inputs?.gender ?? "male";
      const weight = parseFloat(inputs?.weight ?? 70);
      const waist = parseFloat(inputs?.waist ?? 82);
      const neck = parseFloat(inputs?.neck ?? 38);
      const height = parseFloat(inputs?.height ?? 175);
      let bodyFat = 15;
      if (gender === "male") {
        const logWaistNeck = Math.log10(waist - neck);
        const logHeight = Math.log10(height);
        bodyFat = (waist - neck > 0) ? (86.010 * logWaistNeck - 70.041 * logHeight + 36.76) : 15;
      } else {
        const hip = parseFloat(inputs?.hip ?? 94);
        const logWaistHipNeck = Math.log10(waist + hip - neck);
        const logHeight = Math.log10(height);
        bodyFat = (waist + hip - neck > 0) ? (163.205 * logWaistHipNeck - 97.684 * logHeight - 78.387) : 24;
      }
      if (isNaN(bodyFat) || bodyFat < 2) bodyFat = 12;
      const fatMass = weight * (bodyFat / 100);
      const leanMass = weight - fatMass;
      return { bodyFat, fatMass, leanMass };
    }
    case "water": {
      const weight = parseFloat(inputs?.weight ?? 70);
      const activity = parseFloat(inputs?.activity ?? 60);
      const weather = inputs?.weather ?? "temperate";
      let targetMl = weight * 35;
      targetMl += (activity / 30) * 350;
      if (weather === "hot") targetMl += 500;
      if (weather === "cold") targetMl -= 200;
      const targetLiters = targetMl / 1000;
      const glasses = targetMl / 250;
      return { targetMl, targetLiters, glasses };
    }
    case "age": {
      const dobStr = inputs?.dob ?? "1998-05-15";
      const refStr = inputs?.refDate ?? new Date().toISOString().split('T')[0];
      const dob = new Date(dobStr);
      const ref = new Date(refStr);
      let years = ref.getFullYear() - dob.getFullYear();
      let months = ref.getMonth() - dob.getMonth();
      let days = ref.getDate() - dob.getDate();
      if (days < 0) {
        const prevMonthLastDate = new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
        days += prevMonthLastDate;
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }
      const totalDays = Math.ceil((ref.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
      const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dob.getDay()];
      return { years, months, days, totalDays, weekDay };
    }
    case "percentage": {
      const val1 = parseFloat(inputs?.val1 ?? 500);
      const val2 = parseFloat(inputs?.val2 ?? 2500);
      const type = inputs?.type ?? "percent_of";
      let result = 0;
      let explanation = "";
      if (type === "percent_of") {
        result = (val1 / 100) * val2;
        explanation = `${val1}% of ${val2} = ${result}`;
      } else if (type === "is_what_percent") {
        result = val2 > 0 ? (val1 / val2) * 100 : 0;
        explanation = `${val1} is ${result.toFixed(2)}% of ${val2}`;
      } else if (type === "percent_change") {
        result = val1 > 0 ? (((val2 - val1) / val1) * 100) : 0;
        explanation = `Percentage change from ${val1} to ${val2} = ${result.toFixed(2)}%`;
      }
      return { result, explanation };
    }
    case "time": {
      const start = inputs?.start ?? "09:00";
      const end = inputs?.end ?? "17:30";
      const breakMins = parseFloat(inputs?.breakMins ?? 45);
      const hourlyRate = parseFloat(inputs?.hourlyRate ?? 500);
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      let diffMins = (eh * 60 + em) - (sh * 60 + sm);
      if (diffMins < 0) diffMins += 24 * 60;
      const netMins = Math.max(0, diffMins - breakMins);
      const hours = Math.floor(netMins / 60);
      const mins = netMins % 60;
      const decimalHours = netMins / 60;
      const grossPay = decimalHours * hourlyRate;
      return { hours, mins, decimalHours, grossPay };
    }
    case "gpa": {
      const courses = inputs?.courses ?? [
        { grade: "A", credits: 4 },
        { grade: "B", credits: 3 },
        { grade: "A", credits: 3 },
        { grade: "C", credits: 4 }
      ];
      const gradePoints: Record<string, number> = {
        "A+": 10, "A": 9, "B+": 8, "B": 7, "C+": 6, "C": 5, "D": 4, "F": 0
      };
      let totalCredits = 0;
      let totalWeightPoints = 0;
      courses.forEach((c: any) => {
        const pt = gradePoints[c.grade] ?? 8;
        const cred = parseFloat(c.credits) || 0;
        totalCredits += cred;
        totalWeightPoints += pt * cred;
      });
      const gpa = totalCredits > 0 ? totalWeightPoints / totalCredits : 0;
      return { totalCredits, gpa };
    }
    case "fuel": {
      const dist = parseFloat(inputs?.distance ?? 350);
      const price = parseFloat(inputs?.price ?? 96.72);
      const mileage = parseFloat(inputs?.mileage ?? 15);
      const passengers = parseFloat(inputs?.passengers ?? 4);
      const totalFuelRequired = dist / mileage;
      const totalCost = totalFuelRequired * price;
      const costPerHead = totalCost / Math.max(1, passengers);
      return { totalFuelRequired, totalCost, costPerHead };
    }
    case "word_count": {
      const txt = inputs?.text ?? "";
      const charsWithSpace = txt.length;
      const charsNoSpace = txt.replace(/\s/g, "").length;
      const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
      const sentences = txt.split(/[.!?]+/).filter(Boolean).length;
      const readingTime = Math.ceil(words / 200);
      return { charsWithSpace, charsNoSpace, words, sentences, readingTime };
    }
    case "password": {
      const len = parseInt(inputs?.length ?? 14, 10);
      const up = inputs?.upper ?? true;
      const lw = inputs?.lower ?? true;
      const num = inputs?.numbers ?? true;
      const sym = inputs?.symbols ?? true;
      let pool = "";
      if (up) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (lw) pool += "abcdefghijklmnopqrstuvwxyz";
      if (num) pool += "0123456789";
      if (sym) pool += "!@#$%^&*()_+-=[]{}|;:,.<>?";
      if (!pool) pool = "abcdefghijklmnopqrstuvwxyz";
      let pass = "";
      for (let i = 0; i < len; i++) {
        pass += pool.charAt(Math.floor(Math.random() * pool.length));
      }
      const entropy = len * Math.log2(pool.length);
      let strength = "Low";
      let strengthColor = "text-red-500 bg-red-50";
      if (entropy > 80) { strength = "Very Strong"; strengthColor = "text-emerald-500 bg-emerald-50 border border-emerald-500/10"; }
      else if (entropy > 55) { strength = "Strong"; strengthColor = "text-indigo-500 bg-indigo-50 border border-indigo-500/10"; }
      else if (entropy > 35) { strength = "Medium"; strengthColor = "text-amber-500 bg-amber-50 border border-amber-500/10"; }
      return { pass, entropy, strength, strengthColor };
    }
    case "ai_roi": {
      const humanCost = parseFloat(inputs?.costPerArt ?? 5000);
      const count = parseFloat(inputs?.articles ?? 20);
      const aiCost = parseFloat(inputs?.aiCost ?? 2000);
      const mult = parseFloat(inputs?.aiMultiplier ?? 4);
      const currentCost = humanCost * count;
      const aiSupportedCost = aiCost + ((humanCost / mult) * count);
      const saved = currentCost - aiSupportedCost;
      const savingsPct = currentCost > 0 ? (saved / currentCost) * 100 : 0;
      const potentialOutput = count * mult;
      return { currentCost, aiSupportedCost, saved, savingsPct, potentialOutput };
    }
    case "engagement": {
      const followers = parseFloat(inputs?.followers ?? 15000);
      const likes = parseFloat(inputs?.likes ?? 620);
      const comments = parseFloat(inputs?.comments ?? 45);
      const shares = parseFloat(inputs?.shares ?? 12);
      const totalInteractions = likes + comments + shares;
      const er = followers > 0 ? (totalInteractions / followers) * 100 : 0;
      const category = er > 6 ? "Viral / Excellent" : er > 3.5 ? "Good / High" : er < 1 ? "Poor" : "Average";
      const advice = er > 6 ? "Exceptional reach! Retain commenter talks." : "Post consistently to maintain organic search volume.";
      return { er, totalInteractions, category, advice };
    }
    case "speed_impact": {
      const traffic = parseFloat(inputs?.traffic ?? 50000);
      const cr = parseFloat(inputs?.convRate ?? 2.5) / 100;
      const aov = parseFloat(inputs?.aov ?? 1500);
      const currentSpeed = parseFloat(inputs?.currentSpeed ?? 4.2);
      const targetSpeed = parseFloat(inputs?.targetSpeed ?? 1.8);
      const diffSec = Math.max(0, currentSpeed - targetSpeed);
      const conversionIncreasePct = diffSec * 7;
      const targetCr = cr * (1 + conversionIncreasePct / 100);
      const currentRevenue = traffic * cr * aov;
      const projectedRevenue = traffic * targetCr * aov;
      const netGain = projectedRevenue - currentRevenue;
      return { currentRevenue, projectedRevenue, netGain, conversionIncreasePct, diffSec };
    }
    case "scientific": {
      const expr = inputs?.expression ?? "2 * (15 + 4)";
      try {
        let clean = expr
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(")
          .replace(/log\(/g, "Math.log10(")
          .replace(/ln\(/g, "Math.log(")
          .replace(/pi/g, "Math.PI")
          .replace(/e/g, "Math.E")
          .replace(/\^/g, "**")
          .replace(/sqrt\(/g, "Math.sqrt(");
        const result = new Function(`return ${clean}`)();
        return { result: typeof result === "number" && !isNaN(result) ? result : "Error" };
      } catch {
        return { result: "Syntax Error" };
      }
    }
    case "sqft": {
      const l = parseFloat(inputs?.length ?? 20);
      const w = parseFloat(inputs?.width ?? 15);
      const d = parseFloat(inputs?.depth ?? 4);
      const area = l * w;
      const volCuFt = area * (d / 12);
      const volCuYds = volCuFt / 27;
      const bagsNeeded = Math.ceil(volCuFt / 0.6);
      return { area, volCuFt, volCuYds, bagsNeeded };
    }
    case "hex_rgb": {
      let hex = inputs?.hex ?? "#4f46e5";
      if (!hex.startsWith("#")) hex = "#" + hex;
      let r = 79, g = 70, b = 229, parsed = false;
      const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      if (match) {
        r = parseInt(match[1], 16);
        g = parseInt(match[2], 16);
        b = parseInt(match[3], 16);
        parsed = true;
      }
      return { r, g, b, rgbString: `rgb(${r}, ${g}, ${b})`, rgbaString: `rgba(${r}, ${g}, ${b}, 1)`, hex, parsed };
    }
    case "subnet": {
      const ip = inputs?.ip ?? "192.168.1.1";
      const cidr = parseInt(inputs?.cidr ?? "24", 10);
      let maskBin = "".padStart(cidr, "1").padEnd(32, "0");
      const maskParts = [
        parseInt(maskBin.slice(0, 8), 2),
        parseInt(maskBin.slice(8, 16), 2),
        parseInt(maskBin.slice(16, 24), 2),
        parseInt(maskBin.slice(24, 32), 2),
      ];
      const subnetMask = maskParts.join(".");
      const ipParts = ip.split('.').map(Number);
      if (ipParts.length === 4 && ipParts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
        const ipBin = ipParts.map(p => p.toString(2).padStart(8, "0")).join("");
        const netBin = ipBin.slice(0, cidr).padEnd(32, "0");
        const broadBin = ipBin.slice(0, cidr).padEnd(32, "1");
        const networkAddress = [
          parseInt(netBin.slice(0, 8), 2),
          parseInt(netBin.slice(8, 16), 2),
          parseInt(netBin.slice(16, 24), 2),
          parseInt(netBin.slice(24, 32), 2),
        ].join(".");
        const broadcastAddress = [
          parseInt(broadBin.slice(0, 8), 2),
          parseInt(broadBin.slice(8, 16), 2),
          parseInt(broadBin.slice(16, 24), 2),
          parseInt(broadBin.slice(24, 32), 2),
        ].join(".");
        const usableHosts = cidr < 31 ? Math.pow(2, 32 - cidr) - 2 : cidr === 31 ? 2 : 1;
        return { subnetMask, networkAddress, broadcastAddress, usableHosts };
      }
      return { subnetMask: "255.255.255.0", networkAddress: "192.168.1.0", broadcastAddress: "192.168.1.255", usableHosts: 254 };
    }
    default:
      return {};
  }
}
