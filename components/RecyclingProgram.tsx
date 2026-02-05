import React, { useState } from 'react';
import { Recycle, Gift, Leaf, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface RecyclingProgramProps {
  onClose?: () => void;
  onStartRecycling?: () => void;
}

const RecyclingProgram: React.FC<RecyclingProgramProps> = ({ onClose, onStartRecycling }) => {
  const [step, setStep] = useState(1);

  const handleStartRecycling = () => {
    if (onStartRecycling) {
      onStartRecycling();
    } else {
      alert('Merci de votre intérêt!\n\nPour commencer le programme de recyclage:\n\n1. Appelez-nous: +243 97 123 4567\n2. Ou visitez notre site: www.majisafi.cd\n3. Ou commandez en ligne et mentionnez le recyclage');
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-12 border border-emerald-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-lg"></div>
            <img 
              src="/Logo.jpeg" 
              alt="Maji Safi" 
              className="relative w-full h-full object-cover rounded-full border-3 border-emerald-200 shadow-md"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900">Programme de Recyclage</h1>
            <p className="text-slate-600">Maji Safi Ya Kuetu - Ensemble pour une ville plus propre</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-8">
        <h2 className="text-3xl font-black text-slate-900">Comment ça marche?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: 'Collectez',
              description: 'Gardez vos bouteilles vides de 10L',
              icon: Leaf
            },
            {
              step: 2,
              title: 'Accumulez',
              description: 'Rassemblez 10 bouteilles vides',
              icon: TrendingUp
            },
            {
              step: 3,
              title: 'Contactez-nous',
              description: 'Appelez ou commandez en ligne',
              icon: Users
            },
            {
              step: 4,
              title: 'Recevez',
              description: 'Livraison gratuite + bonus',
              icon: Gift
            }
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-black text-emerald-600">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
              {i < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="text-emerald-300" size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-3xl border border-slate-100 p-12">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Avantages du Programme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Livraison Gratuite',
              description: 'Recevez votre prochaine commande de 10L gratuitement',
              icon: Gift
            },
            {
              title: 'Réduction Écologique',
              description: 'Réduisez votre empreinte carbone de 50%',
              icon: Leaf
            },
            {
              title: 'Bonus Points',
              description: 'Gagnez des points de fidélité à chaque recyclage',
              icon: TrendingUp
            },
            {
              title: 'Impact Communautaire',
              description: 'Participez à la propreté de Kinshasa',
              icon: Users
            }
          ].map((benefit, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <benefit.icon className="text-emerald-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Bouteilles Recyclées', value: '125,000+', color: 'bg-emerald-50' },
          { label: 'Familles Participantes', value: '8,500+', color: 'bg-blue-50' },
          { label: 'Tonnes de Plastique Sauvées', value: '45+', color: 'bg-cyan-50' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-2xl p-8 text-center border border-slate-100`}>
            <p className="text-4xl font-black text-slate-900 mb-2">{stat.value}</p>
            <p className="text-slate-600 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-12 text-white text-center">
        <h2 className="text-3xl font-black mb-4">Prêt à Rejoindre le Mouvement?</h2>
        <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
          Commencez dès aujourd'hui à recycler vos bouteilles et recevez des récompenses exclusives.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleStartRecycling}
            className="bg-white text-emerald-600 font-bold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            Commencer le Recyclage
          </button>
          <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
            Appeler: +243 97 123 4567
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-slate-900">Questions Fréquentes</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Puis-je recycler d\'autres tailles de bouteilles?',
              a: 'Actuellement, nous acceptons les bouteilles de 10L. Les autres formats seront bientôt acceptés.'
            },
            {
              q: 'Comment puis-je vérifier mon nombre de bouteilles recyclées?',
              a: 'Consultez votre compte client pour voir votre historique de recyclage et vos points accumulés.'
            },
            {
              q: 'Quand puis-je utiliser ma livraison gratuite?',
              a: 'Vous pouvez l\'utiliser immédiatement après avoir atteint 10 bouteilles recyclées.'
            },
            {
              q: 'Y a-t-il une limite au nombre de fois que je peux recycler?',
              a: 'Non! Recyclez autant que vous le souhaitez. Plus vous recyclez, plus vous économisez.'
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all">
              <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecyclingProgram;
