import React, { useRef } from 'react';
import { Download, Printer } from 'lucide-react';
import * as QRCodeLib from 'qrcode.react';
import { CartItem } from '../types';
import { BRAND_COLORS } from '../constants';

const QRCode = (QRCodeLib as any).default || QRCodeLib;

interface ReceiptProps {
  orderNumber: string;
  total: number;
  cart: CartItem[];
  paymentMethod: 'enkamba' | 'mobilemoney' | 'card' | 'delivery';
  paymentDetails?: {
    enkambaId?: string;
    enkambaMail?: string;
    phoneProvider?: string;
    phoneNumber?: string;
    cardLast4?: string;
  };
  isInvoice?: boolean;
}

const Receipt: React.FC<ReceiptProps> = ({
  orderNumber,
  total,
  cart,
  paymentMethod,
  paymentDetails,
  isInvoice = false,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'enkamba':
        return 'Enkamba-Pay';
      case 'mobilemoney':
        return `Mobile Money (${paymentDetails?.phoneProvider?.toUpperCase()})`;
      case 'card':
        return `Carte Bancaire (****${paymentDetails?.cardLast4})`;
      case 'delivery':
        return 'Paiement à la Livraison';
      default:
        return 'Inconnu';
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow && receiptRef.current) {
      printWindow.document.write(receiptRef.current.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const element = receiptRef.current;
    if (element) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 800;
        canvas.height = 1000;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${isInvoice ? 'facture' : 'recu'}-${orderNumber}.png`;
        link.click();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Receipt */}
      <div
        ref={receiptRef}
        className="bg-white rounded-2xl border-2 p-8 max-w-2xl mx-auto"
        style={{ borderColor: BRAND_COLORS.sourceBlue }}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2" style={{ borderColor: BRAND_COLORS.sourceBlue }}>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg"></div>
              <img 
                src="/Logo.jpeg" 
                alt="Maji Safi" 
                className="relative w-full h-full object-cover rounded-full border-3 border-[#0066CC]/20 shadow-md"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: BRAND_COLORS.sourceBlue }}>
                MAJI SAFI YA KUETU
              </h1>
              <p className="text-xs text-slate-500 font-semibold">Eau Pure & Saine</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              {isInvoice ? 'FACTURE' : 'REÇU'}
            </p>
            <p className="text-2xl font-black" style={{ color: BRAND_COLORS.sourceBlue }}>
              #{orderNumber}
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase mb-2">Entreprise</p>
            <p className="font-semibold text-slate-900">Maji Safi Ya Kwetu</p>
            <p className="text-sm text-slate-600">Kinshasa, RDC</p>
            <p className="text-sm text-slate-600">+243 97 123 4567</p>
            <p className="text-sm text-slate-600">contact@majisafi.cd</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase mb-2">Date & Heure</p>
            <p className="font-semibold text-slate-900">
              {new Date().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-slate-600">
              {new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: BRAND_COLORS.sourceBlue }}>
                <th className="text-left py-3 font-bold text-slate-900">Article</th>
                <th className="text-center py-3 font-bold text-slate-900">Quantité</th>
                <th className="text-right py-3 font-bold text-slate-900">Prix Unitaire</th>
                <th className="text-right py-3 font-bold text-slate-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="py-3 text-slate-900 font-semibold">{item.size}</td>
                  <td className="text-center py-3 text-slate-700">{item.quantity}</td>
                  <td className="text-right py-3 text-slate-700">
                    {item.pricePerUnit.toLocaleString()} CDF
                  </td>
                  <td className="text-right py-3 font-bold text-slate-900">
                    {(item.quantity * item.pricePerUnit).toLocaleString()} CDF
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-8 pb-6 border-b border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Sous-total</span>
            <span className="font-semibold text-slate-900">
              {total.toLocaleString()} CDF
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Frais de livraison</span>
            <span className="font-semibold text-slate-900">Gratuit</span>
          </div>
          <div
            className="flex justify-between items-center p-4 rounded-xl"
            style={{ backgroundColor: `${BRAND_COLORS.sourceBlue}15` }}
          >
            <span className="font-bold text-slate-900">TOTAL À PAYER</span>
            <span className="text-2xl font-black" style={{ color: BRAND_COLORS.sourceBlue }}>
              {total.toLocaleString()} CDF
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <p className="text-xs font-bold text-slate-600 uppercase mb-3">Informations de paiement</p>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Méthode de paiement</span>
              <span className="font-bold text-slate-900">{getPaymentMethodLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Statut</span>
              <span className="font-bold text-emerald-600">
                {paymentMethod === 'delivery' ? 'En attente' : 'Payé'}
              </span>
            </div>
            {paymentMethod === 'delivery' && (
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-600">À payer à la livraison</span>
                <span className="font-bold text-slate-900">
                  {total.toLocaleString()} CDF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-xs text-slate-500">
            Merci d'avoir choisi Maji Safi Ya Kwetu pour votre eau pure et saine.
          </p>

          {/* QR Code and Barcode */}
          <div className="flex justify-center gap-8 py-6 border-t border-slate-200">
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-2 rounded border-2 border-slate-200 mb-2">
                <QRCode
                  value={`ORD:${orderNumber}|TOTAL:${total}|DATE:${new Date().toISOString()}`}
                  size={120}
                  level="H"
                  includeMargin={true}
                  fgColor={BRAND_COLORS.sourceBlue}
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-xs text-slate-500 font-mono">{orderNumber}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 pt-4">
            © 2026 Maji Safi Ya Kwetu. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center max-w-2xl mx-auto">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
        >
          <Printer size={18} />
          Imprimer
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
        >
          <Download size={18} />
          Télécharger
        </button>
      </div>
    </div>
  );
};

export default Receipt;
