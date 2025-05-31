import { Card } from 'antd';
import { InfoCircleOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import '../styles/About.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <Card title="À Propos de Emarketafrica" className="about-card">
        <div className="about-section">
          <InfoCircleOutlined className="about-icon" />
          <h3>Notre Histoire</h3>
          <p>Fondée en 2025, Emarketafrica est devenue un leader dans la vente de produits technologiques innovants.</p>
        </div>

        <div className="about-section">
          <TeamOutlined className="about-icon" />
          <h3>Notre Équipe</h3>
          <p>Une équipe passionnée de 50 experts tech dédiés à vous trouver les meilleurs produits.</p>
        </div>

        <div className="about-section">
          <TrophyOutlined className="about-icon" />
          <h3>Nos Valeurs</h3>
          <p>Qualité, Innovation et Service Client sont au cœur de notre philosophie.</p>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;