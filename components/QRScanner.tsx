import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';

// @ts-ignore - jsqr n'a pas les types TypeScript
import jsQR from 'jsqr';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  mode?: 'qr' | 'barcode';
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, mode = 'qr' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let animationId: number;

    const startScanning = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            scanFrame();
          };
        }
      } catch (err) {
        setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
        setScanning(false);
      }
    };

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && scanning) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            setScanResult(code.data);
            onScan(code.data);
            setScanning(false);
            return;
          }
        }
      }

      animationId = requestAnimationFrame(scanFrame);
    };

    startScanning();

    return () => {
      cancelAnimationFrame(animationId);
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [scanning, onScan]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-slate-900">
            {mode === 'barcode' ? 'Scanner Code-barres' : 'Scanner QR Code'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {scanning ? (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-black aspect-square">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              <div className="absolute inset-0 border-4 border-[#0066CC]/30 rounded-2xl pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0066CC]/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-center text-slate-600 text-sm">
              {mode === 'barcode' 
                ? 'Positionnez le code-barres dans le cadre' 
                : 'Positionnez le QR code dans le cadre'}
            </p>
          </div>
        ) : scanResult ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-2xl p-6 text-center border-2 border-emerald-200">
              <CheckCircle size={48} className="text-emerald-600 mx-auto mb-3" />
              <p className="font-bold text-emerald-700 mb-2">
                {mode === 'barcode' ? 'Code-barres Scanné!' : 'QR Code Scanné!'}
              </p>
              <p className="text-sm text-emerald-600 break-all font-mono p-3 bg-white rounded-lg border border-emerald-100">
                {scanResult}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-2xl p-6 text-center border-2 border-red-200">
              <AlertCircle size={48} className="text-red-600 mx-auto mb-3" />
              <p className="font-bold text-red-700 mb-2">Erreur de caméra</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QRScanner;
