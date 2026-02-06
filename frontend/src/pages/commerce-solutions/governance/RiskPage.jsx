import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckCircle, AlertTriangle, FileText, Target, Shield, TrendingUp, Zap, Activity, AlertCircle } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const RiskPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const riskCategories = [
    {
      category: 'Credit Risk',
      description: 'Risk of customer non-payment',
      factors: ['Payment history', 'Credit score', 'Financial health', 'Industry stability'],
      mitigation: ['Credit limits', 'Payment terms', 'Credit insurance', 'Collection process']
    },
    {
      category: 'Concentration Risk',
      description: 'Over-reliance on single customer/sector',
      factors: ['Revenue concentration', 'Geographic concentration', 'Sector exposure', 'Key customer dependency'],
      mitigation: ['Diversification targets', 'Concentration limits', 'Strategic pricing', 'Growth incentives']
    },
    {
      category: 'Margin Risk',
      description: 'Risk of unprofitable deals',
      factors: ['Cost estimation accuracy', 'Pricing discipline', 'Scope creep', 'Competitive pressure'],
      mitigation: ['Minimum margin rules', 'Cost verification', 'Change order process', 'Deal scoring']
    },
    {
      category: 'Compliance Risk',
      description: 'Regulatory and legal exposure',
      factors: ['Contract terms', 'Export controls', 'Data privacy', 'Industry regulations'],
      mitigation: ['Legal review', 'Compliance checklists', 'Training', 'Audit process']
    }
  ];

  const riskScoring = {
    factors: [
      { factor: 'Customer Credit Score', weight: '25%', scoring: 'External credit rating + payment history' },
      { factor: 'Deal Size vs. Norm', weight: '20%', scoring: 'Larger = higher risk factor' },
      { factor: 'Margin Level', weight: '20%', scoring: 'Lower margin = higher risk' },
      { factor: 'Customer Tenure', weight: '15%', scoring: 'New customers = higher risk' },
      { factor: 'Industry Risk', weight: '10%', scoring: 'Sector volatility and concentration' },
      { factor: 'Geographic Risk', weight: '10%', scoring: 'Country risk, currency risk' }
    ],
    thresholds: [
      { score: '0-30', level: 'Low Risk', action: 'Auto-approve within limits', color: 'green' },
      { score: '31-60', level: 'Medium Risk', action: 'Manager review required', color: 'yellow' },
      { score: '61-80', level: 'High Risk', action: 'Director approval required', color: 'orange' },
      { score: '81-100', level: 'Critical Risk', action: 'VP/CFO approval + risk mitigation', color: 'red' }
    ]
  };

  const realScenarios = [
    {
      title: 'The Concentration Crisis',
      company: 'B2B Services Company',
      situation: 'Top customer represented 45% of revenue. Customer lost to competitor. Revenue collapsed.',
      riskIgnored: {
        concentration: '45% of revenue from one customer',
        warning: 'Finance flagged multiple times',
        response: '"They\'ll never leave, we\'re strategic"',
        outcome: 'Customer left. 45% revenue loss. Layoffs followed.'
      },
      withRiskEngine: {
        detection: 'System alerts when any customer exceeds 20% of revenue',
        actions: [
          'Pricing incentives for diversification',
          'Strategic pursuit of new customers',
          'Contingency planning for key accounts',
          'Board reporting on concentration'
        ],
        outcome: 'Would have driven diversification. Maximum exposure 25%, manageable loss.'
      }
    },
    {
      title: 'The Hidden Margin Risk',
      company: 'Project Services Firm',
      situation: 'Won 12 large deals in Q1. Celebrated. Q3 realized 8 of them were underwater.',
      problem: {
        dealsClosed: '12 major deals, $8M total',
        underWater: '8 deals below breakeven',
        rootCause: 'Cost estimates were 40% low on average',
        totalLoss: '$1.2M on "won" deals'
      },
      withRiskEngine: {
        controls: [
          'Cost estimate validation before quote',
          'Margin risk score based on estimate confidence',
          'Higher scrutiny for below-average margin deals',
          'Historical accuracy tracking by estimator'
        ],
        outcome: 'Low-confidence estimates flagged. 6 deals would have been re-scoped or declined.'
      }
    }
  ];

  const riskDashboard = [
    { metric: 'Total Credit Exposure', value: '$4.2M', limit: '$5M', status: 'warning' },
    { metric: 'Customer Concentration (Top 5)', value: '62%', limit: '50%', status: 'danger' },
    { metric: 'Avg Deal Margin', value: '28%', limit: '25% min', status: 'ok' },
    { metric: 'High Risk Deals in Pipeline', value: '8', limit: '< 10', status: 'warning' },
    { metric: 'Overdue Receivables', value: '$380K', limit: '< $500K', status: 'ok' },
    { metric: 'Non-Standard Contract Terms', value: '23', limit: '< 15', status: 'danger' }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/governance" className="flex items-center gap-2 text-slate-600 hover:text-slate-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Governance Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl flex items-center justify-center shadow-xl">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Risk Engine</h1>
            <p className="text-2xl text-slate-600">Automated Risk Scoring & Early Warning</p>
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-red-900 mb-2">
            <strong>Purpose:</strong> Identify and quantify commercial risks before they become problems. Enable informed risk-taking, not blind risk-taking.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Automated Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Early Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Real-Time Monitoring</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'categories', label: 'Risk Categories', icon: Shield },
              { key: 'scoring', label: 'Risk Scoring', icon: BarChart3 },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Risk Dashboard Example</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {riskDashboard.map((item, index) => (
                  <div key={`item-${index}`} className={`p-4 rounded-2xl border-2 ${
                    item.status === 'ok' ? 'bg-green-50 border-green-200' :
                    item.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">{item.metric}</span>
                      {item.status === 'ok' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                       item.status === 'warning' ? <AlertCircle className="h-5 w-5 text-yellow-600" /> :
                       <AlertTriangle className="h-5 w-5 text-red-600" />}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                    <div className="text-xs text-slate-500">Limit: {item.limit}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Risk is Not the Enemy</h2>
              <p className="text-xl leading-relaxed">
                Business requires risk-taking. The goal isn't to eliminate risk—it's to take risks knowingly, with appropriate controls. The Risk Engine makes risk visible so you can manage it.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            {riskCategories.map((cat, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900">{cat.category}</h3>
                  <p className="text-slate-700">{cat.description}</p>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Risk Factors:</h4>
                    <ul className="space-y-2">
                      {cat.factors.map((f, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700 bg-red-50 p-2 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 mb-3">Mitigation:</h4>
                    <ul className="space-y-2">
                      {cat.mitigation.map((m, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700 bg-green-50 p-2 rounded-lg">
                          <Shield className="h-4 w-4 text-green-600" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scoring' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Risk Scoring Model</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 font-bold text-slate-900">Factor</th>
                      <th className="text-left p-3 font-bold text-slate-900">Weight</th>
                      <th className="text-left p-3 font-bold text-slate-900">Scoring Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskScoring.factors.map((f, i) => (
                      <tr key={`item-${i}`} className="border-t border-slate-200">
                        <td className="p-3 font-semibold text-slate-900">{f.factor}</td>
                        <td className="p-3">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold">{f.weight}</span>
                        </td>
                        <td className="p-3 text-slate-600">{f.scoring}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Risk Thresholds</h3>
              <div className="space-y-4">
                {riskScoring.thresholds.map((t, i) => (
                  <div key={`item-${i}`} className={`p-4 rounded-xl border-2 ${
                    t.color === 'green' ? 'bg-green-50 border-green-200' :
                    t.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                    t.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-bold text-lg ${
                          t.color === 'green' ? 'text-green-900' :
                          t.color === 'yellow' ? 'text-yellow-900' :
                          t.color === 'orange' ? 'text-orange-900' :
                          'text-red-900'
                        }`}>{t.level}</span>
                        <span className="text-slate-600 ml-3">Score: {t.score}</span>
                      </div>
                      <span className="text-sm text-slate-700">{t.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-8">
            {realScenarios.map((scenario, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{scenario.title}</h2>
                  <p className="text-xl opacity-90">{scenario.company}</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Situation:</h3>
                    <p className="text-lg text-slate-700">{scenario.situation}</p>
                  </div>

                  {scenario.riskIgnored && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Risk Ignored</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.riskIgnored).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.problem && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Problem</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.problem).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.withRiskEngine && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Risk Engine</h3>
                      {scenario.withRiskEngine.detection && (
                        <p className="text-slate-700 mb-3">{scenario.withRiskEngine.detection}</p>
                      )}
                      {scenario.withRiskEngine.actions && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withRiskEngine.actions.map((a, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                      {scenario.withRiskEngine.controls && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withRiskEngine.controls.map((c, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <Shield className="h-4 w-4 text-green-600" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="font-bold text-green-800">{scenario.withRiskEngine.outcome}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Take Risks Knowingly</h2>
          <p className="text-xl mb-6 opacity-90">
            Automated risk scoring and early warning for informed decision-making
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:shadow-xl transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </IBCommerceHub>
  );
};

export default RiskPage;
