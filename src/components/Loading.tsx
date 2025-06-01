import React from 'react';

interface GlobalLoaderProps {
  logoSrc: string;
  logoAlt?: string;
  logoSize?: string;
  message?: string;
  textSize?: string;
  textColor?: string;
}

const Loading: React.FC<GlobalLoaderProps> = ({
  logoSrc,
  logoAlt = "Loading logo",
  logoSize = 'h-24 w-24', // Sesuaikan ukuran default logo Anda
  message = "Memuat data...",
  textSize = 'text-lg',
  textColor = 'text-white',
}) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ease-in-out"
      role="alert"
      aria-live="assertive"
      aria-busy="true"
    >
      {/* Mengganti ikon dengan elemen img untuk GIF */}
      <img
        src={logoSrc}
        alt={logoAlt}
        className={`${logoSize} object-contain`} // object-contain agar GIF tidak terdistorsi
      />
      {message && (
        <p className={`mt-4 font-medium ${textSize} ${textColor}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;