import { useState, useCallback, useRef, useEffect } from 'react';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const requestPayment = useCallback(({ name, amount, buyerName, buyerEmail, buyerTel, merchantUid }) => {
    return new Promise((resolve, reject) => {
      const IMP = window.IMP;
      if (!IMP) {
        const err = new Error('PortOne SDK not loaded');
        if (mountedRef.current) setError(err);
        return reject(err);
      }

      const impCode = import.meta.env.VITE_IMP_CODE;
      if (!impCode) {
        const err = new Error('VITE_IMP_CODE not defined');
        if (mountedRef.current) setError(err);
        return reject(err);
      }

      if (mountedRef.current) { setLoading(true); setError(null); }

      IMP.init(impCode);
      IMP.request_pay({
        pg: import.meta.env.VITE_PG_PROVIDER,
        pay_method: 'card',
        merchant_uid: merchantUid,
        name,
        amount,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_tel: buyerTel,
      }, (response) => {
        if (mountedRef.current) setLoading(false);
        if (response.success) {
          if (mountedRef.current) setError(null);
          resolve(response);
        } else {
          const err = new Error(response.error_msg || 'Payment failed');
          if (mountedRef.current) setError(err);
          reject(err);
        }
      });
    });
  }, []);

  return { requestPayment, loading, error };
}
