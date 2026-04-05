import { useEffect } from 'react';

const SEOHead = ({ title, description }: any) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default SEOHead;
