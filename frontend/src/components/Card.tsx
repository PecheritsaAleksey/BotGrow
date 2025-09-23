import type { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
};

export default function Card({ title, children }: Props) {
  return (
    <div className="card">
      {title && (
        <h2 className="text-xl md:text-2xl font-semibold text-text mb-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
