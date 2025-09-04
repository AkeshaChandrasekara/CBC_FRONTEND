import { Toaster, ToastIcon, resolveValue } from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';

export const CustomToaster = () => {
  return (
    <Toaster position="top-right">
      {(t) => (
        <div
          style={{
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.3s ease',
          }}
          className="bg-white text-gray-800 px-4 py-3.5
           rounded-xl shadow-lg border border-pink-200 flex items-center space-x-2 max-w-md"
        >
          {t.type === 'success' ? (
            <FiCheckCircle className="text-pink-500 text-xl flex-shrink-0" />
          ) : (
            <ToastIcon toast={t} />
          )}
          <p className="text-sm font-medium">{resolveValue(t.message)}</p>
        </div>
      )}
    </Toaster>
  );
};