import React from 'react';
import { Input, Button } from 'antd';


const Newsletter: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-blue-600 rounded-xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Abonnez-vous à notre newsletter</h2>
          <p className="text-blue-100 mb-8">Recevez nos dernières offres et nouveautés.</p>
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Votre adresse email" size="large" className="flex-grow" />
            <Button type="primary" size="large" className="bg-white text-blue-600">
              S'abonner
            </Button>
          </div>
          <p className="text-blue-100 text-sm mt-4">
            En vous inscrivant, vous acceptez de recevoir nos emails.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;