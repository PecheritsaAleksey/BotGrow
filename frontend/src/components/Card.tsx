import type { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
};

export default function Card({ title, children }: Props) {
  return (
    <div className="bg-white rounded shadow p-4">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
}
