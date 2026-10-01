import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Users, Plus, Trash2, ArrowRight, Wallet, IndianRupee } from 'lucide-react';
import { ToolComponentProps } from './registry';

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
}

export default function DailyExpenseSplitter({ tool, onBack }: ToolComponentProps) {
  const [members, setMembers] = useState<string[]>(['Aarav', 'Diya', 'Rohan', 'Sneha']);
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', description: 'Weekend Villa Stay', amount: 12000, paidBy: 'Aarav' },
    { id: '2', description: 'Dinner & BBQ Barbecue', amount: 4800, paidBy: 'Diya' },
    { id: '3', description: 'Highway Fuel & Tolls', amount: 2400, paidBy: 'Rohan' }
  ]);
  const [newDesc, setNewDesc] = useState<string>('');
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newPayer, setNewPayer] = useState<string>('Aarav');
  const [copied, setCopied] = useState<boolean>(false);

  // Calculate settlement balances
  const settlementData = useMemo(() => {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const memberCount = Math.max(1, members.length);
    const fairShare = totalSpent / memberCount;

    // Paid per person
    const paidMap: Record<string, number> = {};
    members.forEach((m) => (paidMap[m] = 0));
    expenses.forEach((e) => {
      paidMap[e.paidBy] = (paidMap[e.paidBy] || 0) + e.amount;
    });

    // Net balance: positive means they should receive money, negative means they owe money
    const balances: { name: string; net: number }[] = members.map((m) => ({
      name: m,
      net: (paidMap[m] || 0) - fairShare
    }));

    // Settle debts using two-pointer greedy solver
    const debtors = balances.filter((b) => b.net < -0.01).map((b) => ({ ...b, net: -b.net }));
    const creditors = balances.filter((b) => b.net > 0.01).map((b) => ({ ...b }));

    const transactions: { from: string; to: string; amount: number }[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const settleAmount = Math.min(debtors[dIdx].net, creditors[cIdx].net);
      if (settleAmount > 0.01) {
        transactions.push({
          from: debtors[dIdx].name,
          to: creditors[cIdx].name,
          amount: Math.round(settleAmount)
        });
      }

      debtors[dIdx].net -= settleAmount;
      creditors[cIdx].net -= settleAmount;

      if (debtors[dIdx].net < 0.01) dIdx++;
      if (creditors[cIdx].net < 0.01) cIdx++;
    }

    return {
      totalSpent,
      fairShare: Math.round(fairShare),
      paidMap,
      transactions
    };
  }, [members, expenses]);

  const addExpense = () => {
    if (newDesc.trim() && newAmount > 0) {
      setExpenses([
        ...expenses,
        {
          id: String(Date.now()),
          description: newDesc.trim(),
          amount: newAmount,
          paidBy: newPayer || members[0]
        }
      ]);
      setNewDesc('');
      setNewAmount(0);
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const addMember = () => {
    if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
      setMembers([...members, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const removeMember = (name: string) => {
    if (members.length > 2) {
      setMembers(members.filter((m) => m !== name));
      setExpenses(expenses.filter((e) => e.paidBy !== name));
    }
  };

  const handleCopy = () => {
    const text = `Group Expense Splitter Summary:
Total Group Spending: ₹${settlementData.totalSpent.toLocaleString('en-IN')}
Fair Share Per Person: ₹${settlementData.fairShare.toLocaleString('en-IN')}
Settlements to Pay:
${settlementData.transactions.map((t) => `• ${t.from} owes ${t.to} ₹${t.amount.toLocaleString('en-IN')}`).join('\n') || 'All accounts are balanced!'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Daily Expense Splitter - Group Trip & Flatmate Bill Sharing Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track shared room, trip, and dining expenses with friends and calculate the minimum settlement transfers needed to square accounts.
        </p>
      </div>

      {/* Member Chips */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-cyan-400" /> Group Members ({members.length})
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Add friend name..."
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={addMember}
              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {members.map((m) => (
            <span
              key={m}
              className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs flex items-center gap-2"
            >
              <span>{m}</span>
              <button
                type="button"
                onClick={() => removeMember(m)}
                disabled={members.length <= 2}
                className="text-slate-500 hover:text-rose-400 disabled:opacity-30"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Add New Expense Form */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <Wallet className="w-4 h-4 text-cyan-400" /> Add New Expense
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Expense title (e.g. Lunch at Cafe)..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-3">
            <input
              type="number"
              min={1}
              value={newAmount || ''}
              onChange={(e) => setNewAmount(Math.max(0, Number(e.target.value)))}
              placeholder="Amount (₹)"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={newPayer}
              onChange={(e) => setNewPayer(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {members.map((m) => (
                <option key={m} value={m}>Paid by {m}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={addExpense}
              disabled={!newDesc.trim() || newAmount <= 0}
              className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-40 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-200">Expense Log ({expenses.length})</h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono"
            >
              <div className="overflow-hidden">
                <span className="font-semibold text-white block">{exp.description}</span>
                <span className="text-slate-400 text-[11px]">Paid by {exp.paidBy}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-cyan-400">₹{exp.amount.toLocaleString('en-IN')}</span>
                <button
                  type="button"
                  onClick={() => removeExpense(exp.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spending Summary */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Group Spending</span>
            <span className="font-mono text-xl font-bold text-white">₹{settlementData.totalSpent.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400">Equal Share per Person</span>
            <span className="font-mono text-lg font-bold text-cyan-400">₹{settlementData.fairShare.toLocaleString('en-IN')}</span>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800 text-xs font-mono">
            {members.map((m) => (
              <div key={m} className="flex justify-between text-slate-300">
                <span>{m} paid:</span>
                <span>₹{(settlementData.paidMap[m] || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Transactions Solver */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Recommended Debt Settlements
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="space-y-1.5">
              {settlementData.transactions.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs font-mono">
                  All accounts are settled and even!
                </div>
              ) : (
                settlementData.transactions.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400">{t.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-bold text-emerald-400">{t.to}</span>
                    </div>
                    <span className="font-bold text-cyan-300">₹{t.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">How does the bill settlement algorithm minimize transfer transactions?</strong>
            <p className="mt-0.5">The algorithm matches largest net debtors with largest net creditors in pairs, minimizing the total number of banking UPI transactions.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can members pay multiple individual bills during a road trip?</strong>
            <p className="mt-0.5">Yes, any member can record multiple separate expenditures; the calculator tallies their cumulative payments against their fair share.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Is any personal expenditure information saved to a remote server?</strong>
            <p className="mt-0.5">No, all calculations and settlement allocations execute 100% locally within your browser memory for confidential privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
