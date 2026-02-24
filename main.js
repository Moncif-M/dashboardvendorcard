let caChart;
const gauges = {};

// Utility to create semi-circular gauge using Chart.js doughnut
function createGauge(ctx, value, options = {}) {
  const {
    max = 100,
    gradientFrom = '#4caf50',
    gradientTo = '#8bc34a',
    background = '#edf1f7',
  } = options;

  const percent = Math.max(0, Math.min(1, value / max));

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [
        {
          data: [percent, 1 - percent],
          backgroundColor: [gradientFrom, background],
          borderWidth: 0,
          cutout: '70%',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      circumference: 180,
      rotation: -90,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
  });
}

function updateGauge(chart, value, max = 100) {
  if (!chart) return;
  const percent = Math.max(0, Math.min(1, value / max));
  chart.data.datasets[0].data = [percent, 1 - percent];
  chart.update();
}

// Simple demo scenarios for filters
const scenarios = {
  default: {
    tiering: 'Tier 1',
    globalRisk: 'Medium',
    successfulAwards: 42,
    awardingVolume: '32.5M',
    ongoingPO: 31,
    ongoingBids: 12,
    scorePreAwardKpi: '81%',
    jesaScope: '63%',
    ecosystemScore: 78,
    hseScore: 88,
    sustainabilityScore: 65,
    complianceRate: 92,
    scorePreAwardGauge: 81,
    statusLabel: 'Good',
    statusClass: 'status-good',
    // Post award KPIs
    postChangeRequests: 8,
    postClaims: 5,
    postAvgScoreClosed: '78%',
    postContractsPerContractor: 23,
    postScoreMM: 74,
    postScoreContract: 69,
    // Chart
    ca: [12, 18, 14, 22, 25, 21, 27, 30],
    jesaDependence: [30, 40, 38, 45, 50, 48, 55, 60],
  },
  supplierA: {
    tiering: 'Tier 1',
    globalRisk: 'Low',
    successfulAwards: 28,
    awardingVolume: '18.4M',
    ongoingPO: 18,
    ongoingBids: 5,
    scorePreAwardKpi: '89%',
    jesaScope: '55%',
    ecosystemScore: 86,
    hseScore: 92,
    sustainabilityScore: 72,
    complianceRate: 97,
    scorePreAwardGauge: 89,
    statusLabel: 'Very Good',
    statusClass: 'status-good',
    postChangeRequests: 3,
    postClaims: 1,
    postAvgScoreClosed: '88%',
    postContractsPerContractor: 15,
    postScoreMM: 86,
    postScoreContract: 82,
    ca: [8, 11, 13, 16, 18, 20, 19, 21],
    jesaDependence: [35, 37, 40, 42, 44, 46, 48, 50],
  },
  supplierB: {
    tiering: 'Tier 2',
    globalRisk: 'High',
    successfulAwards: 10,
    awardingVolume: '9.2M',
    ongoingPO: 9,
    ongoingBids: 7,
    scorePreAwardKpi: '62%',
    jesaScope: '71%',
    ecosystemScore: 64,
    hseScore: 72,
    sustainabilityScore: 58,
    complianceRate: 81,
    scorePreAwardGauge: 62,
    statusLabel: 'At Risk',
    statusClass: 'status-warning',
    postChangeRequests: 12,
    postClaims: 7,
    postAvgScoreClosed: '64%',
    postContractsPerContractor: 9,
    postScoreMM: 68,
    postScoreContract: 61,
    ca: [6, 7, 9, 10, 12, 13, 14, 15],
    jesaDependence: [55, 58, 60, 62, 64, 66, 68, 70],
  },
};

function applyScenario(scenarioKey = 'default') {
  const s = scenarios[scenarioKey] || scenarios.default;

  const setKpi = (key, value) => {
    const el = document.querySelector(`[data-kpi="${key}"] .kpi-value`);
    if (el && typeof value !== 'undefined') el.textContent = value;
  };

  setKpi('tiering', s.tiering);
  setKpi('globalRisk', s.globalRisk);
  setKpi('successfulAwards', s.successfulAwards);
  setKpi('awardingVolume', s.awardingVolume);
  setKpi('ongoingPO', s.ongoingPO);
  setKpi('ongoingBids', s.ongoingBids);
  setKpi('scorePreAwardKpi', s.scorePreAwardKpi);
  setKpi('jesaScope', s.jesaScope);
  // Post award KPIs
  setKpi('changeRequests', s.postChangeRequests);
  setKpi('claims', s.postClaims);
  setKpi('avgScoreClosed', s.postAvgScoreClosed);
  setKpi('contractsPerContractor', s.postContractsPerContractor);

  // Gauges & numeric labels
  updateGauge(gauges.ecosystem, s.ecosystemScore);
  updateGauge(gauges.hse, s.hseScore);
  updateGauge(gauges.sustainability, s.sustainabilityScore);
  updateGauge(gauges.compliance, s.complianceRate);
  updateGauge(gauges.scorePreAward, s.scorePreAwardGauge);
  updateGauge(gauges.scorePostAwardMM, s.postScoreMM);
  updateGauge(gauges.scorePostAwardContract, s.postScoreContract);

  const setGaugeLabel = (id, val) => {
    const wrapper = document.getElementById(id)?.parentElement;
    const label = wrapper?.querySelector('.gauge-score');
    if (label) label.textContent = `${val}%`;
  };
  setGaugeLabel('ecosystemGauge', s.ecosystemScore);
  setGaugeLabel('hseGauge', s.hseScore);
  setGaugeLabel('sustainabilityGauge', s.sustainabilityScore);
  setGaugeLabel('complianceGauge', s.complianceRate);
  setGaugeLabel('scorePreAwardGauge', s.scorePreAwardGauge);
  setGaugeLabel('scorePostAwardMMGauge', s.postScoreMM);
  setGaugeLabel('scorePostAwardContractGauge', s.postScoreContract);

  // Status pill
  const statusPill = document.querySelector('.status-pill');
  if (statusPill) {
    statusPill.textContent = s.statusLabel;
    statusPill.classList.remove('status-good', 'status-warning', 'status-bad');
    statusPill.classList.add(s.statusClass);
  }

  // Line chart
  if (caChart) {
    caChart.data.datasets[0].data = s.ca;
    caChart.data.datasets[1].data = s.jesaDependence;
    caChart.update();
  }
}

function initCharts() {
  const caCtx = document.getElementById('caJesaChart');
  if (!caCtx) return;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const chiffreAffaire = scenarios.default.ca;
  const jesaDependence = scenarios.default.jesaDependence;

  caChart = new Chart(caCtx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Chiffre d’Affaire (M MAD)',
          data: chiffreAffaire,
          yAxisID: 'y',
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63, 81, 181, 0.12)',
          tension: 0.35,
          fill: true,
          pointRadius: 3,
        },
        {
          label: 'Dependence to JESA (%)',
          data: jesaDependence,
          yAxisID: 'y1',
          borderColor: '#00c2a8',
          backgroundColor: 'rgba(0, 194, 168, 0.08)',
          tension: 0.35,
          fill: false,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#8f9bb3', font: { size: 11 } },
        },
        y: {
          type: 'linear',
          position: 'left',
          grid: { color: '#edf1f7' },
          ticks: {
            color: '#8f9bb3',
            font: { size: 11 },
            callback: (val) => `${val}M`,
          },
        },
        y1: {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: {
            color: '#8f9bb3',
            font: { size: 11 },
            callback: (val) => `${val}%`,
          },
          min: 0,
          max: 100,
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#8f9bb3',
            font: { size: 11 },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: '#222b45',
          titleFont: { size: 12, weight: '600' },
          bodyFont: { size: 11 },
        },
      },
    },
  });

  // Gauges
  gauges.ecosystem = createGauge(document.getElementById('ecosystemGauge'), 78, {
    gradientFrom: '#00c2a8',
    background: '#edf1f7',
  });
  gauges.hse = createGauge(document.getElementById('hseGauge'), 88, {
    gradientFrom: '#4caf50',
    background: '#edf1f7',
  });
  gauges.sustainability = createGauge(document.getElementById('sustainabilityGauge'), 65, {
    gradientFrom: '#ff9800',
    background: '#edf1f7',
  });
  gauges.compliance = createGauge(document.getElementById('complianceGauge'), 92, {
    gradientFrom: '#3f51b5',
    background: '#edf1f7',
  });
  gauges.scorePreAward = createGauge(document.getElementById('scorePreAwardGauge'), 81, {
    gradientFrom: '#9c27b0',
    background: '#edf1f7',
  });

  gauges.scorePostAwardMM = createGauge(document.getElementById('scorePostAwardMMGauge'), 74, {
    gradientFrom: '#00c2a8',
    background: '#edf1f7',
  });
  gauges.scorePostAwardContract = createGauge(
    document.getElementById('scorePostAwardContractGauge'),
    69,
    {
      gradientFrom: '#ff6f61',
      background: '#edf1f7',
    }
  );
}

function initFilters() {
  const overlay = document.getElementById('filtersOverlay');
  const openBtn = document.getElementById('openFiltersBtn');
  const closeBtn = document.getElementById('closeFiltersBtn');
  const backdrop = overlay?.querySelector('.filters-backdrop');
  const clearBtn = document.getElementById('clearFiltersBtn');
  const applyBtn = document.getElementById('applyFiltersBtn');

  const toggleOverlay = (open) => {
    if (!overlay) return;
    if (open) {
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  };

  openBtn?.addEventListener('click', () => toggleOverlay(true));
  closeBtn?.addEventListener('click', () => toggleOverlay(false));
  backdrop?.addEventListener('click', () => toggleOverlay(false));

  clearBtn?.addEventListener('click', () => {
    const selects = overlay.querySelectorAll('select');
    selects.forEach((sel) => (sel.selectedIndex = 0));
  });

  applyBtn?.addEventListener('click', () => {
    // Very lightweight demo "filtering": change scenario based on supplier.
    const supplierSelect = overlay.querySelector('select');
    let scenarioKey = 'default';
    if (supplierSelect) {
      const value = supplierSelect.value;
      if (value === 'Supplier A') scenarioKey = 'supplierA';
      else if (value === 'Supplier B') scenarioKey = 'supplierB';
      else scenarioKey = 'default';
    }

    applyScenario(scenarioKey);
    toggleOverlay(false);
  });
}

function initLastRefresh() {
  const el = document.getElementById('lastRefreshValue');
  if (!el) return;
  const now = new Date();
  const formatted = now.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  el.textContent = formatted;
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab[data-view]');
  const views = document.querySelectorAll('.view[data-view]');
  if (!tabs.length || !views.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const viewName = tab.getAttribute('data-view');
      // Activate tab
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      // Show matching view
      views.forEach((v) => {
        v.classList.toggle('active', v.getAttribute('data-view') === viewName);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initFilters();
  initLastRefresh();
  initTabs();
  applyScenario('default');
});

