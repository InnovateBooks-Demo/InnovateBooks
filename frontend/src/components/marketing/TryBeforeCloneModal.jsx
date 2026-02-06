import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, Play, Pause, ChevronLeft, ChevronRight, 
  Zap, CheckCircle, ArrowRight, Sparkles, Eye,
  BarChart3, Users, DollarSign, TrendingUp, Shield,
  Clock, Activity, Layers, Brain, RefreshCw
} from 'lucide-react';

/**
 * TryBeforeCloneModal - Interactive demo modal shown before user clones/activates a module
 * Shows live preview of module capabilities with simulated data
 * 
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Close handler
 * @param {function} onProceed - Handler when user clicks "Activate Module"
 * @param {string} moduleType - Type of module: 'commerce' | 'finance' | 'operations' | 'workforce' | 'capital' | 'intelligence'
 * @param {string} moduleName - Display name of the module
 */
const TryBeforeCloneModal = ({ 
  isOpen, 
  onClose, 
  onProceed, 
  moduleType = 'commerce',
  moduleName = 'IB Commerce'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [demoData, setDemoData] = useState({});

  const moduleConfigs = {
    commerce: {
      color: 'blue',
      gradient: 'from-blue-500 to-blue-700',
      icon: DollarSign,
      steps: [
        {
          title: 'Lead Management',
          description: 'Track leads from first contact to conversion with AI-powered scoring',
          demo: 'leads',
          metrics: [
            { label: 'Active Leads', value: 847, trend: '+12%' },
            { label: 'Conversion Rate', value: '23.4%', trend: '+5.2%' },
            { label: 'Pipeline Value', value: '₹2.4Cr', trend: '+18%' }
          ]
        },
        {
          title: 'Quote-to-Contract',
          description: 'Streamline your sales process with automated pricing and approvals',
          demo: 'quotes',
          metrics: [
            { label: 'Active Quotes', value: 156, trend: '+8%' },
            { label: 'Win Rate', value: '67%', trend: '+3%' },
            { label: 'Avg Deal Size', value: '₹4.2L', trend: '+15%' }
          ]
        },
        {
          title: 'Revenue Intelligence',
          description: 'AI-powered forecasting and revenue analytics',
          demo: 'revenue',
          metrics: [
            { label: 'Monthly Revenue', value: '₹1.8Cr', trend: '+22%' },
            { label: 'Forecast Accuracy', value: '94%', trend: '+2%' },
            { label: 'Churn Risk', value: '3.2%', trend: '-1.5%' }
          ]
        }
      ]
    },
    finance: {
      color: 'green',
      gradient: 'from-green-500 to-emerald-700',
      icon: BarChart3,
      steps: [
        {
          title: 'Accounts Receivable',
          description: 'Automated invoicing, collections, and cash application',
          demo: 'ar',
          metrics: [
            { label: 'Outstanding AR', value: '₹45.2L', trend: '-8%' },
            { label: 'DSO', value: '28 days', trend: '-5 days' },
            { label: 'Collection Rate', value: '96%', trend: '+2%' }
          ]
        },
        {
          title: 'Accounts Payable',
          description: 'Bill matching, approval workflows, and vendor management',
          demo: 'ap',
          metrics: [
            { label: 'Pending Bills', value: 23, trend: '-12' },
            { label: 'DPO', value: '35 days', trend: 'Optimal' },
            { label: 'Early Pay Discount', value: '₹2.1L', trend: '+15%' }
          ]
        },
        {
          title: 'Financial Close',
          description: 'Automated period-end close with compliance checks',
          demo: 'close',
          metrics: [
            { label: 'Close Time', value: '3 days', trend: '-2 days' },
            { label: 'Automation Rate', value: '87%', trend: '+12%' },
            { label: 'Compliance Score', value: '98%', trend: '+3%' }
          ]
        }
      ]
    },
    operations: {
      color: 'orange',
      gradient: 'from-orange-500 to-amber-700',
      icon: Activity,
      steps: [
        {
          title: 'Project Management',
          description: 'Real-time project P&L tracking with resource optimization',
          demo: 'projects',
          metrics: [
            { label: 'Active Projects', value: 24, trend: '+3' },
            { label: 'On-Budget', value: '91%', trend: '+8%' },
            { label: 'Utilization', value: '78%', trend: '+5%' }
          ]
        },
        {
          title: 'Inventory Control',
          description: 'Smart inventory management with demand forecasting',
          demo: 'inventory',
          metrics: [
            { label: 'SKUs Tracked', value: 1247, trend: '+156' },
            { label: 'Stockout Rate', value: '0.8%', trend: '-0.5%' },
            { label: 'Turn Ratio', value: '8.2x', trend: '+1.2x' }
          ]
        },
        {
          title: 'Asset Management',
          description: 'Complete asset lifecycle with depreciation automation',
          demo: 'assets',
          metrics: [
            { label: 'Total Assets', value: '₹4.2Cr', trend: '+₹45L' },
            { label: 'Utilization', value: '82%', trend: '+6%' },
            { label: 'Maintenance Due', value: 8, trend: '-3' }
          ]
        }
      ]
    },
    workforce: {
      color: 'purple',
      gradient: 'from-purple-500 to-violet-700',
      icon: Users,
      steps: [
        {
          title: 'Employee Management',
          description: 'Complete employee lifecycle with ROI tracking',
          demo: 'employees',
          metrics: [
            { label: 'Headcount', value: 156, trend: '+12' },
            { label: 'Avg Tenure', value: '3.2 yrs', trend: '+0.4' },
            { label: 'Employee ROI', value: '4.2x', trend: '+0.8x' }
          ]
        },
        {
          title: 'Payroll & Benefits',
          description: 'Automated payroll with compliance and tax handling',
          demo: 'payroll',
          metrics: [
            { label: 'Monthly Payroll', value: '₹28.5L', trend: '+₹2.1L' },
            { label: 'Compliance', value: '100%', trend: 'Maintained' },
            { label: 'Benefits Cost', value: '₹4.2L', trend: 'Optimized' }
          ]
        },
        {
          title: 'Performance Analytics',
          description: 'AI-powered performance insights and predictions',
          demo: 'performance',
          metrics: [
            { label: 'Avg Rating', value: '4.2/5', trend: '+0.3' },
            { label: 'Top Performers', value: '23%', trend: '+5%' },
            { label: 'Flight Risk', value: '8%', trend: '-3%' }
          ]
        }
      ]
    },
    capital: {
      color: 'red',
      gradient: 'from-red-500 to-rose-700',
      icon: Shield,
      steps: [
        {
          title: 'Cap Table Management',
          description: 'Real-time ownership tracking with dilution analysis',
          demo: 'captable',
          metrics: [
            { label: 'Shareholders', value: 24, trend: '+3' },
            { label: 'Valuation', value: '₹85Cr', trend: '+₹15Cr' },
            { label: 'ESOP Pool', value: '12%', trend: 'Reserved' }
          ]
        },
        {
          title: 'Treasury & Liquidity',
          description: 'Cash position tracking with runway forecasting',
          demo: 'treasury',
          metrics: [
            { label: 'Cash Position', value: '₹4.2Cr', trend: '+₹0.8Cr' },
            { label: 'Runway', value: '18 months', trend: '+3 months' },
            { label: 'Burn Rate', value: '₹23L/mo', trend: '-₹2L' }
          ]
        },
        {
          title: 'Debt Management',
          description: 'Track loans, covenants, and repayment schedules',
          demo: 'debt',
          metrics: [
            { label: 'Total Debt', value: '₹1.5Cr', trend: '-₹0.2Cr' },
            { label: 'Debt/Equity', value: '0.35', trend: '-0.05' },
            { label: 'Covenants', value: '100%', trend: 'Compliant' }
          ]
        }
      ]
    },
    intelligence: {
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-700',
      icon: Brain,
      steps: [
        {
          title: 'Predictive Analytics',
          description: 'AI-powered forecasting across all business metrics',
          demo: 'predictions',
          metrics: [
            { label: 'Forecast Accuracy', value: '94%', trend: '+3%' },
            { label: 'Anomalies Detected', value: 12, trend: '-5' },
            { label: 'Models Active', value: 8, trend: '+2' }
          ]
        },
        {
          title: 'Risk Intelligence',
          description: 'Real-time risk scoring and mitigation recommendations',
          demo: 'risk',
          metrics: [
            { label: 'Risk Score', value: '72/100', trend: '-8' },
            { label: 'Alerts', value: 3, trend: '-2' },
            { label: 'Compliance', value: '98%', trend: '+2%' }
          ]
        },
        {
          title: 'Business Insights',
          description: 'Automated insights and recommendations',
          demo: 'insights',
          metrics: [
            { label: 'Insights Generated', value: 47, trend: '+12' },
            { label: 'Actions Taken', value: '78%', trend: '+15%' },
            { label: 'Value Created', value: '₹12L', trend: '+₹3L' }
          ]
        }
      ]
    }
  };

  const config = moduleConfigs[moduleType] || moduleConfigs.commerce;
  const totalSteps = config.steps.length;
  const Icon = config.icon;

  // Simulate live data updates
  useEffect(() => {
    if (!isOpen || !isAnimating) return;

    const interval = setInterval(() => {
      setDemoData(prev => {
        const newData = { ...prev };
        config.steps[currentStep].metrics.forEach((metric, i) => {
          const baseValue = typeof metric.value === 'string' 
            ? parseFloat(metric.value.replace(/[^0-9.]/g, '')) || 0
            : metric.value;
          newData[`metric_${i}`] = baseValue + (Math.random() - 0.5) * baseValue * 0.05;
        });
        return newData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, isAnimating, currentStep, config.steps]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Auto-advance demo
  useEffect(() => {
    if (!isOpen || !isAnimating) return;

    const timer = setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        handleNext();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen, isAnimating, currentStep, totalSteps, handleNext]);

  if (!isOpen) return null;

  const currentStepData = config.steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{moduleName}</h2>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    Interactive Demo
                  </span>
                </div>
                <p className="text-white/80">Experience the module before activating</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 mt-6">
            {config.steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-white' 
                    : index < currentStep 
                      ? 'bg-white/60' 
                      : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-8">
          {/* Step Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 bg-${config.color}-100 text-${config.color}-700 text-xs font-semibold rounded-full`}>
                  Step {currentStep + 1} of {totalSteps}
                </span>
                {isAnimating && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Live Demo
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{currentStepData.title}</h3>
              <p className="text-slate-600 mt-1">{currentStepData.description}</p>
            </div>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`p-3 rounded-xl transition-colors ${
                isAnimating 
                  ? 'bg-slate-100 text-slate-600' 
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              {isAnimating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {currentStepData.metrics.map((metric, index) => (
              <div
                key={index}
                className={`p-5 rounded-2xl bg-gradient-to-br from-${config.color}-50 to-${config.color}-100 border border-${config.color}-200 transform hover:scale-105 transition-all`}
              >
                <p className="text-sm text-slate-600 mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-slate-900">
                  {typeof metric.value === 'number' 
                    ? Math.round(demoData[`metric_${index}`] || metric.value).toLocaleString()
                    : metric.value
                  }
                </p>
                <p className={`text-sm font-semibold mt-1 ${
                  metric.trend.includes('+') || metric.trend.includes('-') && metric.trend.includes('days')
                    ? 'text-green-600' 
                    : metric.trend.includes('-')
                      ? 'text-red-600'
                      : 'text-slate-500'
                }`}>
                  {metric.trend}
                </p>
              </div>
            ))}
          </div>

          {/* Demo Preview Area */}
          <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mb-8`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <span className="text-xs text-slate-500 font-mono">demo.innovatebooks.in</span>
            </div>
            
            {/* Simulated Dashboard */}
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{currentStepData.title}</p>
                  <p className="text-slate-400 text-sm">Real-time data visualization</p>
                </div>
              </div>
              
              {/* Animated Chart Bars */}
              <div className="flex items-end gap-2 h-32">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 bg-gradient-to-t ${config.gradient} rounded-t-lg transition-all duration-500`}
                    style={{ 
                      height: `${30 + Math.random() * 70}%`,
                      opacity: isAnimating ? 0.6 + Math.random() * 0.4 : 0.8
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                currentStep === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentStep < totalSteps - 1 ? (
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
                >
                  Next Feature
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={onProceed}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all`}
                >
                  <Zap className="h-5 w-5" />
                  Activate {moduleName}
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-3">What you'll get with {moduleName}:</p>
          <div className="flex flex-wrap gap-3">
            {['Real-time Analytics', 'AI Insights', 'Automated Workflows', 'Mobile App', 'API Access', 'Custom Reports'].map((feature, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-slate-700 border border-slate-200"
              >
                <CheckCircle className={`h-4 w-4 text-${config.color}-500`} />
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryBeforeCloneModal;
