import React from 'react';

interface Props {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500">{description || '해당 기능은 준비 중입니다.'}</p>
      </div>
    </div>
  );
}
