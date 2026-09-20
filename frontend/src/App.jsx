import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CloudRain,
  Droplets,
  FileText,
  HeartPulse,
  Home,
  Languages,
  MapPinned,
  Milk,
  MilkOff,
  Mic,
  Plus,
  Stethoscope,
  Trash2,
  Settings,
  ShieldCheck,
  Thermometer,
  UtensilsCrossed,
  Volume2,
  Wheat,
  Clock3,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from './services/api';
import { getTranslation, defaultLanguage } from './translations/i18n';

const BrandMarkIcon = ({ size = 28, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="brandShield" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1F8F68" />
        <stop offset="1" stopColor="#14543D" />
      </linearGradient>
    </defs>
    <path d="M32 6L49.5 13.5V29C49.5 40.5 41.8 49.9 32 56C22.2 49.9 14.5 40.5 14.5 29V13.5L32 6Z" fill="url(#brandShield)" />
    <path d="M33.5 18.5C37.3 18.5 40.5 21.7 40.5 25.5V32.5C40.5 35 38.8 36.9 36.8 38.1L33.2 40.6C32.2 41.3 30.8 41.3 29.8 40.6L26.2 38.1C24.2 36.9 22.5 35 22.5 32.5V25.5C22.5 21.7 25.7 18.5 29.5 18.5H33.5Z" fill="#EAFBF4" />
    <path d="M26 25.5C26 22.8 28.3 20.5 31 20.5H33C35.7 20.5 38 22.8 38 25.5V29.2C38 31.5 36.3 33.4 34.1 33.7L33.5 33.7C32.8 33.7 32 33.4 31.3 33.1L29.7 32.4C27.9 31.6 26.6 29.8 26.6 27.8V25.5H26Z" fill="#1C7B5E" />
    <path d="M22.5 25.9C22.5 23.9 24.2 22.3 26.2 22.3C27.7 22.3 29 23.1 29.7 24.5L30.7 26.6L29.4 26.9L28.1 25.1C27.7 24.5 27.1 24.1 26.4 24.1C25.6 24.1 24.9 24.8 24.9 25.7V31.7H22.5V25.9Z" fill="#EAFBF4" />
    <path d="M41.5 25.9C41.5 23.9 39.8 22.3 37.8 22.3C36.3 22.3 35 23.1 34.3 24.5L33.3 26.6L34.6 26.9L35.9 25.1C36.3 24.5 36.9 24.1 37.6 24.1C38.4 24.1 39.1 24.8 39.1 25.7V31.7H41.5V25.9Z" fill="#EAFBF4" />
    <path d="M25.8 35.8C27.4 34.9 28.8 34.6 32 34.6C35.2 34.6 36.6 34.9 38.2 35.8" stroke="#14543D" strokeWidth="2.1" strokeLinecap="round" />
    <path d="M31 41.5V47.5" stroke="#EAFBF4" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M26.5 43.2C27.7 42.2 28.9 41.7 31 41.7C33.1 41.7 34.3 42.2 35.5 43.2" stroke="#EAFBF4" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M23 31C23 29.3 24.3 28 26 28H27.5V31.5H23V31Z" fill="#D9F7EA" />
    <path d="M41 31C41 29.3 39.7 28 38 28H36.5V31.5H41V31Z" fill="#D9F7EA" />
    <circle cx="29.2" cy="28.5" r="1.5" fill="#14543D" />
    <circle cx="34.8" cy="28.5" r="1.5" fill="#14543D" />
  </svg>
);

const NAV_ITEMS = [
  { key: 'dashboard', icon: Home },
  { key: 'cows', icon: HeartPulse },
  { key: 'sensorMonitoring', icon: Activity },
  { key: 'predictions', icon: ShieldCheck },
  { key: 'farmManagement', icon: ClipboardCheck, label: 'Farm Management' },
  { key: 'aiMastitis', icon: HeartPulse, label: 'AI Mastitis Monitor' },
  { key: 'gisRiskHotspots', icon: MapPinned, label: 'GIS Risk Hotspots' },
  { key: 'masterTest', icon: ClipboardCheck },
  { key: 'alerts', icon: Bell },
  { key: 'reports', icon: FileText },
  { key: 'settings', icon: Settings },
];

const HYGIENE_CHECKLIST_ITEMS = [
  {
    id: 'wash-hands',
    title: 'Wash Hands',
    message: 'Have you washed your hands properly?',
    status: 'pending',
  },
  {
    id: 'wear-gloves',
    title: 'Wear Clean Gloves',
    message: 'Wear clean gloves before milking.',
    status: 'pending',
  },
  {
    id: 'check-gloves',
    title: 'Check Glove Cleanliness',
    message: 'Make sure your gloves are clean.',
    status: 'pending',
  },
  {
    id: 'clean-equipment',
    title: 'Clean Milking Equipment',
    message: 'Make sure the milking machine and milk-contact parts are clean.',
    status: 'pending',
  },
  {
    id: 'check-area',
    title: 'Check Milking Area',
    message: 'Make sure the milking area is clean.',
    status: 'pending',
  },
];

const MILKING_SCHEDULE = [
  {
    shift: 'Morning Milking',
    time: '5:30 AM',
    herd: 'Herd A / Cow C-101 to C-120',
    status: 'Pending',
    statusClass: 'pending',
  },
  {
    shift: 'Evening Milking',
    time: '5:00 PM',
    herd: 'Herd B / Cow C-201 to C-240',
    status: 'Pending',
    statusClass: 'pending',
  },
];

const EQUIPMENT_CLEANING_RECORDS = [
  {
    name: 'Milking Clusters',
    lastCleaned: '2026-09-10 06:15 AM',
    cleaningStatus: '✓ Cleaned',
    condition: '✓ Good',
    damageStatus: 'No damage',
    maintenanceRequired: false,
    maintenanceLabel: 'No maintenance required',
  },
  {
    name: 'Vacuum Line',
    lastCleaned: '2026-09-09 07:00 PM',
    cleaningStatus: '⚠ Needs attention',
    condition: '⚠ Needs Maintenance',
    damageStatus: 'Minor wear',
    maintenanceRequired: true,
    maintenanceLabel: 'Maintenance Required',
  },
  {
    name: 'Milk Receiver',
    lastCleaned: '2026-09-08 05:45 AM',
    cleaningStatus: '✕ Overdue',
    condition: '✕ Damaged',
    damageStatus: 'Damaged seal',
    maintenanceRequired: true,
    maintenanceLabel: 'Maintenance Required',
  },
];

const SHED_CLEANING_SCHEDULE = [
  {
    activity: 'Shed Cleaning',
    date: 'Today',
    time: '6:00 AM',
    frequency: 'Daily',
    status: 'Completed',
    statusClass: 'completed',
  },
  {
    activity: 'Deep Cleaning',
    date: 'Sunday',
    time: '4:00 PM',
    frequency: 'Weekly',
    status: 'Pending',
    statusClass: 'pending',
  },
];

const FARM_MANAGEMENT_OVERVIEW = {
  nextMilking: '5:30 PM',
  equipment: 'Good',
  shedCleaning: 'Completed',
  pendingTasks: 1,
};

const riskColors = {
  'HIGH RISK': '#ef4444',
  'MODERATE RISK': '#f59e0b',
  'LOW RISK': '#3b82f6',
  'NO RISK': '#22c55e',
};

const careRecommendationIcons = [Droplets, Trash2, Thermometer, ShieldCheck, Stethoscope];
const dietPlanIcons = [Droplets, ShieldCheck, Wheat, UtensilsCrossed, Clock3];

const defaultSummary = {
  total_cows: 50,
  high_risk: 5,
  moderate_risk: 12,
  low_risk: 12,
  no_risk: 21,
  healthy: 21,
};

const futureRiskTrend = [
  { day: 'Today', risk: 42, level: 'moderate', marker: '🟡', color: '#f59e0b' },
  { day: 'Tomorrow', risk: 55, level: 'moderate', marker: '🟡', color: '#f59e0b' },
  { day: 'Day 3', risk: 68, level: 'elevated', marker: '🟠', color: '#f97316' },
  { day: 'Day 4', risk: 82, level: 'high', marker: '🔴', color: '#ef4444' },
];

const GIS_RISK_SUMMARY = {
  totalFarms: 25,
  totalCows: 150,
  highRiskCows: 8,
  moderateRiskCows: 12,
  activeHotspots: 3,
};

const GIS_FARM_DATA = [
  {
    farmId: 'FARM-001',
    label: 'Erode North',
    location: 'Erode',
    x: 20,
    y: 36,
    totalCows: 50,
    highRisk: 4,
    moderateRisk: 8,
    lowRisk: 10,
    noRisk: 28,
    riskLevel: 'NO RISK',
    riskScore: 18,
    primaryCowId: 'C-101',
    cows: [
      { cowId: 'C-101', risk: 'NO RISK', score: 18, quarter: 'Q4', milkEC: '3.9', milkQuantity: '24L', activity: '72%', rumination: '310', alert: 'No alert' },
      { cowId: 'C-102', risk: 'LOW RISK', score: 34, quarter: 'Q2', milkEC: '4.2', milkQuantity: '22L', activity: '68%', rumination: '296', alert: 'Monitor' },
      { cowId: 'C-103', risk: 'MODERATE RISK', score: 52, quarter: 'Q1', milkEC: '5.4', milkQuantity: '20L', activity: '58%', rumination: '275', alert: 'Review' },
      { cowId: 'C-104', risk: 'HIGH RISK', score: 82, quarter: 'Q3', milkEC: '6.8', milkQuantity: '17L', activity: '43%', rumination: '230', alert: 'Immediate follow-up' },
    ],
    previousAlerts: ['Lower milk yield noted', 'Temperature rise', 'EC trending upward'],
  },
  {
    farmId: 'FARM-002',
    label: 'Arachalur',
    location: 'Arachalur',
    x: 32,
    y: 46,
    totalCows: 34,
    highRisk: 2,
    moderateRisk: 5,
    lowRisk: 8,
    noRisk: 19,
    riskLevel: 'LOW RISK',
    riskScore: 32,
    primaryCowId: 'C-201',
    cows: [
      { cowId: 'C-201', risk: 'LOW RISK', score: 28, quarter: 'Q2', milkEC: '4.1', milkQuantity: '23L', activity: '74%', rumination: '318', alert: 'Watch EC' },
      { cowId: 'C-202', risk: 'MODERATE RISK', score: 48, quarter: 'Q4', milkEC: '5.1', milkQuantity: '18L', activity: '62%', rumination: '288', alert: 'Monitor alert' },
    ],
    previousAlerts: ['Reduced rumination', 'Milk conductivity elevated'],
  },
  {
    farmId: 'FARM-003',
    label: 'Mettupalayam',
    location: 'Mettupalayam',
    x: 42,
    y: 28,
    totalCows: 28,
    highRisk: 1,
    moderateRisk: 3,
    lowRisk: 7,
    noRisk: 17,
    riskLevel: 'LOW RISK',
    riskScore: 30,
    primaryCowId: 'C-301',
    cows: [
      { cowId: 'C-301', risk: 'LOW RISK', score: 26, quarter: 'Q1', milkEC: '4.0', milkQuantity: '25L', activity: '76%', rumination: '320', alert: 'Routine monitoring' },
    ],
    previousAlerts: ['Breeding stress', 'Manual check recommended'],
  },
  {
    farmId: 'FARM-004',
    label: 'Perundurai',
    location: 'Perundurai',
    x: 57,
    y: 38,
    totalCows: 40,
    highRisk: 3,
    moderateRisk: 7,
    lowRisk: 11,
    noRisk: 19,
    riskLevel: 'MODERATE RISK',
    riskScore: 51,
    primaryCowId: 'C-401',
    cows: [
      { cowId: 'C-401', risk: 'MODERATE RISK', score: 52, quarter: 'Q2', milkEC: '5.5', milkQuantity: '20L', activity: '60%', rumination: '270', alert: 'Follow-up' },
      { cowId: 'C-402', risk: 'HIGH RISK', score: 77, quarter: 'Q3', milkEC: '6.2', milkQuantity: '16L', activity: '48%', rumination: '247', alert: 'High risk' },
    ],
    previousAlerts: ['Hotspot cluster detected', 'EC rise across block'],
  },
  {
    farmId: 'FARM-005',
    label: 'Sathyamangalam',
    location: 'Sathyamangalam',
    x: 68,
    y: 55,
    totalCows: 46,
    highRisk: 4,
    moderateRisk: 8,
    lowRisk: 9,
    noRisk: 25,
    riskLevel: 'HIGH RISK',
    riskScore: 76,
    primaryCowId: 'C-501',
    cows: [
      { cowId: 'C-501', risk: 'HIGH RISK', score: 79, quarter: 'Q1', milkEC: '6.9', milkQuantity: '16L', activity: '39%', rumination: '215', alert: 'Urgent' },
      { cowId: 'C-502', risk: 'MODERATE RISK', score: 61, quarter: 'Q3', milkEC: '5.8', milkQuantity: '18L', activity: '54%', rumination: '250', alert: 'Monitor' },
    ],
    previousAlerts: ['Multiple high-risk cows clustered', 'Heat stress pattern'],
  },
  {
    farmId: 'FARM-006',
    label: 'Gobi',
    location: 'Gobichettipalayam',
    x: 74,
    y: 30,
    totalCows: 36,
    highRisk: 2,
    moderateRisk: 4,
    lowRisk: 8,
    noRisk: 22,
    riskLevel: 'LOW RISK',
    riskScore: 29,
    primaryCowId: 'C-601',
    cows: [
      { cowId: 'C-601', risk: 'LOW RISK', score: 27, quarter: 'Q4', milkEC: '4.1', milkQuantity: '23L', activity: '73%', rumination: '305', alert: 'Routine' },
    ],
    previousAlerts: ['Milk flow stable', 'No urgent issues'],
  },
  {
    farmId: 'FARM-007',
    label: 'Kangayam',
    location: 'Kangayam',
    x: 52,
    y: 66,
    totalCows: 52,
    highRisk: 5,
    moderateRisk: 9,
    lowRisk: 12,
    noRisk: 26,
    riskLevel: 'HIGH RISK',
    riskScore: 81,
    primaryCowId: 'C-701',
    cows: [
      { cowId: 'C-701', risk: 'HIGH RISK', score: 84, quarter: 'Q2', milkEC: '7.2', milkQuantity: '15L', activity: '44%', rumination: '229', alert: 'Veterinary review' },
      { cowId: 'C-702', risk: 'MODERATE RISK', score: 56, quarter: 'Q3', milkEC: '5.7', milkQuantity: '18L', activity: '56%', rumination: '263', alert: 'Monitor' },
    ],
    previousAlerts: ['Repeated conductivity alerts', 'High-risk cluster in southern block'],
  },
  {
    farmId: 'FARM-008',
    label: 'Bhavani',
    location: 'Bhavani',
    x: 82,
    y: 48,
    totalCows: 30,
    highRisk: 1,
    moderateRisk: 3,
    lowRisk: 9,
    noRisk: 17,
    riskLevel: 'NO RISK',
    riskScore: 22,
    primaryCowId: 'C-801',
    cows: [
      { cowId: 'C-801', risk: 'NO RISK', score: 19, quarter: 'Q2', milkEC: '3.7', milkQuantity: '26L', activity: '80%', rumination: '330', alert: 'No alert' },
    ],
    previousAlerts: ['No recent alerts'],
  },
];

const GIS_HOTSPOTS = [
  { id: 'HOT-01', label: 'High-Risk Hotspot', x: 61, y: 42, radius: 18 },
  { id: 'HOT-02', label: 'High-Risk Hotspot', x: 70, y: 62, radius: 16 },
  { id: 'HOT-03', label: 'High-Risk Hotspot', x: 25, y: 32, radius: 14 },
];

const getPredictedRiskProfile = (farm, period) => {
  const timeOffsets = {
    Today: 0,
    'Last 7 Days': 9,
    'Last 30 Days': 18,
  };

  const riskScoreBase = Number(farm.riskScore) || 0;
  const riskLift = (farm.highRisk || 0) * 4 + (farm.moderateRisk || 0) * 2 + (timeOffsets[period] || 0);
  const predictedScore = Math.min(96, riskScoreBase + riskLift);

  let riskLevel = 'NO RISK';
  if (predictedScore >= 75) riskLevel = 'HIGH RISK';
  else if (predictedScore >= 50) riskLevel = 'MODERATE RISK';
  else if (predictedScore >= 25) riskLevel = 'LOW RISK';

  const forecastNote = {
    Today: 'Current risk snapshot for the herd today.',
    'Last 7 Days': 'Risk trend suggests a moderate increase in the next 7 days.',
    'Last 30 Days': 'Forecast indicates a larger risk cluster in the next 30 days if conditions continue.',
  }[period] || 'Current risk snapshot.';

  return {
    predictedRiskLevel: riskLevel,
    predictedRiskScore: Math.round(predictedScore),
    forecastNote,
  };
};

const reportSchedules = [
  {
    key: 'daily',
    label: 'Daily report',
    icon: Clock3,
    frequency: 'Every day at 6:00 PM',
    nextRun: 'Today, 6:00 PM',
    delivery: 'Farm dashboard and downloadable PDF',
    includes: ['New sensor readings', 'High-risk cows', 'Daily milk and activity changes'],
  },
  {
    key: 'weekly',
    label: 'Weekly report',
    icon: CalendarDays,
    frequency: 'Every Monday at 7:00 AM',
    nextRun: 'Monday, 7:00 AM',
    delivery: 'Farm dashboard and downloadable PDF',
    includes: ['Weekly herd health summary', 'Risk trend by cow', 'Milk yield and activity averages'],
  },
  {
    key: 'cowHealth',
    label: 'Cow health report',
    icon: HeartPulse,
    frequency: 'On demand for a selected cow',
    nextRun: 'Available now',
    delivery: 'Cow profile and downloadable PDF',
    includes: ['Current risk score', 'Sensor history and warning signs', 'Recommended follow-up actions'],
  },
  {
    key: 'herdRisk',
    label: 'Herd risk report',
    icon: ShieldCheck,
    frequency: 'Every morning at 8:00 AM',
    nextRun: 'Tomorrow, 8:00 AM',
    delivery: 'Farm dashboard and downloadable PDF',
    includes: ['Risk distribution across the herd', 'High-risk cow list', 'Priority monitoring recommendations'],
  },
];

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('smartMastitisLanguage') || defaultLanguage);
  const [page, setPage] = useState('dashboard');
  const [gisRiskFilter, setGisRiskFilter] = useState('All');
  const [gisTimeFilter, setGisTimeFilter] = useState('Today');
  const [selectedFarmId, setSelectedFarmId] = useState('FARM-001');
  const [cows, setCows] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(defaultSummary);
  const [selectedCowId, setSelectedCowId] = useState('C002');
  const [mastitisData, setMastitisData] = useState({ summary: { total_cows: 0, no_risk: 0, low_risk: 0, moderate_risk: 0, high_risk: 0, average_risk: 0 }, cows: [], model_status: 'SIMULATION', message: '' });
  const [mastitisSelectedCowId, setMastitisSelectedCowId] = useState('C001');
  const [mastitisFile, setMastitisFile] = useState(null);
  const [mastitisUploading, setMastitisUploading] = useState(false);
  const [mastitisUploadError, setMastitisUploadError] = useState('');
  const [mastitisTrend, setMastitisTrend] = useState([
    { day: 'Day 1', risk: 18 },
    { day: 'Day 2', risk: 30 },
    { day: 'Day 3', risk: 42 },
    { day: 'Day 4', risk: 58 },
    { day: 'Day 5', risk: 68 },
  ]);

  const getMostAffectedCowId = useCallback((cowList = []) => {
    if (!cowList.length) return null;
    return cowList.reduce((best, cow) => {
      const currentScore = Number(cow?.risk_score || 0);
      const bestScore = Number(best?.risk_score || 0);
      return currentScore > bestScore ? cow : best;
    }, cowList[0])?.cow_id || null;
  }, []);

  const refreshMastitisTrend = useCallback(async (cowId) => {
    if (!cowId) return;
    try {
      const trendResult = await api.getMastitisTrend(cowId);
      const nextTrend = trendResult?.trend || [];
      if (Array.isArray(nextTrend) && nextTrend.length) {
        setMastitisTrend(nextTrend);
      } else {
        setMastitisTrend([
          { day: 'Day 1', risk: 18 },
          { day: 'Day 2', risk: 30 },
          { day: 'Day 3', risk: 42 },
          { day: 'Day 4', risk: 58 },
          { day: 'Day 5', risk: 68 },
        ]);
      }
    } catch (err) {
      console.error('Mastitis trend load failed', err);
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [sensorForm, setSensorForm] = useState({
    cow_id: 'C002',
    sensor_id: 'S002',
    milk_yield: 8.2,
    milk_conductivity: 6.8,
    milk_ph: 6.1,
    milk_temperature: 39.6,
    activity: 45,
    rumination: 55,
    body_temperature: 39.5,
    farm_temperature: 31,
    humidity: 72,
    somatic_cell_count: 520000,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({ voice_enabled: true, auto_read_alerts: true, language });
  const [trendData, setTrendData] = useState([]);
  const [speechSupport, setSpeechSupport] = useState('speechSynthesis' in window);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const [cowHistoryOpen, setCowHistoryOpen] = useState(false);
  const [selectedReportKey, setSelectedReportKey] = useState('daily');
  const [milkMachineState, setMilkMachineState] = useState('normal');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [masterTestRecommendationVisible, setMasterTestRecommendationVisible] = useState(false);
  const [farmManagementView, setFarmManagementView] = useState('overview');
  const [hygieneChecklist, setHygieneChecklist] = useState(() => {
    const saved = localStorage.getItem('smartMastitisHygieneChecklist');
    if (!saved) return HYGIENE_CHECKLIST_ITEMS.map((item) => ({ ...item }));
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to read hygiene checklist', error);
      return HYGIENE_CHECKLIST_ITEMS.map((item) => ({ ...item }));
    }
  });
  const [hygieneHistory, setHygieneHistory] = useState(() => {
    const saved = localStorage.getItem('smartMastitisHygieneHistory');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to read hygiene history', error);
      return [];
    }
  });

  const t = (key) => getTranslation(language, key);

  const selectedCow = useMemo(
    () => cows.find((cow) => cow.cow_id === selectedCowId) || cows[0] || null,
    [cows, selectedCowId],
  );

  const mastitisSelectedCow = useMemo(
    () => mastitisData.cows.find((cow) => cow.cow_id === mastitisSelectedCowId) || mastitisData.cows[0] || null,
    [mastitisData.cows, mastitisSelectedCowId],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadMastitisData = async () => {
      try {
        const result = await api.getMastitisDemo();
        setMastitisData(result || { summary: { total_cows: 0, no_risk: 0, low_risk: 0, moderate_risk: 0, high_risk: 0, average_risk: 0 }, cows: [], model_status: 'SIMULATION', message: '' });
        if (result?.cows?.length) {
          setMastitisSelectedCowId(getMostAffectedCowId(result.cows));
        }
      } catch (err) {
        console.error('Mastitis demo load failed', err);
      }
    };

    loadMastitisData();
  }, []);

  useEffect(() => {
    if (!mastitisSelectedCowId) return;
    refreshMastitisTrend(mastitisSelectedCowId);
  }, [mastitisSelectedCowId, refreshMastitisTrend]);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        const [cowResult, alertResult, herdResult, settingsResult] = await Promise.allSettled([
          api.getCows(),
          api.getAlerts(),
          api.getHerdSummary(),
          api.getSettings(),
        ]);

        if (cowResult.status === 'fulfilled') {
          setCows(cowResult.value.cows || []);
        }
        if (alertResult.status === 'fulfilled') {
          setAlerts(alertResult.value.alerts || []);
        }
        if (herdResult.status === 'fulfilled') {
          setSummary({ ...defaultSummary, ...(herdResult.value || {}) });
        }
        if (settingsResult.status === 'fulfilled') {
          const settingsRes = settingsResult.value;
          if (settingsRes.language) {
            setLanguage(settingsRes.language);
          }
          setSettings({
            voice_enabled: settingsRes.voice_enabled === 'true' || settingsRes.voice_enabled === true,
            auto_read_alerts: settingsRes.auto_read_alerts === 'true' || settingsRes.auto_read_alerts === true,
            language: settingsRes.language || language,
          });
        }

        const failedRequests = [cowResult, alertResult, herdResult, settingsResult]
          .filter((result) => result.status === 'rejected');
        if (failedRequests.length > 0) {
          setError('Some farm data could not be loaded. Check that the backend is running on port 5000, then refresh.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load farm data');
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, []);

  useEffect(() => {
    if (selectedCow) {
      fetchTrend(selectedCow.cow_id);
    }
  }, [selectedCow]);

  useEffect(() => {
    localStorage.setItem('smartMastitisLanguage', language);
    api.setSettings({ language, voice_enabled: settings.voice_enabled, auto_read_alerts: settings.auto_read_alerts });
  }, [language]);

  useEffect(() => {
    localStorage.setItem('smartMastitisHygieneChecklist', JSON.stringify(hygieneChecklist));
  }, [hygieneChecklist]);

  useEffect(() => {
    localStorage.setItem('smartMastitisHygieneHistory', JSON.stringify(hygieneHistory));
  }, [hygieneHistory]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionAvailable(true);
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'ml' ? 'ml-IN' : 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };
      recognition.onend = () => {};
      window.__speechRecognition = recognition;
    }
  }, [language]);

  const fetchTrend = async (cowId) => {
    try {
      const data = await api.getTrend(cowId);
      setTrendData(data.trend || []);
    } catch (err) {
      console.error('Trend fetch failed', err);
    }
  };

  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    await api.setSettings({
      language,
      voice_enabled: newSettings.voice_enabled,
      auto_read_alerts: newSettings.auto_read_alerts,
    });
  };

  const stopVoiceAssistant = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (window.__speechRecognition) {
      try {
        window.__speechRecognition.stop();
      } catch (error) {
        console.warn('Speech recognition stop failed', error);
      }
    }
  };

  const handleVoiceToggle = async (nextState) => {
    const enabled = typeof nextState === 'boolean' ? nextState : !settings.voice_enabled;
    const newSettings = { ...settings, voice_enabled: enabled };
    setSettings(newSettings);
    await api.setSettings({
      language,
      voice_enabled: enabled,
      auto_read_alerts: newSettings.auto_read_alerts,
    });

    if (!enabled) {
      stopVoiceAssistant();
      setVoiceMessage('Voice assistant is off.');
      return;
    }

    speakText('Voice assistant is now on.');
  };

  const speakText = (text) => {
    if (!settings.voice_enabled || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    const trimmed = (text || '').trim();
    if (!trimmed) return;

    const preferredMap = { en: 'en-US', ta: 'ta-IN', hi: 'hi-IN', ml: 'ml-IN' };
    const target = preferredMap[language] || 'en-US';
    const languageCode = target.slice(0, 2).toLowerCase();
    const synth = window.speechSynthesis;
    let hasSpoken = false;
    const speakWithAvailableVoice = () => {
      const voices = synth.getVoices();
      const matched = voices.find((voice) => voice.lang.toLowerCase() === target.toLowerCase())
        || voices.find((voice) => voice.lang.toLowerCase().startsWith(languageCode))
        || voices.find((voice) => voice.name.toLowerCase().includes(languageCode));

      if (!matched) {
        if (language !== 'en') {
          const languageNames = { ta: 'Tamil', hi: 'Hindi', ml: 'Malayalam' };
          setVoiceMessage(`${trimmed} Voice alert is unavailable because a ${languageNames[language]} voice is not installed in this browser.`);
        }
        return;
      }

      if (hasSpoken) return;
      hasSpoken = true;
      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.lang = target;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.voice = matched;
      synth.cancel();
      synth.speak(utterance);
    };

    setVoiceMessage(trimmed);
    speakWithAvailableVoice();
    synth.addEventListener('voiceschanged', speakWithAvailableVoice, { once: true });
    window.setTimeout(() => {
      synth.removeEventListener('voiceschanged', speakWithAvailableVoice);
      if (!hasSpoken && language === 'en') {
        const englishVoice = synth.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('en'));
        if (englishVoice) speakWithAvailableVoice();
      }
    }, 800);
  };

  const playBuzzer = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioContext = new AudioContext();
    if (audioContext.state === 'suspended') await audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.45);
    oscillator.addEventListener('ended', () => audioContext.close());
  };

  const getMilkAbnormalMessage = () => {
    const cowName = selectedCow?.name || selectedCowId || 'C002';
    const messages = {
      en: `Warning. Abnormal milk detected in cow ${cowName}. Affected teat number one, front right. Please stop milking and sanitize the system.`,
      ta: `எச்சரிக்கை. ${cowName} பசுவின் பாலில் அசாதாரணம் கண்டறியப்பட்டது. பாதிக்கப்பட்ட மடி எண் ஒன்று, முன் வலது. பால் கறப்பதை நிறுத்தி அமைப்பை சுத்தம் செய்யவும்.`,
      hi: `चेतावनी। गाय ${cowName} के दूध में असामान्यता पाई गई है। प्रभावित थन नंबर एक, आगे का दायां। कृपया दूध निकालना रोकें और सिस्टम को सैनिटाइज करें।`,
      ml: `മുന്നറിയിപ്പ്. ${cowName} പശുവിന്റെ പാലിൽ അസാധാരണത കണ്ടെത്തി. ബാധിച്ച അകിട് നമ്പർ ഒന്ന്, മുൻവശത്തെ വലത്. കറവ നിർത്തി സിസ്റ്റം ശുചിയാക്കുക.`,
    };
    return messages[language] || messages.en;
  };

  const handleMilkMachineStateChange = (nextState) => {
    setMilkMachineState(nextState);
    if (nextState === 'abnormal') {
      playBuzzer();
      speakText(getMilkAbnormalMessage());
    }
  };

  const hygieneChecklistProgress = hygieneChecklist.filter((item) => item.status === 'ok').length;
  const hygieneChecklistComplete = hygieneChecklist.length > 0 && hygieneChecklist.every((item) => item.status === 'ok');

  const handleHygieneChecklistSelection = (itemId, status) => {
    setHygieneChecklist((current) => current.map((item) => (item.id === itemId ? { ...item, status } : item)));
  };

  const saveHygieneChecklistRecord = () => {
    const now = new Date();
    const record = {
      id: `hygiene-${Date.now()}`,
      date: now.toLocaleDateString('en-CA'),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cowId: selectedCow?.cow_id || selectedCowId || 'C002',
      farmId: 'FARM-001',
      worker: 'Farmer',
      completed: hygieneChecklistComplete,
      status: hygieneChecklistComplete ? 'Completed' : 'Incomplete',
      checklist: hygieneChecklist.map((item) => ({ ...item })),
      completedAt: now.toISOString(),
    };

    setHygieneHistory((current) => [record, ...current].slice(0, 20));
    setHygieneChecklist(HYGIENE_CHECKLIST_ITEMS.map((item) => ({ ...item, status: 'pending' })));
    setFarmManagementView('overview');
    setPage('sensorMonitoring');
  };

  const handleVoiceCommand = (command) => {
    const lower = command.trim().toLowerCase();
    if (lower.includes('high risk')) setPage('alerts');
    if (lower.includes('ponni')) setSelectedCowId('C002'); setPage('cows');
    if (lower.includes('cow c002') || lower.includes('open cow') || lower.includes('c002')) setSelectedCowId('C002'); setPage('cows');
    if (lower.includes('alert') || lower.includes('today')) setPage('alerts');
    if (lower.includes('overview') || lower.includes('herd')) setPage('dashboard');
    if (lower.includes('tamil')) setLanguage('ta');
    if (lower.includes('hindi')) setLanguage('hi');
    if (lower.includes('malayalam')) setLanguage('ml');
    if (lower.includes('english')) setLanguage('en');
  };

  const getLanguageRiskMessage = (cowName, cowId, riskCategory, riskScore) => {
    const riskText = riskCategory || 'LOW RISK';
    const value = Number(riskScore || 0);
    const baseName = cowName || 'Cow';
    const riskLabelMap = {
      'HIGH RISK': { en: 'high', ta: 'அதிக', hi: 'उच्च', ml: 'ഉയർന്ന' },
      'MODERATE RISK': { en: 'moderate', ta: 'மிதமான', hi: 'मध्यम', ml: 'ഇടത്തരം' },
      'LOW RISK': { en: 'low', ta: 'குறைந்த', hi: 'कम', ml: 'കുറവான' },
      'NO RISK': { en: 'no', ta: 'இல்லாத', hi: 'कोई', ml: 'ഇല്ലാത്ത' },
    };
    const riskLabel = riskLabelMap[riskText]?.[language] || 'low';
    const mastitisTerm = {
      en: 'mastitis',
      ta: 'மடி வீக்க நோய்',
      hi: 'थनैला रोग',
      ml: 'അകിടുവീക്കം',
    }[language] || 'mastitis';
    const templates = {
      en: `${baseName}, cow ${cowId}, has ${riskLabel} ${mastitisTerm} risk of ${value} percent. Please monitor the animal closely and review the warning signs.`,
      ta: `${baseName}, ${cowId} எண் பசு, ${riskLabel} ${mastitisTerm} ஆபத்து நிலை ${value} சதவீதம் உள்ளது. தயவுசெய்து உடனடியாக கண்காணிக்கவும்.`,
      hi: `${baseName}, गाय ${cowId}, में ${riskLabel} ${mastitisTerm} जोखिम ${value} प्रतिशत है। कृपया तुरंत निरीक्षण करें और सावधानी बरतें।`,
      ml: `${baseName}, ${cowId} നമ്പർ പശു, ${riskLabel} ${mastitisTerm} അപകടം ${value} ശതമാനം ആണ്. ദയവായി വേഗത്തിൽ നിരീക്ഷിച്ച് മുൻകരുതൽ സ്വീകരിക്കുക.`,
    };
    return templates[language] || templates.en;
  };

  const voiceSummary = (cow) => {
    if (!cow) return;
    const riskText = cow.risk_category || 'LOW RISK';
    const riskScore = cow.risk_score || 0;
    const text = getLanguageRiskMessage(cow.name, cow.cow_id, riskText, riskScore);
    speakText(text);
  };

  const handleDemoPrediction = async () => {
    try {
      setLoading(true);
      const result = await api.sendSensorReading(sensorForm);
      const cowData = await api.getCow(sensorForm.cow_id);
      const cowName = cowData?.name || sensorForm.cow_id;
      setSelectedCowId(sensorForm.cow_id);
      setCows((prev) => prev.map((cow) => (cow.cow_id === sensorForm.cow_id ? { ...cow, ...cowData, risk_score: result.result.risk_score, risk_category: result.result.risk_category } : cow)));
      if (settings.auto_read_alerts && result.result.risk_category.includes('HIGH')) {
        speakText(getLanguageRiskMessage(cowName, sensorForm.cow_id, result.result.risk_category, result.result.risk_score));
      }
      setPage('predictions');
    } catch (err) {
      setError(err.message || 'Sensor simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const chartData = cows.map((cow) => ({
    name: cow.name,
    risk: cow.risk_score || 0,
    fill: riskColors[cow.risk_category] || '#22c55e',
  }));

  const getSscStatus = (value) => {
    const ssc = Number(value);
    if (!Number.isFinite(ssc)) return { label: 'Not collected', className: 'warning', description: 'Collect an SSC reading to assess milk quality.' };
    if (ssc < 100000) return { label: 'Healthy / No Risk', className: 'good', description: 'Udder is within the normal range.' };
    if (ssc < 200000) return { label: 'Low Risk / Early Monitoring', className: 'warning', description: 'Safe milk, but monitor carefully.' };
    if (ssc <= 400000) return { label: 'Subclinical Mastitis (High Risk)', className: 'warning', description: 'Milk may look normal, but a subclinical infection may have started.' };
    return { label: 'Clinical Mastitis (Abnormal Milk)', className: 'danger', description: 'High infection risk. Divert this milk to the waste container.' };
  };

  const getCareRecommendations = (cow) => {
    const reading = cow?.latest_reading || {};
    const ssc = Number(reading.somatic_cell_count);
    const bodyTemperature = Number(reading.body_temperature);
    const affected = ['HIGH RISK', 'MODERATE RISK'].includes(cow?.risk_category)
      || (Number.isFinite(ssc) && ssc >= 200000);
    if (!affected) return [];

    const recommendations = {
      en: [
        'Wash the teats externally with properly diluted Potassium Permanganate (KMnO4), only as directed by a veterinarian. Do not use concentrated solution or put it into the teat canal.',
        'Separate and label abnormal milk. For SSC above 400,000 cells/mL, divert the milk to the waste container and do not mix it with saleable milk.',
        ...(bodyTemperature > 39 ? ['The cow has a fever reading. Contact a veterinarian promptly; they may prescribe Meloxicam or Flunixin after examination.'] : []),
        ...(cow?.risk_category === 'HIGH RISK' || Number(reading.activity) < 50 ? ['If the cow is weak or needs udder support, ask the veterinarian about a Vitamin E and Selenium supplement.'] : []),
        'Keep the cow’s udder, bedding, and milking equipment clean, and arrange a veterinary examination for treatment decisions.',
      ],
      ta: [
        'கால்நடை மருத்துவர் கூறும் சரியான நீர்த்தலில் Potassium Permanganate (KMnO4) கொண்டு காம்புகளை வெளிப்புறமாக கழுவவும். செறிவான கரைசலை பயன்படுத்தவோ, காம்பு நாளத்திற்குள் விடவோ கூடாது.',
        'அசாதாரண பாலை தனியாகப் பிரித்து குறியிடவும். SSC 400,000 cells/mL-க்கு மேல் இருந்தால், பாலை கழிவு தொட்டிக்கு மாற்றி விற்பனைப் பாலுடன் கலக்க வேண்டாம்.',
        ...(bodyTemperature > 39 ? ['பசுவுக்கு காய்ச்சல் அறிகுறி உள்ளது. உடனடியாக கால்நடை மருத்துவரை தொடர்பு கொள்ளுங்கள்; பரிசோதனைக்குப் பிறகு Meloxicam அல்லது Flunixin மருந்தை அவர் பரிந்துரைக்கலாம்.'] : []),
        ...(cow?.risk_category === 'HIGH RISK' || Number(reading.activity) < 50 ? ['பசு சோர்வாக இருந்தால் அல்லது மடிக்கு ஆதரவு தேவைப்பட்டால், Vitamin E மற்றும் Selenium supplement பற்றி கால்நடை மருத்துவரிடம் கேளுங்கள்.'] : []),
        'மடி, படுக்கை மற்றும் பால் கறக்கும் கருவிகளை சுத்தமாக வைத்திருந்து, சிகிச்சை முடிவுகளுக்கு கால்நடை மருத்துவர் பரிசோதனையை ஏற்பாடு செய்யுங்கள்.',
      ],
      hi: [
        'पशु चिकित्सक के निर्देशानुसार सही मात्रा में पतला Potassium Permanganate (KMnO4) लगाकर थनों को बाहर से धोएँ। गाढ़ा घोल न लगाएँ और इसे थन की नली के अंदर न डालें।',
        'असामान्य दूध को अलग करके चिन्हित करें। SSC 400,000 cells/mL से अधिक होने पर दूध को अपशिष्ट कंटेनर में भेजें और बिक्री योग्य दूध में न मिलाएँ।',
        ...(bodyTemperature > 39 ? ['गाय को बुखार है। तुरंत पशु चिकित्सक से संपर्क करें; जाँच के बाद वे Meloxicam या Flunixin लिख सकते हैं।'] : []),
        ...(cow?.risk_category === 'HIGH RISK' || Number(reading.activity) < 50 ? ['यदि गाय कमजोर है या थन को पोषण सहायता चाहिए, तो पशु चिकित्सक से Vitamin E और Selenium supplement के बारे में पूछें।'] : []),
        'थन, बिछावन और दुहने के उपकरण साफ रखें तथा उपचार के निर्णय के लिए पशु चिकित्सक की जाँच कराएँ।',
      ],
      ml: [
        'വെറ്ററിനറിയുടെ നിർദ്ദേശപ്രകാരം ശരിയായി നേർപ്പിച്ച Potassium Permanganate (KMnO4) ഉപയോഗിച്ച് മുലക്കാമ്പുകൾ പുറത്ത് കഴുകുക. കട്ടിയുള്ള ദ്രാവകം ഉപയോഗിക്കരുത്; മുലനാളത്തിനുള്ളിൽ ഒഴിക്കരുത്.',
        'അസാധാരണമായ പാൽ വേർതിരിച്ച് അടയാളപ്പെടുത്തുക. SSC 400,000 cells/mL-ന് മുകളിലാണെങ്കിൽ പാൽ മാലിന്യ പാത്രത്തിലേക്ക് മാറ്റി വിൽപ്പനയ്ക്കുള്ള പാലിൽ കലർത്തരുത്.',
        ...(bodyTemperature > 39 ? ['പശുവിന് പനി ഉണ്ട്. ഉടൻ വെറ്ററിനറിയെ ബന്ധപ്പെടുക; പരിശോധനയ്ക്ക് ശേഷം Meloxicam അല്ലെങ്കിൽ Flunixin അദ്ദേഹം നിർദ്ദേശിച്ചേക്കാം.'] : []),
        ...(cow?.risk_category === 'HIGH RISK' || Number(reading.activity) < 50 ? ['പശു ക്ഷീണിതയാണെങ്കിൽ അല്ലെങ്കിൽ അകിടിന് പോഷക പിന്തുണ ആവശ്യമാണെങ്കിൽ, Vitamin E, Selenium supplement എന്നിവയെക്കുറിച്ച് വെറ്ററിനറിയോട് ചോദിക്കുക.'] : []),
        'അകിടും കിടക്കയും കറവ ഉപകരണങ്ങളും വൃത്തിയായി സൂക്ഷിച്ച് ചികിത്സാ തീരുമാനങ്ങൾക്കായി വെറ്ററിനറി പരിശോധന ഉറപ്പാക്കുക.',
      ],
    };
    return recommendations[language] || recommendations.en;
  };

  const renderCareRecommendations = (cow) => getCareRecommendations(cow).map((recommendation, index) => {
    const Icon = careRecommendationIcons[index] || Stethoscope;
    return (
      <li key={recommendation}>
        <span className="recommendation-icon" aria-hidden="true"><Icon size={18} /></span>
        <span>{recommendation}</span>
      </li>
    );
  });

  const getDietPlan = (cow) => {
    if (getCareRecommendations(cow).length === 0) return [];
    const plans = {
      en: [
        { time: '06:00 AM', title: 'Morning Feeding: Energy & Hydration', items: ['Fresh green fodder: 10-12 kg (Napier grass, Lucerne, or leguminous fodder)', 'Clean, cool water: unlimited access', 'If fever is present, ask a veterinarian about 20-30 g potassium/sodium electrolytes'] },
        { time: '08:00 AM', title: 'Post-Milking Mineral Booster', items: ['Dairy concentrate: 1.5-2 kg', 'Vitamin E: 1,000-2,000 IU, only as advised by a veterinarian', 'Organic zinc and selenium mineral mix: 15-20 g', 'Bypass protein: 200-300 g for tissue repair'] },
        { time: '12:00 PM', title: 'Midday Fiber & Roughage', items: ['Good-quality dry fodder or Rhodes grass hay: 3-4 kg', 'Fresh water: keep continuous access for rumen stability'] },
        { time: '04:00 PM', title: 'Evening Feeding: Fodder & Recovery Support', items: ['Fresh green fodder: 10-12 kg', 'Concentrate meal: 1-1.5 kg; keep starch and grain low to reduce acidosis risk', 'Bypass fat: 50-100 g to support energy balance'] },
        { time: '08:00 PM', title: 'Night Rest Preparation', items: ['Dry hay: 2 kg left in the manger for night rumination', 'Refresh and clean the water trough before night rest'] },
      ],
      ta: [
        { time: 'காலை 06:00', title: 'காலை உணவு: ஆற்றல் மற்றும் நீர்ச்சத்து', items: ['பசுமை தீவனம்: 10-12 கிலோ (நேப்பியர் புல், லூசர்ன் அல்லது பருப்பு வகை பசுந்தீவனம்)', 'சுத்தமான குளிர்ந்த நீர்: எப்போதும் கிடைக்க வேண்டும்', 'காய்ச்சல் இருந்தால், 20-30 கிராம் பொட்டாசியம்/சோடியம் எலக்ட்ரோலைட் பற்றி கால்நடை மருத்துவரிடம் கேளுங்கள்'] },
        { time: 'காலை 08:00', title: 'பால் கறந்த பின் கனிம ஊட்டம்', items: ['பால் மாடு concentrate: 1.5-2 கிலோ', 'Vitamin E: 1,000-2,000 IU, கால்நடை மருத்துவர் கூறினால் மட்டும்', 'Zinc மற்றும் Selenium organic mineral mix: 15-20 கிராம்', 'திசு பழுதுபார்ப்புக்கு bypass protein: 200-300 கிராம்'] },
        { time: 'மதியம் 12:00', title: 'நார்ச்சத்து மற்றும் உலர் தீவனம்', items: ['நல்ல தரமான உலர் வைக்கோல் அல்லது Rhodes grass hay: 3-4 கிலோ', 'புதிய நீர்: rumen செயல்பாட்டிற்கு தொடர்ந்து கிடைக்க வேண்டும்'] },
        { time: 'மாலை 04:00', title: 'மாலை உணவு: தீவனம் மற்றும் மீட்பு', items: ['பசுமை தீவனம்: 10-12 கிலோ', 'Concentrate meal: 1-1.5 கிலோ; acidosis தவிர்க்க starch மற்றும் grain குறைவாக இருக்க வேண்டும்', 'ஆற்றல் சமநிலைக்கு bypass fat: 50-100 கிராம்'] },
        { time: 'இரவு 08:00', title: 'இரவு ஓய்வு தயாரிப்பு', items: ['இரவு rumination-க்கு உலர் வைக்கோல்: 2 கிலோ', 'இரவு ஓய்வுக்கு முன் நீர் தொட்டியை சுத்தம் செய்து புதிய நீர் நிரப்புங்கள்'] },
      ],
      hi: [
        { time: 'सुबह 06:00', title: 'सुबह का आहार: ऊर्जा और जलयोजन', items: ['हरी चारा: 10-12 किग्रा (नेपियर घास, लुसर्न या दलहनी हरा चारा)', 'साफ ठंडा पानी: हर समय उपलब्ध रखें', 'बुखार होने पर 20-30 ग्राम पोटैशियम/सोडियम इलेक्ट्रोलाइट के लिए पशु चिकित्सक से पूछें'] },
        { time: 'सुबह 08:00', title: 'दुहने के बाद मिनरल बूस्टर', items: ['डेयरी कंसंट्रेट: 1.5-2 किग्रा', 'Vitamin E: 1,000-2,000 IU, केवल पशु चिकित्सक की सलाह पर', 'ऑर्गेनिक जिंक और सेलेनियम मिनरल मिक्स: 15-20 ग्राम', 'ऊतक मरम्मत के लिए बायपास प्रोटीन: 200-300 ग्राम'] },
        { time: 'दोपहर 12:00', title: 'फाइबर और सूखा चारा', items: ['अच्छी गुणवत्ता का सूखा चारा या Rhodes grass hay: 3-4 किग्रा', 'ताजा पानी: रूमेन की स्थिरता के लिए लगातार उपलब्ध रखें'] },
        { time: 'शाम 04:00', title: 'शाम का आहार: चारा और रिकवरी', items: ['हरी चारा: 10-12 किग्रा', 'कंसंट्रेट: 1-1.5 किग्रा; एसिडोसिस का जोखिम घटाने के लिए स्टार्च और अनाज कम रखें', 'ऊर्जा संतुलन के लिए बायपास फैट: 50-100 ग्राम'] },
        { time: 'रात 08:00', title: 'रात के आराम की तैयारी', items: ['रात में जुगाली के लिए सूखी घास: 2 किग्रा', 'रात के आराम से पहले पानी की टंकी साफ करके ताजा पानी भरें'] },
      ],
      ml: [
        { time: 'രാവിലെ 06:00', title: 'രാവിലെ തീറ്റ: ഊർജവും ജലാംശവും', items: ['പച്ച തീറ്റ: 10-12 കിലോ (നേപ്പിയർ പുല്ല്, ലൂസേൺ അല്ലെങ്കിൽ പയർവർഗ്ഗ പച്ച തീറ്റ)', 'വൃത്തിയുള്ള തണുത്ത വെള്ളം: എപ്പോഴും ലഭ്യമാക്കുക', 'പനി ഉണ്ടെങ്കിൽ 20-30 ഗ്രാം പൊട്ടാസ്യം/സോഡിയം ഇലക്ട്രോലൈറ്റിനെക്കുറിച്ച് വെറ്ററിനറിയോട് ചോദിക്കുക'] },
        { time: 'രാവിലെ 08:00', title: 'കറവയ്ക്ക് ശേഷമുള്ള മിനറൽ ബൂസ്റ്റർ', items: ['ഡയറി കോൺസൻട്രേറ്റ്: 1.5-2 കിലോ', 'Vitamin E: 1,000-2,000 IU, വെറ്ററിനറിയുടെ നിർദ്ദേശപ്രകാരം മാത്രം', 'ഓർഗാനിക് സിങ്ക്, സെലീനിയം മിനറൽ മിക്സ്: 15-20 ഗ്രാം', 'കോശ പുനർനിർമ്മാണത്തിന് bypass protein: 200-300 ഗ്രാം'] },
        { time: 'ഉച്ചയ്ക്ക് 12:00', title: 'നാരുകളും ഉണങ്ങിയ തീറ്റയും', items: ['നല്ല ഗുണമേന്മയുള്ള ഉണങ്ങിയ തീറ്റ അല്ലെങ്കിൽ Rhodes grass hay: 3-4 കിലോ', 'ശുദ്ധജലം: റൂമൻ സ്ഥിരതയ്ക്കായി എപ്പോഴും ലഭ്യമാക്കുക'] },
        { time: 'വൈകിട്ട് 04:00', title: 'വൈകുന്നേരത്തെ തീറ്റ: തീറ്റയും വീണ്ടെടുപ്പും', items: ['പച്ച തീറ്റ: 10-12 കിലോ', 'കോൺസൻട്രേറ്റ്: 1-1.5 കിലോ; അസിഡോസിസ് കുറയ്ക്കാൻ സ്റ്റാർച്ചും ധാന്യവും കുറയ്ക്കുക', 'ഊർജസമതുലിതാവസ്ഥയ്ക്ക് bypass fat: 50-100 ഗ്രാം'] },
        { time: 'രാത്രി 08:00', title: 'രാത്രി വിശ്രമത്തിനുള്ള തയ്യാറെടുപ്പ്', items: ['രാത്രിയിലെ അയവിറക്കലിന് ഉണങ്ങിയ പുല്ല്: 2 കിലോ', 'രാത്രി വിശ്രമത്തിന് മുമ്പ് വെള്ളത്തൊട്ടി വൃത്തിയാക്കി ശുദ്ധജലം നിറയ്ക്കുക'] },
      ],
    };
    return plans[language] || plans.en;
  };

  const renderDietPlan = (cow) => (
    <section className="diet-plan" aria-label="Mastitis diet plan">
      <div className="diet-plan-header">
        <div>
          <span className="panel-subtitle">{t('mastitisRecoverySupport')}</span>
          <h4>{t('dailyDietPlan')}</h4>
        </div>
        <UtensilsCrossed size={22} aria-hidden="true" />
      </div>
      <div className="diet-plan-list">
        {getDietPlan(cow).map((meal, index) => {
          const Icon = dietPlanIcons[index] || Wheat;
          return (
            <article className="diet-meal" key={meal.time}>
              <div className="diet-meal-time"><Icon size={17} aria-hidden="true" /><strong>{meal.time}</strong></div>
              <h5>{meal.title}</h5>
              <ul>{meal.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          );
        })}
      </div>
      <p className="diet-plan-note">{t('dietPlanNote')}</p>
    </section>
  );

  const getNextDietReminder = (cow) => {
    const dietPlan = getDietPlan(cow);
    if (dietPlan.length === 0) return null;
    const scheduleHours = [6, 8, 12, 16, 20];
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const nextIndex = scheduleHours.findIndex((hour) => hour * 60 > currentMinutes);
    const mealIndex = nextIndex === -1 ? 0 : nextIndex;
    const reminderTime = new Date(currentTime);
    if (nextIndex === -1) reminderTime.setDate(reminderTime.getDate() + 1);
    reminderTime.setHours(scheduleHours[mealIndex], 0, 0, 0);
    const locale = { en: 'en-US', ta: 'ta-IN', hi: 'hi-IN', ml: 'ml-IN' }[language] || 'en-US';
    return {
      meal: dietPlan[mealIndex],
      time: reminderTime.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' }),
    };
  };

  const donutData = [
    { name: t('highRisk'), value: 5, color: '#ef4444' },
    { name: t('moderateRisk'), value: 12, color: '#f59e0b' },
    { name: t('lowRisk'), value: 12, color: '#3b82f6' },
    { name: t('healthy'), value: 21, color: '#22c55e' },
  ];

  const filteredCows = cows.filter((cow) => {
    const query = searchQuery.trim().toLowerCase();
    return cow.name?.toLowerCase().includes(query) || cow.cow_id?.toLowerCase().includes(query);
  });

  const renderFarmManagement = () => {
    if (farmManagementView === 'checklist') {
      return (
        <div className="page-section hygiene-checklist-page">
          <div className="top-row">
            <div>
              <p className="eyebrow">Preventive Hygiene Check</p>
              <h2>Pre-Milking Hygiene Checklist</h2>
              <p>Before starting milking and before attaching the milking machine, confirm each hygiene step.</p>
            </div>
            <button className="small-button" onClick={() => setFarmManagementView('overview')}>Back</button>
          </div>

          <div className="panel hygiene-panel">
            <div className="hygiene-progress-wrap" aria-label="Checklist progress">
              <div className="hygiene-progress-bar">
                <span style={{ width: `${(hygieneChecklistProgress / hygieneChecklist.length) * 100}%` }} />
              </div>
              <strong>{hygieneChecklistProgress} / {hygieneChecklist.length}</strong>
            </div>

            {hygieneChecklist.map((item, index) => (
              <div key={item.id} className={`hygiene-item ${item.status === 'ok' ? 'complete' : ''}`}>
                <div className="hygiene-main">
                  <div className="hygiene-step-icon" aria-hidden="true">
                    {item.status === 'ok' ? <CheckCircle2 size={22} /> : <ClipboardCheck size={22} />}
                  </div>
                  <div>
                    <span className="hygiene-step-tag">Step {index + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.message}</p>
                  </div>
                </div>
                <div className="hygiene-selectors">
                  <button
                    type="button"
                    className={`hygiene-option ok ${item.status === 'ok' ? 'selected' : ''}`}
                    onClick={() => handleHygieneChecklistSelection(item.id, 'ok')}
                  >
                    ✓ OK
                  </button>
                  <button
                    type="button"
                    className={`hygiene-option not-done ${item.status === 'not-done' ? 'selected' : ''}`}
                    onClick={() => handleHygieneChecklistSelection(item.id, 'not-done')}
                  >
                    ✕ Not Done
                  </button>
                </div>
              </div>
            ))}

            {hygieneChecklistComplete && (
              <div className="hygiene-complete-state">
                <CheckCircle2 size={32} />
                <div>
                  <h3>✓ Hygiene Check Completed</h3>
                  <p>Ready for Milking</p>
                </div>
              </div>
            )}

            <button
              type="button"
              className="primary-button start-milking-button"
              disabled={!hygieneChecklistComplete}
              onClick={saveHygieneChecklistRecord}
            >
              OK – Start Milking
            </button>
          </div>
        </div>
      );
    }

    if (farmManagementView === 'history') {
      return (
        <div className="page-section hygiene-history-page">
          <div className="top-row">
            <div>
              <p className="eyebrow">Farm Management</p>
              <h2>Pre-Milking Hygiene History</h2>
            </div>
            <button className="small-button" onClick={() => setFarmManagementView('overview')}>Back</button>
          </div>

          <div className="panel hygiene-history-panel">
            {hygieneHistory.length === 0 ? (
              <div className="empty-history-state">
                <ClipboardCheck size={26} />
                <p>No checklist records yet.</p>
              </div>
            ) : (
              <div className="history-record-list">
                {hygieneHistory.map((record) => (
                  <article key={record.id} className="history-record-item">
                    <div className="history-record-header">
                      <div>
                        <strong>{record.date}</strong>
                        <span>{record.time}</span>
                      </div>
                      <span className={`history-status ${record.completed ? 'completed' : 'incomplete'}`}>
                        {record.completed ? 'Completed' : 'Incomplete'}
                      </span>
                    </div>
                    <div className="history-record-body">
                      <p><strong>Cow ID:</strong> {record.cowId}</p>
                      <p><strong>Farm ID:</strong> {record.farmId}</p>
                      <p><strong>Worker/User:</strong> {record.worker}</p>
                      <p><strong>Checklist completion status:</strong> {record.status}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (farmManagementView === 'milking-schedule') {
      return (
        <div className="page-section farm-management-detail-page">
          <div className="top-row">
            <div>
              <p className="eyebrow">Farm Management</p>
              <h2>Milking Schedule</h2>
            </div>
            <button className="small-button" onClick={() => setFarmManagementView('overview')}>Back</button>
          </div>

          <div className="panel detail-panel">
            <div className="detail-table-wrap">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Milking Session</th>
                    <th>Scheduled Time</th>
                    <th>Cow ID / Herd</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MILKING_SCHEDULE.map((slot) => (
                    <tr key={slot.shift}>
                      <td><strong>{slot.shift}</strong></td>
                      <td>{slot.time}</td>
                      <td>{slot.herd}</td>
                      <td><span className={`detail-status ${slot.statusClass}`}>{slot.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (farmManagementView === 'equipment-maintenance') {
      return (
        <div className="page-section farm-management-detail-page">
          <div className="top-row">
            <div>
              <p className="eyebrow">Farm Management</p>
              <h2>Equipment Cleaning & Maintenance</h2>
            </div>
            <button className="small-button" onClick={() => setFarmManagementView('overview')}>Back</button>
          </div>

          <div className="panel detail-panel">
            <div className="detail-table-wrap">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Equipment Name</th>
                    <th>Last Cleaned</th>
                    <th>Cleaning Status</th>
                    <th>Condition</th>
                    <th>Damage Status</th>
                    <th>Maintenance</th>
                  </tr>
                </thead>
                <tbody>
                  {EQUIPMENT_CLEANING_RECORDS.map((item) => (
                    <tr key={item.name}>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.lastCleaned}</td>
                      <td>{item.cleaningStatus}</td>
                      <td>{item.condition}</td>
                      <td>{item.damageStatus}</td>
                      <td>
                        {item.maintenanceRequired ? (
                          <span className="detail-status urgent">Maintenance Required</span>
                        ) : (
                          <span className="detail-status complete">No maintenance</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (farmManagementView === 'shed-cleaning') {
      return (
        <div className="page-section farm-management-detail-page">
          <div className="top-row">
            <div>
              <p className="eyebrow">Farm Management</p>
              <h2>Shed Cleaning Schedule</h2>
            </div>
            <button className="small-button" onClick={() => setFarmManagementView('overview')}>Back</button>
          </div>

          <div className="panel detail-panel">
            <div className="detail-table-wrap">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Cleaning Activity</th>
                    <th>Scheduled Date</th>
                    <th>Scheduled Time</th>
                    <th>Frequency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SHED_CLEANING_SCHEDULE.map((task) => (
                    <tr key={task.activity}>
                      <td><strong>{task.activity}</strong></td>
                      <td>{task.date}</td>
                      <td>{task.time}</td>
                      <td>{task.frequency}</td>
                      <td><span className={`detail-status ${task.statusClass}`}>{task.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="detail-reminder-row">
              <span>Upcoming reminder: Deep Cleaning on Sunday at 4:00 PM</span>
              <button className="primary-button small-button-inline" type="button">Send Reminder</button>
            </div>
          </div>
        </div>
      );
    }

    if (farmManagementView === 'worker-hygiene') {
      return (
        <div className="page-section farm-management-detail-page">
          <div className="top-row">
            <div>
              <p className="eyebrow">Farm Management</p>
              <h2>Worker Hygiene Records</h2>
            </div>
            <button className="small-button" onClick={() => setFarmManagementView('overview')}>Back</button>
          </div>

          <div className="panel detail-panel">
            <div className="detail-card-grid">
              <div className="detail-card">
                <span className="detail-card-label">Handwashing compliance</span>
                <strong>✓ 96%</strong>
              </div>
              <div className="detail-card">
                <span className="detail-card-label">Glove change log</span>
                <strong>4 completed today</strong>
              </div>
              <div className="detail-card">
                <span className="detail-card-label">Shed entry check</span>
                <strong>✓ All workers cleared</strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="page-section">
        <div className="top-row">
          <div>
            <p className="eyebrow">Farm Management</p>
            <h2>Farm Management Overview</h2>
            <p>Preventive hygiene checks and dairy operations support for a clean, safe milking routine.</p>
          </div>
        </div>

        <div className="farm-overview-mini-dashboard">
          <div className="farm-overview-stat">
            <span>🥛 Next Milking</span>
            <strong>{FARM_MANAGEMENT_OVERVIEW.nextMilking}</strong>
          </div>
          <div className="farm-overview-stat">
            <span>🧰 Equipment</span>
            <strong>{FARM_MANAGEMENT_OVERVIEW.equipment}</strong>
          </div>
          <div className="farm-overview-stat">
            <span>🧹 Shed Cleaning</span>
            <strong>{FARM_MANAGEMENT_OVERVIEW.shedCleaning}</strong>
          </div>
          <div className="farm-overview-stat warn">
            <span>⚠ Pending Tasks</span>
            <strong>{FARM_MANAGEMENT_OVERVIEW.pendingTasks}</strong>
          </div>
        </div>

        <div className="farm-management-grid">
          <button className="farm-action-card primary" onClick={() => setFarmManagementView('checklist')}>
            <ClipboardCheck size={26} />
            <span>Pre-Milking Hygiene Checklist</span>
          </button>
          <button className="farm-action-card" onClick={() => setFarmManagementView('history')}>
            <CalendarDays size={26} />
            <span>Pre-Milking Hygiene History</span>
          </button>
          <button className="farm-action-card" onClick={() => setFarmManagementView('milking-schedule')}>
            <Clock3 size={26} />
            <span>Milking Schedule</span>
          </button>
          <button className="farm-action-card" onClick={() => setFarmManagementView('equipment-maintenance')}>
            <Milk size={26} />
            <span>Equipment Cleaning Records</span>
          </button>
          <button className="farm-action-card" onClick={() => setFarmManagementView('shed-cleaning')}>
            <ShieldCheck size={26} />
            <span>Shed Cleanliness Records</span>
          </button>
          <button className="farm-action-card" onClick={() => setFarmManagementView('worker-hygiene')}>
            <HeartPulse size={26} />
            <span>Worker Hygiene Records</span>
          </button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="page-section">
      <div className="top-row">
        <div>
          <h1>{t('helloFarmer')}</h1>
          <p>{t('farmOverview')}</p>
        </div>
        <div className="demo-badge">{t('prototypeMode')}</div>
      </div>

      <div className="stats-grid">
        <StatCard label={t('totalCows')} value={50} icon={<HeartPulse size={22} />} accent="green" />
        <StatCard label={t('highRisk')} value={5} icon={<AlertTriangle size={22} />} accent="red" />
        <StatCard label={t('moderateRisk')} value={12} icon={<Thermometer size={22} />} accent="amber" />
        <StatCard label={t('healthy')} value={21} icon={<ShieldCheck size={22} />} accent="blue" />
      </div>

      <div className="dashboard-grid">
        <div className="panel large">
          <div className="panel-header">
            <h3>{t('todaysHerdOverview')}</h3>
          </div>
          <div className="chart-wrap donut-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>{t('recentAlerts')}</h3>
            <button className="small-button">{t('viewAllAlerts')}</button>
          </div>
          <div className="alert-list">
            {alerts.slice(0, 4).map((alert) => (
              <div className="alert-item" key={alert.id}>
                <div className="alert-head">
                  <strong>{alert.cow_id}</strong>
                  <span className={`risk-badge ${alert.severity.toLowerCase().replace(' ', '-')}`}>{alert.severity}</span>
                </div>
                <p>{alert.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel risk-trend-panel">
          <div className="panel-header">
            <div>
              <h3>{t('futureRiskTrend')}</h3>
              <small className="panel-subtitle">{t('nextFourDays')}</small>
            </div>
            <Activity size={20} className="trend-icon" />
          </div>
          <div className="chart-wrap trend-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={futureRiskTrend} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`${value}%`, t('riskScore')]} />
                <Area type="monotone" dataKey="risk" stroke="#f97316" strokeWidth={3} fill="url(#riskTrendFill)" dot={{ r: 5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="risk-trend-list">
            {futureRiskTrend.map((point) => (
              <div className="risk-trend-item" key={point.day}>
                <span className={`trend-status ${point.level}`} aria-hidden="true">{point.marker}</span>
                <span>{point.day}</span>
                <strong style={{ color: point.color }}>{point.risk}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCows = () => (
    (() => {
      const latestReading = selectedCow?.latest_reading || {};
      return (
    <div className="page-section">
      <div className="top-row">
        <div>
          <h2>{t('cows')}</h2>
        </div>
        <div className="search-row">
          <input
            type="text"
            value={searchQuery}
            placeholder={t('searchCow')}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button className="small-button">{t('filterByRisk')}</button>
          <button className="small-button">{t('sortBy')}</button>
        </div>
      </div>

      <div className="cow-grid">
        {filteredCows.map((cow) => (
          <div className={`cow-card ${selectedCowId === cow.cow_id ? 'selected' : ''}`} key={cow.cow_id} onClick={() => setSelectedCowId(cow.cow_id)}>
            <div className="cow-card-head">
              <div className="avatar">{cow.name?.slice(0, 1) || 'C'}</div>
              <div>
                <h4>{cow.name} ({cow.cow_id})</h4>
                <small>{cow.breed}</small>
              </div>
            </div>
            <div className="cow-card-body">
              <span className="risk-badge" style={{ background: riskColors[cow.risk_category] || '#22c55e' }}>
                {cow.risk_category || 'NO RISK'}
              </span>
              <p>{t('riskScore')}: {cow.risk_score || 0}%</p>
              <button className="link-btn" onClick={() => setPage('cows')}>{t('viewDetails')}</button>
            </div>
          </div>
        ))}
      </div>

      {selectedCow && (
        <div className="selected-cow panel">
          <div className="panel-header">
            <h3>{selectedCow.name} ({selectedCow.cow_id})</h3>
            <div className="action-stack">
              <button className="small-button" onClick={() => setCowHistoryOpen((open) => !open)}>
                {cowHistoryOpen ? 'Hide History' : 'History'}
              </button>
              <button className="small-button" onClick={() => voiceSummary(selectedCow)}>
                <Volume2 size={14} /> {t('readAloud')}
              </button>
            </div>
          </div>
          <div className="cow-profile-row">
            <div className="profile-meta">
              <p><strong>{t('sensorId')}:</strong> {selectedCow.sensor_id}</p>
              <p><strong>{t('breed')}:</strong> {selectedCow.breed}</p>
              <p><strong>{t('age')}:</strong> {selectedCow.age} years</p>
              <p><strong>{t('lactation')}:</strong> {selectedCow.lactation_number}nd</p>
            </div>
            <div className="risk-gauge-wrap">
              <div className="risk-gauge" style={{ background: `conic-gradient(${riskColors[selectedCow.risk_category] || '#22c55e'} ${(selectedCow.risk_score || 0) * 3.6}deg, #e5e7eb 0deg)` }}>
                <div className="risk-gauge-inner">
                  <span>{selectedCow.risk_score || 0}%</span>
                </div>
              </div>
              <div className="risk-label">{selectedCow.risk_category || 'NO RISK'}</div>
            </div>
          </div>

          <div className="status-grid">
            {(() => {
              const sscStatus = getSscStatus(latestReading.somatic_cell_count);
              const sscValue = Number(latestReading.somatic_cell_count);
              return (
                <div className={`metric-card ssc-card ${sscStatus.className}`}>
                  <span>SSC (Somatic Cell Count)</span>
                  <strong>{Number.isFinite(sscValue) ? `${sscValue.toLocaleString()} cells/mL` : 'Not collected'}</strong>
                  <small>Normal: &lt; 100,000 cells/mL</small>
                  <em>{sscStatus.label}</em>
                  <p>{sscStatus.description}</p>
                </div>
              );
            })()}
            <CowReadingMetric label={t('milkYield')} value={latestReading.milk_yield} unit="L" min={8} max={12} normal="8-12 L" />
            <CowReadingMetric label={t('conductivity')} value={latestReading.milk_conductivity} unit="mS/cm" min={4} max={6} normal="4-6 mS/cm" />
            <CowReadingMetric label="Milk pH" value={latestReading.milk_ph} min={6.5} max={6.8} normal="6.5-6.8" />
            <CowReadingMetric label={t('milkTemperature')} value={latestReading.milk_temperature} unit="°C" min={38} max={39} normal="38-39 °C" />
            <CowReadingMetric label={t('activity')} value={latestReading.activity} unit="%" min={50} max={80} normal="50-80%" />
            <CowReadingMetric label={t('rumination')} value={latestReading.rumination} unit="min/day" min={260} max={360} normal="260-360 min/day" />
            <CowReadingMetric label={t('bodyTemperature')} value={latestReading.body_temperature} unit="°C" min={38.5} max={39} normal="38.5-39 °C" />
            <CowReadingMetric label="Farm temperature" value={latestReading.farm_temperature} unit="°C" min={18} max={32} normal="18-32 °C" />
            <CowReadingMetric label="Humidity" value={latestReading.humidity} unit="%" min={40} max={75} normal="40-75%" />
          </div>

          <div className="reasons-box">
            <h4>{t('reasonTitle')}</h4>
            <ul>
              <li>↑ {t('conductivity')} is elevated</li>
              <li>↓ {t('milkYield')} has decreased</li>
              <li>↓ {t('activity')} is reduced</li>
              <li>↓ {t('rumination')} is reduced</li>
              <li>↑ {t('temperature')} is abnormal</li>
            </ul>
          </div>

          {cowHistoryOpen && (
            <div className="history-box">
              <h4>Cow History</h4>
              <div className="history-list">
                {(trendData.length ? trendData : [
                  { day: 'Day 1', risk: 36 },
                  { day: 'Day 2', risk: 42 },
                  { day: 'Day 3', risk: 48 },
                  { day: 'Day 4', risk: 58 },
                  { day: 'Day 5', risk: 64 },
                ]).slice(-5).map((point, index) => {
                  const risk = Number(point.risk ?? selectedCow.risk_score ?? 0);
                  const level = risk >= 75 ? 'high' : risk >= 50 ? 'moderate' : risk >= 25 ? 'low' : 'safe';
                  return (
                    <div className="history-item" key={`${point.day || 'history'}-${index}`}>
                      <div>
                        <span>{point.day || `History ${index + 1}`}</span>
                        <strong>{risk}% risk</strong>
                      </div>
                      <span className={`history-level ${level}`}>{level === 'high' ? 'High' : level === 'moderate' ? 'Moderate' : level === 'low' ? 'Low' : 'Safe'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="recommendation-box">
            <h4>{t('recommendation')}</h4>
            {getCareRecommendations(selectedCow).length > 0 ? (
              <ul>{renderCareRecommendations(selectedCow)}</ul>
            ) : (
              <p>{selectedCow.recommendation || 'Continue routine monitoring.'}</p>
            )}
          </div>
          {getDietPlan(selectedCow).length > 0 && renderDietPlan(selectedCow)}
        </div>
      )}
    </div>
      );
    })()
  );

  const renderSensorMonitoring = () => (
    <div className="page-section">
      <div className="top-row">
        <div>
          <p className="eyebrow">REAL-TIME MACHINE MONITOR</p>
          <h2>Milk Machine Category</h2>
          <p>Monitor the milk line and respond to changes as they happen.</p>
        </div>
        <span className="live-status"><span className="live-dot" /> Live monitoring</span>
      </div>

      <div className="milk-machine-tabs" role="tablist" aria-label="Milk machine status">
        <button
          className={milkMachineState === 'normal' ? 'active' : ''}
          role="tab"
          aria-selected={milkMachineState === 'normal'}
          onClick={() => handleMilkMachineStateChange('normal')}
        >
          <CheckCircle2 size={17} /> Normal
        </button>
        <button
          className={milkMachineState === 'abnormal' ? 'active abnormal-tab' : ''}
          role="tab"
          aria-selected={milkMachineState === 'abnormal'}
          onClick={() => handleMilkMachineStateChange('abnormal')}
        >
          <AlertTriangle size={17} /> Abnormal
        </button>
      </div>

      <section className={`milk-status-card ${milkMachineState}`} aria-live="polite">
        <div className="milk-status-header">
          <div className="milk-status-icon">
            {milkMachineState === 'normal' ? <Milk size={26} /> : <MilkOff size={26} />}
          </div>
          <div>
            <span className="status-kicker">Milk Machine Category</span>
            <h3>{milkMachineState === 'normal' ? 'Milk Status: NORMAL' : 'Milk Status: ABNORMAL DETECTED!'}</h3>
          </div>
          <span className="status-indicator" aria-label={milkMachineState === 'normal' ? 'Normal status' : 'Abnormal status'} />
        </div>

        <div className="teat-indicators" aria-label="Teat status indicators">
          {[1, 2, 3, 4].map((teatNumber) => {
            const affected = milkMachineState === 'abnormal' && teatNumber === 1;
            return (
              <div className={`teat-indicator ${affected ? 'affected' : 'clear'}`} key={teatNumber}>
                <span className="teat-light" aria-label={`Teat ${teatNumber} ${affected ? 'affected' : 'normal'}`} />
                <strong>Teat #{teatNumber}</strong>
                <small>{affected ? 'Affected' : 'Normal'}</small>
              </div>
            );
          })}
        </div>

        <div className="milk-status-body">
          {milkMachineState === 'normal' ? (
            <div className="status-message normal-message">
              <CheckCircle2 size={20} />
              <div>
                <strong>System operating normally</strong>
                <p>All milk channels are clear and ready for collection.</p>
              </div>
            </div>
          ) : (
            <div className="status-message abnormal-message">
              <AlertTriangle size={22} />
              <div>
                <strong>Affected Teat: #1 (Front Right)</strong>
                <p>Abnormal milk detected. Stop collection and sanitize the affected line.</p>
              </div>
            </div>
          )}
          {milkMachineState === 'abnormal' && (
            <button className="sanitize-button" onClick={() => setMilkMachineState('normal')}>
              <Milk size={17} /> Reset / Sanitize System
            </button>
          )}
        </div>
      </section>

      <div className="sensor-layout">
        <form className="sensor-form panel" onSubmit={(event) => { event.preventDefault(); handleDemoPrediction(); }}>
          <div className="panel-header">
            <h3>{t('sensorSimulator')}</h3>
          </div>
          <div className="form-grid">
            <SensorField label={t('cowId')} value={sensorForm.cow_id} onChange={(value) => setSensorForm({ ...sensorForm, cow_id: value })} />
            <SensorField label={t('sensorId')} value={sensorForm.sensor_id} onChange={(value) => setSensorForm({ ...sensorForm, sensor_id: value })} />
            <SensorField label="Milk yield (L)" type="number" value={sensorForm.milk_yield} onChange={(value) => setSensorForm({ ...sensorForm, milk_yield: Number(value) })} />
            <SensorField label="Milk conductivity (mS/cm)" type="number" value={sensorForm.milk_conductivity} onChange={(value) => setSensorForm({ ...sensorForm, milk_conductivity: Number(value) })} />
            <SensorField label="Milk pH" type="number" step="0.1" min="0" max="14" value={sensorForm.milk_ph} onChange={(value) => setSensorForm({ ...sensorForm, milk_ph: Number(value) })} />
            <SensorField label="Milk temperature (°C)" type="number" value={sensorForm.milk_temperature} onChange={(value) => setSensorForm({ ...sensorForm, milk_temperature: Number(value) })} />
            <SensorField label="Activity (%)" type="number" value={sensorForm.activity} onChange={(value) => setSensorForm({ ...sensorForm, activity: Number(value) })} />
            <SensorField label="Rumination (min/day)" type="number" value={sensorForm.rumination} onChange={(value) => setSensorForm({ ...sensorForm, rumination: Number(value) })} />
            <SensorField label="Body temperature (°C)" type="number" value={sensorForm.body_temperature} onChange={(value) => setSensorForm({ ...sensorForm, body_temperature: Number(value) })} />
            <SensorField label="Farm temperature (°C)" type="number" value={sensorForm.farm_temperature} onChange={(value) => setSensorForm({ ...sensorForm, farm_temperature: Number(value) })} />
            <SensorField label="Humidity (%)" type="number" value={sensorForm.humidity} onChange={(value) => setSensorForm({ ...sensorForm, humidity: Number(value) })} />
            <SensorField label="SSC (cells/mL)" type="number" min="0" value={sensorForm.somatic_cell_count} onChange={(value) => setSensorForm({ ...sensorForm, somatic_cell_count: Number(value) })} />
          </div>
          <button className="primary-button" type="submit">{t('sendSensorData')}</button>
          <small>{t('demoSimulated')}</small>
        </form>

        <div className="panel processing-flow">
          <div className="flow-step">ESP32 simulated</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step">Raspberry Pi simulated</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step">AI Prediction</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step">Risk result</div>
        </div>
      </div>
    </div>
  );

  const renderGisRiskHotspots = () => {
    const riskOrder = { All: 'ALL', 'No Risk': 'NO RISK', Low: 'LOW RISK', Moderate: 'MODERATE RISK', High: 'HIGH RISK' };
    const predictedFarms = GIS_FARM_DATA.map((farm) => ({
      ...farm,
      ...getPredictedRiskProfile(farm, gisTimeFilter),
    }));

    const filteredFarms = predictedFarms.filter((farm) => {
      const matchesRisk = gisRiskFilter === 'All' || farm.predictedRiskLevel === riskOrder[gisRiskFilter];
      return matchesRisk;
    });

    const farmsToRender = filteredFarms.length ? filteredFarms : predictedFarms;
    const selectedFarm = farmsToRender.find((farm) => farm.farmId === selectedFarmId) || predictedFarms[0];
    const hotspotScale = {
      Today: 1,
      'Last 7 Days': 1.25,
      'Last 30 Days': 1.5,
    }[gisTimeFilter] || 1;

    return (
      <div className="page-section gis-page">
        <div className="top-row">
          <div>
            <p className="eyebrow">Prototype view</p>
            <h2>GIS Risk Hotspots</h2>
            <p>Simulated farm locations for dairy mastitis risk monitoring.</p>
          </div>
          <div className="demo-badge">Demo / Simulated Data</div>
        </div>

        <div className="gis-controls panel">
          <div className="gis-filter-group">
            <span className="gis-filter-label">Risk</span>
            <div className="gis-filter-row">
              {['All', 'No Risk', 'Low', 'Moderate', 'High'].map((option) => (
                <button
                  key={option}
                  className={`gis-filter-button ${gisRiskFilter === option ? 'active' : ''}`}
                  onClick={() => setGisRiskFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="gis-filter-group">
            <span className="gis-filter-label">Time</span>
            <div className="gis-filter-row">
              {['Today', 'Last 7 Days', 'Last 30 Days'].map((option) => (
                <button
                  key={option}
                  className={`gis-filter-button ${gisTimeFilter === option ? 'active' : ''}`}
                  onClick={() => setGisTimeFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="gis-map-layout">
          <div className="gis-map-panel panel">
            <div className="gis-map-stage" role="img" aria-label="Map showing dairy farms and risk hotspots">
              <div className="gis-map-surface" />
              {GIS_HOTSPOTS.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="gis-hotspot"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: `${hotspot.radius * 2 * hotspotScale}%`,
                    height: `${hotspot.radius * 2 * hotspotScale}%`,
                  }}
                  title={hotspot.label}
                >
                  <span>{hotspot.label}</span>
                </div>
              ))}

              {farmsToRender.map((farm) => (
                <button
                  key={farm.farmId}
                  className={`gis-marker ${farm.predictedRiskLevel.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{ left: `${farm.x}%`, top: `${farm.y}%` }}
                  onClick={() => setSelectedFarmId(farm.farmId)}
                  type="button"
                  aria-label={`${farm.label} (${farm.farmId}) predicted risk ${farm.predictedRiskLevel} for ${gisTimeFilter}`}
                >
                  <span className="gis-marker-dot" />
                  <span className="gis-marker-label">
                    {farm.farmId}
                    {farm.predictedRiskLevel === 'HIGH RISK' ? ' • High mastitis' : ''}
                  </span>
                </button>
              ))}
            </div>

            <div className="gis-legend">
              <span className="gis-legend-item"><i className="legend-color green" /> No Risk</span>
              <span className="gis-legend-item"><i className="legend-color yellow" /> Low Risk</span>
              <span className="gis-legend-item"><i className="legend-color orange" /> Moderate Risk</span>
              <span className="gis-legend-item"><i className="legend-color red" /> High Risk</span>
              <span className="gis-legend-item"><i className="legend-color hotspot" /> Red Heat Area = High-Risk Hotspot</span>
            </div>
          </div>

          <aside className="gis-side panel">
            <div className="gis-side-header">
              <h3>Farm Overview</h3>
              <span className={`risk-badge ${selectedFarm.predictedRiskLevel.toLowerCase().replace(/\s+/g, '-')}`}>{selectedFarm.predictedRiskLevel}</span>
            </div>

            <div className="gis-farm-card">
              <p><strong>Farm ID:</strong> {selectedFarm.farmId}</p>
              <p><strong>Location:</strong> {selectedFarm.location}</p>
              <p><strong>Predicted Risk ({gisTimeFilter}):</strong> {selectedFarm.predictedRiskLevel} • {selectedFarm.predictedRiskScore}%</p>
              <p><strong>Total Cows:</strong> {selectedFarm.totalCows}</p>
              <p><strong>High Risk:</strong> {selectedFarm.highRisk}</p>
              <p><strong>Moderate Risk:</strong> {selectedFarm.moderateRisk}</p>
              <p><strong>Low Risk:</strong> {selectedFarm.lowRisk}</p>
              <p><strong>No Risk:</strong> {selectedFarm.noRisk}</p>
              <p><strong>Forecast:</strong> {selectedFarm.forecastNote}</p>
              <div className="gis-cow-list">
                <h4>Affected Cows</h4>
                {selectedFarm.cows.map((cow) => {
                  const derivedRisk = getPredictedRiskProfile({ ...selectedFarm, riskScore: cow.score }, gisTimeFilter);
                  return (
                    <div key={cow.cowId} className="gis-cow-item">
                      <div className="gis-cow-meta">
                        <strong>{cow.cowId}</strong>
                        <span className={`mini-badge ${derivedRisk.predictedRiskLevel.toLowerCase().replace(/\s+/g, '-')}`}>{derivedRisk.predictedRiskLevel}</span>
                      </div>
                      <div className="gis-cow-score">Score: {derivedRisk.predictedRiskScore}%</div>
                      <div className="gis-cow-note">{cow.alert} • {derivedRisk.forecastNote}</div>
                    </div>
                  );
                })}
              </div>
              <button className="primary-button" type="button">View Farm Details</button>
            </div>
          </aside>
        </div>

        <div className="gis-summary panel" id="gis-farm-details">
          <div className="panel-header">
            <h3>GIS RISK SUMMARY</h3>
            <span className="demo-badge">Prototype summary</span>
          </div>

          <div className="gis-summary-grid">
            <div className="gis-summary-stat"><span>Total Farms</span><strong>{GIS_RISK_SUMMARY.totalFarms}</strong></div>
            <div className="gis-summary-stat"><span>Total Cows</span><strong>{GIS_RISK_SUMMARY.totalCows}</strong></div>
            <div className="gis-summary-stat"><span>High-Risk Cows</span><strong>{GIS_RISK_SUMMARY.highRiskCows}</strong></div>
            <div className="gis-summary-stat"><span>Moderate-Risk Cows</span><strong>{GIS_RISK_SUMMARY.moderateRiskCows}</strong></div>
            <div className="gis-summary-stat"><span>Active Hotspots</span><strong>{GIS_RISK_SUMMARY.activeHotspots}</strong></div>
          </div>
        </div>

        <div className="gis-farm-details panel">
          <div className="panel-header">
            <div>
              <span className="panel-subtitle">Selected farm</span>
              <h3>{selectedFarm.label}</h3>
            </div>
            <span className={`risk-badge ${selectedFarm.predictedRiskLevel.toLowerCase().replace(/\s+/g, '-')}`}>{selectedFarm.predictedRiskLevel}</span>
          </div>

          <div className="gis-detail-grid">
            <div className="gis-detail-table-wrap">
              <table className="gis-detail-table">
                <thead>
                  <tr>
                    <th>Cow</th>
                    <th>Risk</th>
                    <th>Score</th>
                    <th>Affected Quarter</th>
                    <th>Milk EC</th>
                    <th>Milk Qty</th>
                    <th>Activity / Rumination</th>
                    <th>Previous Alerts</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFarm.cows.map((cow) => (
                    <tr key={cow.cowId}>
                      <td>{cow.cowId}</td>
                      <td><span className={`mini-badge ${cow.risk.toLowerCase().replace(/\s+/g, '-')}`}>{cow.risk}</span></td>
                      <td>{cow.score}%</td>
                      <td>{cow.quarter}</td>
                      <td>{cow.milkEC}</td>
                      <td>{cow.milkQuantity}</td>
                      <td>{cow.activity} / {cow.rumination}</td>
                      <td>{cow.alert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="gis-detail-insights">
              <h4>Recent risk alerts</h4>
              <ul>
                {selectedFarm.previousAlerts.map((alert) => (
                  <li key={alert}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAlerts = () => (
    <div className="page-section">
      <h2>{t('alerts')}</h2>
      <div className="alerts-stack">
        {alerts.map((alert) => (
          <div className="alert-panel panel" key={alert.id}>
            <div className="alert-panel-head">
              <h3>{alert.title}</h3>
              <span className={`risk-badge ${alert.severity.toLowerCase().replace(' ', '-')}`}>{alert.severity}</span>
            </div>
            <p>{alert.cow_id}</p>
            <p><strong>{t('riskScore')}:</strong> {alert.message}</p>
            <div className="alert-actions">
              <button className="small-button">{t('monitor')}</button>
              <button className="small-button">{t('close')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="page-section">
      <h2>{t('reports')}</h2>
      <div className="report-buttons" role="tablist" aria-label="Report schedules">
        {reportSchedules.map((report) => {
          const Icon = report.icon;
          const labelKey = {
            daily: 'dailyReport',
            weekly: 'weeklyReport',
            cowHealth: 'cowHealthReport',
            herdRisk: 'herdRiskReport',
          }[report.key];
          return (
            <button
              className={`report-button ${selectedReportKey === report.key ? 'active' : ''}`}
              key={report.key}
              onClick={() => setSelectedReportKey(report.key)}
              role="tab"
              aria-selected={selectedReportKey === report.key}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{t(labelKey)}</span>
            </button>
          );
        })}
        <button className="primary-button">{t('export')}</button>
      </div>
      {(() => {
        const report = reportSchedules.find((item) => item.key === selectedReportKey) || reportSchedules[0];
        return (
          <div className="report-schedule panel" role="tabpanel">
            <div className="panel-header">
              <div>
                <span className="panel-subtitle">Required report schedule</span>
                <h3>{report.label}</h3>
              </div>
              <CalendarDays size={24} className="report-calendar-icon" aria-hidden="true" />
            </div>
            <div className="report-schedule-grid">
              <div><span>Frequency</span><strong>{report.frequency}</strong></div>
              <div><span>Next report</span><strong>{report.nextRun}</strong></div>
              <div><span>Delivery</span><strong>{report.delivery}</strong></div>
              <div><span>Latest collected milk pH</span><strong>{selectedCow?.milk_ph ?? 'Not collected'}</strong></div>
            </div>
            <div className="report-includes">
              <h4>Information included</h4>
              <ul>{report.includes.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        );
      })()}
    </div>
  );

  const handleMastitisUpload = async (event) => {
    const file = event.target.files?.[0] || mastitisFile;
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setMastitisUploading(true);
    setMastitisUploadError('');
    try {
      const result = await api.uploadMastitisDataset(formData);
      setMastitisData(result || { summary: { total_cows: 0, no_risk: 0, low_risk: 0, moderate_risk: 0, high_risk: 0, average_risk: 0 }, cows: [], model_status: 'SIMULATION', message: '' });
      if (result?.cows?.length) {
        const nextCowId = getMostAffectedCowId(result.cows) || result.cows[0].cow_id;
        setMastitisSelectedCowId(nextCowId);
        await refreshMastitisTrend(nextCowId);
      }
      setMastitisFile(file);
    } catch (err) {
      setMastitisUploadError(err.message || 'Dataset upload failed');
    } finally {
      setMastitisUploading(false);
    }
  };

  const handleRunMastitisPrediction = async () => {
    if (!mastitisSelectedCowId) return;
    try {
      const result = await api.predictMastitis({ cow_id: mastitisSelectedCowId });
      const prediction = result?.result || result || mastitisSelectedCow;
      if (!prediction) return;
      setMastitisData((prev) => {
        const nextCows = (prev.cows || []).map((cow) => String(cow.cow_id) === String(prediction.cow_id)
          ? { ...cow, ...prediction }
          : cow);
        return { ...prev, cows: nextCows, message: 'Prediction complete. Data processed through the virtual hardware chain.' };
      });
      const nextCowId = String(prediction.cow_id || mastitisSelectedCowId);
      setMastitisSelectedCowId(nextCowId);
      await refreshMastitisTrend(nextCowId);
    } catch (err) {
      setMastitisUploadError(err.message || 'Prediction failed');
    }
  };

  const renderSettings = () => (
    <div className="page-section">
      <h2>{t('settings')}</h2>
      <div className="settings-panel panel">
        <div className="setting-row">
          <label>{t('language')}</label>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); }}>
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
            <option value="hi">हिन्दी</option>
            <option value="ml">മലയാളം</option>
          </select>
        </div>
        <div className="setting-row toggle-row">
          <label>{t('voiceAssistant')}</label>
          <button className="toggle" onClick={() => saveSettings({ ...settings, voice_enabled: !settings.voice_enabled })}>{settings.voice_enabled ? 'ON' : 'OFF'}</button>
        </div>
        <div className="setting-row toggle-row">
          <label>{t('autoReadHighRisk')}</label>
          <button className="toggle" onClick={() => saveSettings({ ...settings, auto_read_alerts: !settings.auto_read_alerts })}>{settings.auto_read_alerts ? 'ON' : 'OFF'}</button>
        </div>
      </div>
    </div>
  );

  const renderMastitisMonitor = () => {
    const hardwareRisk = String(mastitisSelectedCow?.overall_risk || 'NO RISK').toUpperCase();
    const isHighRisk = hardwareRisk.includes('HIGH') || hardwareRisk.includes('MODERATE');
    const herdRows = mastitisData.cows || [];
    const highestRiskCow = herdRows.reduce((best, current) => {
      if (!best) return current;
      return Number(current.risk_score || 0) > Number(best.risk_score || 0) ? current : best;
    }, null);

    return (
      <div className="page-section">
        <div className="top-row">
          <div>
            <p className="eyebrow">AI MASTITIS MONITOR</p>
            <h2>AI Mastitis Monitor</h2>
          </div>
          <div className="demo-badge">{mastitisData.model_status || 'SIMULATION'}</div>
        </div>

        <div className="mastitis-upload panel">
          <div className="panel-header">
            <div>
              <h3>Dataset Upload</h3>
              <small className="panel-subtitle">Upload CSV files with cow health and milking data</small>
            </div>
            <div className="mastitis-actions">
              <button className="primary-button" onClick={handleRunMastitisPrediction}>Run AI Prediction</button>
              <button className="small-button" onClick={() => document.getElementById('mastitis-csv-input')?.click()} disabled={mastitisUploading}>
                {mastitisUploading ? 'Uploading...' : 'Upload CSV'}
              </button>
            </div>
          </div>
          <input id="mastitis-csv-input" type="file" accept=".csv" hidden onChange={handleMastitisUpload} />
          <div className="csv-upload-row">
            <span className="csv-file-name">{mastitisFile ? mastitisFile.name : 'sample_mastitis_data.csv'}</span>
            <span className="model-status-pill">{mastitisData.message || 'AI DEMONSTRATION / SIMULATION'}</span>
          </div>
          {mastitisUploadError && <div className="error-box">{mastitisUploadError}</div>}
        </div>

        <div className="stats-grid mastitis-stats">
          <StatCard label="Total Cows" value={mastitisData.summary?.total_cows ?? 0} icon={<HeartPulse size={22} />} accent="green" />
          <StatCard label="No Risk" value={mastitisData.summary?.no_risk ?? 0} icon={<ShieldCheck size={22} />} accent="blue" />
          <StatCard label="Low Risk" value={mastitisData.summary?.low_risk ?? 0} icon={<Droplets size={22} />} accent="blue" />
          <StatCard label="Moderate Risk" value={mastitisData.summary?.moderate_risk ?? 0} icon={<Thermometer size={22} />} accent="amber" />
          <StatCard label="High Risk" value={mastitisData.summary?.high_risk ?? 0} icon={<AlertTriangle size={22} />} accent="red" />
          <StatCard label="Average Herd Risk" value={`${mastitisData.summary?.average_risk ?? 0}%`} icon={<Activity size={22} />} accent="green" />
        </div>

        <div className="panel mastitis-virtual-hardware">
          <div className="panel-header">
            <div>
              <h3>Virtual Hardware System</h3>
              <small className="panel-subtitle">Dataset → Virtual sensors → Milking unit → Raspberry Pi → AI prediction → alert</small>
            </div>
            <span className={`status-badge ${isHighRisk ? 'danger' : 'success'}`}>{hardwareRisk}</span>
          </div>

          <div className="hardware-flow">
            <div className="cow-stage">
              <div className="cow-graphic">
                <div className="cow-body" />
                <div className="cow-head" />
                <div className="quarter quarter-q1">Q1</div>
                <div className="quarter quarter-q2">Q2</div>
                <div className="quarter quarter-q3">Q3</div>
                <div className="quarter quarter-q4">Q4</div>
              </div>
            </div>

            <div className="flow-line-wrap">
              <div className="flow-line" />
              <div className="flow-tag">Teat Cups</div>
            </div>

            <div className="sensor-stage">
              <div className="sensor-chamber">
                <span>Milk Sensor Unit</span>
                <div className="sensor-wave" />
                <div className="sensor-badges">
                  <span>EC</span>
                  <span>pH</span>
                  <span>Temp</span>
                  <span>Flow</span>
                </div>
              </div>
            </div>

            <div className="flow-line-wrap">
              <div className="flow-line" />
              <div className="flow-tag">Virtual Sensors</div>
            </div>

            <div className="pi-stage">
              <div className="pi-board">
                <div className="pi-socket" />
                <span>Raspberry Pi<br />Edge AI Controller</span>
              </div>
              <div className="pi-process">
                <span>Reading Sensors</span>
                <span>Processing Data</span>
                <span>Running AI Model</span>
                <span>Generating Risk Score</span>
              </div>
            </div>

            <div className="flow-line-wrap">
              <div className="flow-line" />
              <div className="flow-tag">AI Model</div>
            </div>

            <div className="display-stage">
              <div className={`display-box ${isHighRisk ? 'alert' : 'normal'}`}>
                <div className="display-head"><BrandMarkIcon size={16} className="brand-icon" /> TEAT GUARD</div>
                <div className="display-cow">Cow {mastitisSelectedCow?.cow_id || 'C001'}</div>
                {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => {
                  const riskValue = Number(mastitisSelectedCow?.quarter_risks?.[quarter] ?? 0);
                  const isFlagged = riskValue >= 70 || (mastitisSelectedCow?.affected_quarter === quarter && mastitisSelectedCow?.overall_risk !== 'NO RISK');
                  return (
                    <div className="display-row" key={quarter}>
                      <span>{quarter}</span>
                      <span>{isFlagged ? 'HIGH' : 'NORMAL'}</span>
                      <span className={`display-light ${isFlagged ? 'danger' : 'safe'}`} />
                    </div>
                  );
                })}
                <div className="display-status">{isHighRisk ? 'HIGH MASTITIS RISK' : 'NO RISK'}</div>
                <div className="display-score">Risk Score: {mastitisSelectedCow?.risk_score ?? 0}%</div>
              </div>
              <div className={`buzzer ${isHighRisk ? 'alert' : 'idle'}`}>
                <span className="buzzer-light" />
                <span>BUZZER ALERT</span>
              </div>
            </div>

            <div className="flow-line-wrap">
              <div className="flow-line" />
              <div className="flow-tag">Prediction</div>
            </div>

            <div className="diversion-stage">
              <div className={`tank-box abnormal-tank ${isHighRisk ? 'active' : ''}`}>
                <span>{isHighRisk ? 'ABNORMAL MILK CONTAINER' : 'NORMAL FLOW'}</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="tank-box main-tank">
                <span>Main Milk Tank</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mastitis-selection-layout">
          {mastitisSelectedCow && (
            <div className="panel mastitis-detail-panel">
              <div className="panel-header">
                <div>
                  <h3>AI Prediction Result</h3>
                  <small className="panel-subtitle">Cow {mastitisSelectedCow.cow_id} • {mastitisSelectedCow.overall_risk || 'NO RISK'}</small>
                </div>
                <span className={`status-badge ${isHighRisk ? 'danger' : 'success'}`}>{mastitisSelectedCow.overall_risk || 'NO RISK'}</span>
              </div>

              <div className="result-summary">
                <div className="result-headline">
                  <div>
                    <p className="eyebrow muted">Cow ID</p>
                    <h4>{mastitisSelectedCow.cow_id}</h4>
                  </div>
                  <div className="risk-score-block">
                    <span>Risk Score</span>
                    <strong>{mastitisSelectedCow.risk_score ?? 0}%</strong>
                  </div>
                </div>

                <div className="result-grid">
                  <div className="result-card">
                    <span>Overall Risk</span>
                    <strong className={isHighRisk ? 'risk-red' : 'risk-green'}>{mastitisSelectedCow.overall_risk || 'NO RISK'}</strong>
                  </div>
                  <div className="result-card">
                    <span>Affected Quarter</span>
                    <strong>{mastitisSelectedCow.affected_quarter || 'None'}</strong>
                  </div>
                  <div className="result-card">
                    <span>Trend</span>
                    <strong>↑ Increasing</strong>
                  </div>
                </div>
              </div>

              <div className="mastitis-grid">
                <div className="quarter-visualization">
                  <h4>Four Quarter Udder View</h4>
                  <div className="cow-udder">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => {
                      const riskValue = Number(mastitisSelectedCow.quarter_risks?.[quarter] ?? 0);
                      const isQuarterHigh = riskValue >= 70 || (mastitisSelectedCow.affected_quarter === quarter && mastitisSelectedCow.overall_risk !== 'NO RISK');
                      return (
                        <div className={`udder-quarter ${isQuarterHigh ? 'high-risk' : 'normal'}`} key={quarter}>
                          <span>{quarter}</span>
                          <small>{isQuarterHigh ? 'HIGH RISK' : 'NORMAL'}</small>
                          <strong>{riskValue}%</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="sensor-panel">
                  <h4>Live Sensor Input</h4>
                  <div className="sensor-list">
                    {[
                      ['Cow Temperature', mastitisSelectedCow.cow_temperature || 0, '°C', 'risk'],
                      ['Activity', mastitisSelectedCow.activity || 0, '%', 'risk'],
                      ['Rumination', mastitisSelectedCow.rumination || 0, 'min', 'risk'],
                      ['Milk Temperature', mastitisSelectedCow.milk_temperature || 0, '°C', 'risk'],
                      ['Milk EC', mastitisSelectedCow.milk_conductivity || 0, 'mS/cm', 'risk'],
                      ['Milk pH', mastitisSelectedCow.milk_ph || 0, '', 'risk'],
                      ['Milk Quantity', mastitisSelectedCow.milk_yield || 0, 'L', 'risk'],
                      ['Farm Temperature', mastitisSelectedCow.farm_temperature || 0, '°C', 'normal'],
                      ['Farm Humidity', mastitisSelectedCow.humidity || 0, '%', 'normal'],
                    ].map(([label, value, unit, type]) => (
                      <div className={`sensor-card ${type}`} key={label}>
                        <span>{label}</span>
                        <strong>{value}{unit}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="reason-panel">
                <h4>Why is this cow at risk?</h4>
                <ul>
                  {(mastitisSelectedCow.contributing_factors || []).map((factor) => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
              </div>

              <div className="mastitis-trend-box">
                <h4>Risk Trend</h4>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mastitisTrend} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dfe7ef" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Risk']} />
                      <Bar dataKey="risk" radius={[8, 8, 0, 0]} fill={isHighRisk ? '#ef4444' : '#3b82f6'} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="recommendation-box mastitis-recommendation-box">
                <h4>Recommendations</h4>
                <ul>
                  {(mastitisSelectedCow.recommendations || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="panel mastitis-herd-panel">
            <div className="panel-header">
              <div>
                <h3>Herd AI Summary</h3>
                <small className="panel-subtitle">Total Cows: {mastitisData.summary?.total_cows ?? 0}</small>
              </div>
            </div>
            <div className="herd-summary-grid">
              <div className="summary-chip safe"><span>🟢</span> No Risk: {mastitisData.summary?.no_risk ?? 0}</div>
              <div className="summary-chip low"><span>🔵</span> Low Risk: {mastitisData.summary?.low_risk ?? 0}</div>
              <div className="summary-chip moderate"><span>🟠</span> Moderate Risk: {mastitisData.summary?.moderate_risk ?? 0}</div>
              <div className="summary-chip high"><span>🔴</span> High Risk: {mastitisData.summary?.high_risk ?? 0}</div>
            </div>
            <div className="herd-table-wrap">
              <table className="mastitis-table">
                <thead>
                  <tr>
                    <th>Cow ID</th>
                    <th>Risk</th>
                    <th>Score</th>
                    <th>Quarter</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {(mastitisData.cows || []).map((cow) => (
                    <tr
                      key={cow.cow_id}
                      onClick={async () => {
                        setMastitisSelectedCowId(cow.cow_id);
                        await refreshMastitisTrend(cow.cow_id);
                      }}
                      className={mastitisSelectedCowId === cow.cow_id ? 'selected-row' : ''}
                    >
                      <td>{cow.cow_id}</td>
                      <td><span className={`mini-badge ${String(cow.overall_risk || 'NO RISK').toLowerCase().replace(/\s+/g, '-')}`}>{cow.overall_risk || 'NO RISK'}</span></td>
                      <td>{cow.risk_score ?? 0}%</td>
                      <td>{cow.affected_quarter || '—'}</td>
                      <td>↑</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {highestRiskCow && (
              <div className="highest-risk-note">
                <strong>Highest Risk Cow:</strong> {highestRiskCow.cow_id} • <strong>Highest Risk Quarter:</strong> {highestRiskCow.affected_quarter || 'Q2'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPredictions = () => {
    const latestReading = selectedCow?.latest_reading || {};
    const predictionReadings = [
      { label: t('milkYield'), value: latestReading.milk_yield, unit: 'L', min: 8, max: 12, normal: '8-12 L', icon: Milk },
      { label: t('conductivity'), value: latestReading.milk_conductivity, unit: 'mS/cm', min: 4, max: 6, normal: '4-6 mS/cm', icon: Droplets },
      { label: 'Milk temperature', value: latestReading.milk_temperature, unit: '°C', min: 38, max: 39, normal: '38-39 °C', icon: Thermometer },
      { label: t('activity'), value: latestReading.activity, unit: '%', min: 50, max: 80, normal: '50-80%', icon: Activity },
      { label: t('rumination'), value: latestReading.rumination, unit: 'min/day', min: 260, max: 360, normal: '260-360 min/day', icon: Wheat },
      { label: t('bodyTemperature'), value: latestReading.body_temperature, unit: '°C', min: 38.5, max: 39, normal: '38.5-39 °C', icon: Thermometer },
      { label: 'SSC', value: latestReading.somatic_cell_count, unit: 'cells/mL', min: 0, max: 99999, normal: '< 100,000 cells/mL', icon: ShieldCheck },
    ];
    const attentionReadings = predictionReadings.filter((reading) => {
      const value = Number(reading.value);
      return Number.isFinite(value) && (value < reading.min || value > reading.max);
    });
    const sscStatus = getSscStatus(latestReading.somatic_cell_count);

    return (
    <div className="page-section">
      <div className="top-row">
        <div>
          <h2>{t('predictions')}</h2>
          <p>{t('reasonTitle')}</p>
        </div>
        {selectedCow && <span className="risk-badge" style={{ background: riskColors[selectedCow.risk_category] || '#22c55e' }}>{selectedCow.risk_category || 'NO RISK'}</span>}
      </div>
      {selectedCow && (
        <div className="panel prediction-panel">
          <div className="prediction-heading">
            <div>
              <span className="panel-subtitle">Individual cow prediction</span>
              <h3>{selectedCow.name} <small>({selectedCow.cow_id})</small></h3>
            </div>
            <strong className="prediction-score">{selectedCow.risk_score || 0}%</strong>
          </div>
          <div className="prediction-meter">
            <div className="meter-fill" style={{ width: `${selectedCow.risk_score || 0}%`, background: riskColors[selectedCow.risk_category] || '#22c55e' }} />
          </div>
          <section className="prediction-summary">
            <div className="section-heading"><ShieldCheck size={18} /><h4>Prediction interpretation</h4></div>
            <p>
              {selectedCow.risk_category === 'HIGH RISK'
                ? `This cow has a high mastitis risk score of ${selectedCow.risk_score || 0}%. ${attentionReadings.length} of ${predictionReadings.length} measured indicators are outside the normal range.`
                : selectedCow.risk_category === 'MODERATE RISK'
                  ? `This cow needs closer monitoring. The risk score is ${selectedCow.risk_score || 0}%, with ${attentionReadings.length} of ${predictionReadings.length} measured indicators outside the normal range.`
                  : `This cow has a ${String(selectedCow.risk_category || 'NO RISK').toLowerCase()} prediction with a score of ${selectedCow.risk_score || 0}%. Review each measured value below for context.`}
            </p>
            <div className="prediction-summary-stats">
              <span><strong>{attentionReadings.length}</strong> readings need attention</span>
              <span><strong>{sscStatus.label}</strong> SSC classification</span>
            </div>
          </section>
          <div className="prediction-overview">
            <section className="prediction-section prediction-signals">
              <div className="section-heading"><Activity size={18} /><h4>Actual values vs normal</h4></div>
              <div className="prediction-reading-list">
                {predictionReadings.map((reading) => <PredictionReading key={reading.label} {...reading} />)}
              </div>
            </section>
            <section className="prediction-section prediction-reading">
              <div className="section-heading"><Droplets size={18} /><h4>Latest reading</h4></div>
              <div className="prediction-reading-value"><span>Milk pH</span><strong>{selectedCow.milk_ph ?? 'Not collected'}</strong></div>
              <p>Review the latest sensor readings together with the risk score before taking action.</p>
            </section>
          </div>
          <button className="primary-button prediction-voice-button" onClick={() => voiceSummary(selectedCow)}><Volume2 size={16} /> {t('readAloud')}</button>
        </div>
      )}
    </div>
    );
  };

  const renderMasterTest = () => {
    const latestReading = selectedCow?.latest_reading || {};
    const ssc = Number(latestReading.somatic_cell_count);
    const masterTestRecommendations = selectedCow && getCareRecommendations(selectedCow).length > 0
      ? getCareRecommendations(selectedCow)
      : ['Continue routine monitoring and repeat the Treatment Plan review according to the farm schedule.'];
    const today = new Date();
    const dateLabel = today.toLocaleDateString(language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'ml' ? 'ml-IN' : 'en-US');
    const timetable = [
      { date: dateLabel, time: '06:00 AM', activity: 'Treatment Plan review', status: 'Ready', action: 'Collect milk and record SSC', icon: ClipboardCheck },
      { date: dateLabel, time: '08:00 AM', activity: 'Result review', status: Number.isFinite(ssc) ? 'Completed' : 'Pending', action: Number.isFinite(ssc) ? 'Compare with normal SSC' : 'Enter the test result', icon: CheckCircle2 },
      { date: dateLabel, time: '04:00 PM', activity: 'Follow-up observation', status: selectedCow?.risk_category === 'HIGH RISK' ? 'Priority' : 'Scheduled', action: 'Check udder, appetite, and activity', icon: HeartPulse },
      { date: dateLabel, time: '08:00 PM', activity: 'Care plan check-in', status: 'Upcoming', action: 'Review feeding and veterinary notes', icon: CalendarDays },
    ];

    return (
      <div className="page-section master-test-page">
        <div className="top-row">
          <div>
            <span className="eyebrow">{t('masterTest')}</span>
            <h1>{t('cowMasterTest')}</h1>
            <p>{selectedCow ? `${selectedCow.name} (${selectedCow.cow_id})` : t('selectCow')}</p>
          </div>
          <ClipboardCheck size={38} className="master-test-title-icon" aria-hidden="true" />
        </div>

        <section className="master-test-hero panel">
          <div className="master-test-hero-copy">
            <div className="section-heading"><ClipboardCheck size={20} /><h3>{t('cowMasterTest')}</h3></div>
            <p>{t('masterTestIntro')}</p>
            <div className="master-test-actions">
              <span className="click-here-label">{t('clickHere')}</span>
              <button className="master-test-cta" onClick={() => setMasterTestRecommendationVisible(true)}>
                <Stethoscope size={17} /><span>{t('recommendation')}</span><ArrowRight size={17} />
              </button>
            </div>
          </div>
          <div className="master-test-result">
            <span>{t('latestSsc')}</span>
            <strong>{Number.isFinite(ssc) ? `${ssc.toLocaleString()} cells/mL` : t('notCollected')}</strong>
            <small>{t('normalSsc')}: &lt; 100,000 cells/mL</small>
          </div>
        </section>

        {masterTestRecommendationVisible && (
          <section className="master-test-recommendation panel">
            <div className="section-heading"><Stethoscope size={20} /><h3>{t('masterTestRecommendation')}</h3></div>
            <ul className="master-test-care-list">{masterTestRecommendations.map((recommendation, index) => {
              const Icon = careRecommendationIcons[index] || Stethoscope;
              return <li key={recommendation}><span className="recommendation-icon" aria-hidden="true"><Icon size={17} /></span><span>{recommendation}</span></li>;
            })}</ul>
          </section>
        )}

        {selectedCow && getDietPlan(selectedCow).length > 0 && renderDietPlan(selectedCow)}

        <section className="master-test-schedule panel">
          <div className="panel-header">
            <div><span className="panel-subtitle">{t('organizedSchedule')}</span><h3>{t('timetableMasterTest')}</h3></div>
            <CalendarDays size={24} className="report-calendar-icon" aria-hidden="true" />
          </div>
          <div className="master-test-table-wrap">
            <table className="master-test-table">
              <thead><tr>
                <th><CalendarDays size={15} />{t('date')}</th>
                <th><Clock3 size={15} />{t('time')}</th>
                <th><ClipboardCheck size={15} />{t('testActivity')}</th>
                <th><HeartPulse size={15} />{t('cowId')}</th>
                <th><Activity size={15} />{t('status')}</th>
                <th><Stethoscope size={15} />{t('recommendedAction')}</th>
              </tr></thead>
              <tbody>{timetable.map((item) => {
                const Icon = item.icon;
                return <tr key={`${item.time}-${item.activity}`}>
                  <td>{item.date}</td><td className="table-time">{item.time}</td>
                  <td><span className="table-activity"><Icon size={16} />{item.activity}</span></td>
                  <td>{selectedCow?.cow_id || '-'}</td>
                  <td><span className={`table-status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                  <td>{item.action}</td>
                </tr>;
              })}</tbody>
            </table>
          </div>
        </section>
      </div>
    );
  };

  const renderContent = () => {
    switch (page) {
      case 'dashboard': return renderDashboard();
      case 'cows': return renderCows();
      case 'sensorMonitoring': return renderSensorMonitoring();
      case 'predictions': return renderPredictions();
      case 'farmManagement': return renderFarmManagement();
      case 'aiMastitis': return renderMastitisMonitor();
      case 'gisRiskHotspots': return renderGisRiskHotspots();
      case 'masterTest': return renderMasterTest();
      case 'alerts': return renderAlerts();
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  if (loading) return <div className="loading-screen">{t('loading')}</div>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <BrandMarkIcon size={26} className="brand-icon" />
          <span>TEAT GUARD</span>
        </div>
        <nav>
          {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
            <button key={key} className={`nav-item ${page === key ? 'active' : ''}`} onClick={() => setPage(key)}>
              <Icon size={18} />
              <span>{label || t(key)}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button"
              onClick={() => {
                if (!settings.voice_enabled) {
                  handleVoiceToggle(true);
                }
                voiceSummary(selectedCow);
              }}
              aria-label={settings.voice_enabled ? 'Voice assistant on' : 'Turn voice assistant on'}
              title={settings.voice_enabled ? 'Voice assistant is on' : 'Turn voice assistant on'}
            >
              <Volume2 size={18} />
            </button>
            <button
              className="voice-toggle-button"
              onClick={() => handleVoiceToggle()}
              aria-label={settings.voice_enabled ? 'Turn voice assistant off' : 'Turn voice assistant on'}
              title={settings.voice_enabled ? 'Turn voice assistant off' : 'Turn voice assistant on'}
            >
              {settings.voice_enabled ? 'VOICE ON' : 'VOICE OFF'}
            </button>
            <button className="icon-button" onClick={() => setPage('settings')}><Languages size={18} /></button>
          </div>
          <div className="topbar-status">
            <div className="live-clock" aria-label="Current time">
              <Clock3 size={17} aria-hidden="true" />
              <strong>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            {(() => {
              const reminder = getNextDietReminder(selectedCow);
              return reminder ? (
                <button className="care-reminder" onClick={() => setPage('cows')} aria-live="polite">
                  <Bell size={16} aria-hidden="true" />
                  <span><strong>{t('nextCarePlan')}</strong> {reminder.time} · {reminder.meal.title}</span>
                </button>
              ) : null;
            })()}
          </div>
          <div className="lang-picker">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">EN</option>
              <option value="ta">TA</option>
              <option value="hi">HI</option>
              <option value="ml">ML</option>
            </select>
          </div>
        </header>

        {error && <div className="error-box">{error}</div>}
        {voiceMessage && <div className="message-box">{voiceMessage}</div>}
        {renderContent()}

        <div className="bottom-nav">
          {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
            <button key={key} className="bottom-nav-item" onClick={() => setPage(key)}>
              <Icon size={18} />
              <span>{label || t(key)}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`stat-card ${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Metric({ label, value, status }) {
  const statusClass = status === 'high' ? 'danger' : status === 'low' ? 'warning' : 'good';
  return (
    <div className={`metric-card ${statusClass}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SensorField({ label, value, onChange, type = 'text', ...inputProps }) {
  const fieldId = `sensor-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <label className="sensor-field" htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} type={type} value={value} onChange={(event) => onChange(event.target.value)} {...inputProps} />
    </label>
  );
}

function CowReadingMetric({ label, value, unit, min, max, normal }) {
  const numericValue = Number(value);
  const hasValue = value !== null && value !== undefined && value !== '' && Number.isFinite(numericValue);
  const isNormal = hasValue && numericValue >= min && numericValue <= max;
  const displayValue = hasValue ? `${numericValue}${unit ? ` ${unit}` : ''}` : 'Not collected';

  return (
    <div className={`metric-card ${isNormal ? 'good' : 'danger'}`}>
      <span>{label}</span>
      <strong>{displayValue}</strong>
      <small>Normal: {normal}</small>
      <em>{hasValue ? (isNormal ? 'Normal' : 'Needs attention') : 'No reading'}</em>
    </div>
  );
}

function PredictionReading({ label, value, unit, min, max, normal, icon: Icon }) {
  const numericValue = Number(value);
  const hasValue = value !== null && value !== undefined && value !== '' && Number.isFinite(numericValue);
  const isNormal = hasValue && numericValue >= min && numericValue <= max;
  const displayValue = hasValue ? `${numericValue.toLocaleString()}${unit ? ` ${unit}` : ''}` : 'Not collected';

  return (
    <div className={`prediction-reading-row ${hasValue && isNormal ? 'normal' : 'attention'}`}>
      <span className="prediction-reading-icon" aria-hidden="true"><Icon size={16} /></span>
      <div>
        <strong>{label}</strong>
        <small>Normal: {normal}</small>
      </div>
      <div className="prediction-reading-result">
        <strong>{displayValue}</strong>
        <span>{hasValue ? (isNormal ? 'Normal' : 'Needs attention') : 'No reading'}</span>
      </div>
    </div>
  );
}

export default App;
