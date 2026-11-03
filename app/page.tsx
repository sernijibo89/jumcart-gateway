'use client';

import React, { useEffect, useState } from 'react';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#090b0f' }} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', background: '#090b0f' }}>
      <iframe
        src="/dashboard.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          background: '#090b0f'
        }}
        title="JumcartFlow Operator Console"
      />
    </div>
  );
}
