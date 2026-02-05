import React, { useState } from 'react';
import { X, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import Receipt from './Receipt';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
}

type PaymentStep = 'summary' | 'method' | 'enkamba' | 'mobilemoney' | 'card' | 'delivery' | 'confirmation' | 'receipt';
type PaymentMethod = 'enkamba' | 'mobilemoney' | 'card' | 'delivery';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, cart, total }) => {
  const [step, setStep] = useState<PaymentStep>('summary');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [enkambaId, setEnkambaId] = useState('');
  const [enkambaMail, setEnkambaMail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneProvider, setPhoneProvider] = useState<'mpesa' | 'airtel' | 'orange'>('mpesa');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleBack = () => {
    setError('');
    if (step === 'method') setStep('summary');
    else if (step === 'enkamba' || step === 'mobilemoney' || step === 'card' || step === 'delivery') setStep('method');
    else if (step === 'confirmation') setStep('method');
    else if (step === 'receipt') setStep('summary');
  };

  const handleEnkambaSubmit = async () => {
    if (!enkambaId && !enkambaMail) {
      setError('Veuillez entrer votre numéro Enkamba ou votre email');
      return;
    }
    if (enkambaId && !enkambaId.startsWith('ENK')) {
      setError('Le numéro Enkamba doit commencer par ENK');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('confirmation');
    }, 2000);
  };

  const handleMobileMoneySubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('confirmation');
    }, 2000);
  };

  const handleCardSubmit = async () => {
    if (!cardNumber || cardNumber.length < 13) {
      setError('Numéro de carte invalide');
      return;
    }
    if (!cardExpiry || !cardExpiry.includes('/')) {
      setError('Date d\'expiration invalide (MM/YY)');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setError('CVV invalide');
      return;
    }
    if (!cardName) {
      setError('Veuillez entrer le nom du titulaire');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('confirmation');
    }, 2000);
  };

  const handleConfirmation = () => {
    onClose();
    setStep('summary');
    setEnkambaId('');
    setEnkambaMail('');
    setPhoneNumber('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
  };

  const orderNumber = `CMD${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

  const handleShowReceipt = () => {
    setStep('receipt');
  };

  // Fonction supprimée - handleShowReceipt est maintenant appelée dans le bouton confirmation

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {step === 'summary' && 'Récapitulatif de commande'}
            {step === 'method' && 'Choisir un moyen de paiement'}
            {step === 'enkamba' && 'Paiement Enkamba-Pay'}
            {step === 'mobilemoney' && 'Paiement Mobile Money'}
            {step === 'card' && 'Paiement par Carte'}
            {step === 'delivery' && 'Paiement à la Livraison'}
            {step === 'confirmation' && 'Commande confirmée'}
            {step === 'receipt' && 'Reçu de Paiement'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* STEP 1: Summary */}
          {step === 'summary' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Articles commandés</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.size} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                      <div>
                        <p className="font-semibold text-slate-900">{item.size}</p>
                        <p className="text-sm text-slate-500">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-slate-900">
                        {(item.quantity * item.pricePerUnit).toLocaleString()} CDF
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Total à payer</span>
                  <span className="text-3xl font-black text-[#0066CC]">
                    {total.toLocaleString()} CDF
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex gap-3">
                <AlertCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm text-emerald-800">
                  <strong>Livraison gratuite</strong> pour les commandes supérieures à 100 000 CDF
                </p>
              </div>

              <button
                onClick={() => setStep('method')}
                className="w-full bg-[#0066CC] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Continuer vers le paiement
              </button>
            </div>
          )}

          {/* STEP 2: Payment Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setSelectedMethod('enkamba');
                  setStep('enkamba');
                }}
                className="w-full p-6 border-2 border-slate-200 rounded-2xl hover:border-[#0066CC] hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Enkamba-Pay</h3>
                    <p className="text-sm text-slate-500">Paiement sécurisé avec votre compte Enkamba</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    E
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedMethod('mobilemoney');
                  setStep('mobilemoney');
                }}
                className="w-full p-6 border-2 border-slate-200 rounded-2xl hover:border-[#0066CC] hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Mobile Money</h3>
                    <p className="text-sm text-slate-500">M-Pesa, Airtel Money, Orange Money</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    📱
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedMethod('card');
                  setStep('card');
                }}
                className="w-full p-6 border-2 border-slate-200 rounded-2xl hover:border-[#0066CC] hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Carte Bancaire</h3>
                    <p className="text-sm text-slate-500">Visa, Mastercard, American Express</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    💳
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedMethod('delivery');
                  setStep('delivery');
                }}
                className="w-full p-6 border-2 border-slate-200 rounded-2xl hover:border-[#0066CC] hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Paiement à la Livraison</h3>
                    <p className="text-sm text-slate-500">Payez directement au livreur</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    🚚
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* STEP 3: Enkamba Payment */}
          {step === 'enkamba' && (
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <p className="text-sm text-purple-900">
                  Connectez-vous à votre compte Enkamba pour effectuer le paiement de manière sécurisée.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Numéro Enkamba (ENK00000000...)
                  </label>
                  <input
                    type="text"
                    placeholder="ENK00000000..."
                    value={enkambaId}
                    onChange={(e) => {
                      setEnkambaId(e.target.value.toUpperCase());
                      setError('');
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="text-center text-slate-500 font-semibold">OU</div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Email du compte Enkamba
                  </label>
                  <input
                    type="email"
                    placeholder="votre.email@example.com"
                    value={enkambaMail}
                    onChange={(e) => {
                      setEnkambaMail(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={handleEnkambaSubmit}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Traitement...' : 'Payer maintenant'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Mobile Money Payment */}
          {step === 'mobilemoney' && (
            <div className="space-y-6">
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <p className="text-sm text-green-900">
                  Entrez votre numéro de téléphone pour recevoir une demande de confirmation.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Fournisseur
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'mpesa', label: 'M-Pesa', color: 'bg-red-100 border-red-300 text-red-700' },
                      { id: 'airtel', label: 'Airtel', color: 'bg-red-100 border-red-300 text-red-700' },
                      { id: 'orange', label: 'Orange', color: 'bg-orange-100 border-orange-300 text-orange-700' },
                    ].map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => setPhoneProvider(provider.id as any)}
                        className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                          phoneProvider === provider.id
                            ? `${provider.color} border-current`
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {provider.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+243 97 123 4567"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={handleMobileMoneySubmit}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Traitement...' : 'Payer maintenant'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Delivery Payment */}
          {step === 'delivery' && (
            <div className="space-y-6">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <p className="text-sm text-amber-900">
                  Vous paierez le montant total à la livraison. Notre livreur accepte les espèces et le mobile money.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Montant à payer</span>
                    <span className="font-bold text-slate-900">
                      {total.toLocaleString()} CDF
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Frais de livraison</span>
                    <span className="font-bold text-slate-900">Gratuit</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-xl font-black text-[#0066CC]">
                      {total.toLocaleString()} CDF
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 space-y-2">
                <p className="text-sm font-bold text-blue-900">Moyens de paiement acceptés à la livraison :</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Espèces (CDF)</li>
                  <li>✓ M-Pesa</li>
                  <li>✓ Airtel Money</li>
                  <li>✓ Orange Money</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={() => setStep('confirmation')}
                  className="flex-1 px-6 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Confirmer la commande
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Card Payment */}
          {step === 'card' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <p className="text-sm text-blue-900">
                  Vos données de carte sont sécurisées et chiffrées.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Nom du titulaire
                  </label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(e.target.value.replace(/\s/g, ''));
                      setError('');
                    }}
                    maxLength={19}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Expiration (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="12/25"
                      value={cardExpiry}
                      onChange={(e) => {
                        setCardExpiry(e.target.value);
                        setError('');
                      }}
                      maxLength={5}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value);
                        setError('');
                      }}
                      maxLength={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={handleCardSubmit}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Traitement...' : 'Payer maintenant'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Confirmation */}
          {step === 'confirmation' && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                  <Check className="text-emerald-600" size={40} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Commande confirmée!</h3>
                <p className="text-slate-500">
                  {selectedMethod === 'delivery' 
                    ? 'Votre commande a été confirmée. Vous paierez à la livraison.'
                    : 'Votre paiement a été traité avec succès.'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left">
                <p className="text-sm text-slate-500 mb-2">Numéro de commande</p>
                <p className="text-2xl font-black text-slate-900 mb-4">#{orderNumber}</p>
                <p className="text-sm text-slate-500 mb-1">Montant</p>
                <p className="text-xl font-bold text-[#0066CC]">{total.toLocaleString()} CDF</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  Vous recevrez un email de confirmation avec les détails de votre livraison.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('receipt')}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Voir le reçu
                </button>
                <button
                  onClick={handleConfirmation}
                  className="flex-1 px-6 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Receipt */}
          {step === 'receipt' && (
            <Receipt
              orderNumber={orderNumber}
              total={total}
              cart={cart}
              paymentMethod={selectedMethod || 'delivery'}
              paymentDetails={{
                enkambaId,
                enkambaMail,
                phoneProvider,
                phoneNumber,
                cardLast4: cardNumber.slice(-4),
              }}
              isInvoice={selectedMethod !== 'delivery'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
