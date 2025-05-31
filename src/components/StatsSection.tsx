import { useEffect } from 'react';
import * as echarts from 'echarts';
import '../styles/StatsSection.css';

const StatsSection = () => {
  useEffect(() => {
    const chartDom = document.getElementById('sales-chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Ventes', 'Visiteurs'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil']
        },
        yAxis: { type: 'value' },
        series: [
          { name: 'Ventes', type: 'line', data: [150, 230, 224, 218, 135, 147, 260] },
          { name: 'Visiteurs', type: 'line', data: [820, 932, 901, 934, 1290, 1330, 1520] }
        ]
      };
      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stats-info">
          <h2 className="stats-title">Statistiques de vente</h2>
          <p className="stats-description">
            Suivez l'évolution de nos ventes et de notre audience.
          </p>
          <div className="stats-cards-grid">
            {[
              { value: '15k+', label: 'Clients satisfaits' },
              { value: '24/7', label: 'Support client' },
              { value: '99%', label: 'Livraisons à temps' },
              { value: '4.8/5', label: 'Note moyenne' }
            ].map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-container">
          <div id="sales-chart" className="sales-chart"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;