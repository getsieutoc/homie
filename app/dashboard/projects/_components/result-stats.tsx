'use client';

import { CircleHelp, CircleCheckBig, TriangleAlert } from 'lucide-react';
import { type Stats } from '@/types';

const renderContent = (stat: Stats[number]) => {
  switch (stat.result) {
    case 'clean':
      return (
        <div className="flex items-center gap-x-1 text-green-700 hover:text-green-500">
          <CircleCheckBig className="h-4 w-4" />
          {stat._count.result}
        </div>
      );
    case 'malicious':
    case 'suspicious':
    case 'phishing':
      return (
        <div className="flex items-center gap-x-1 text-red-700 hover:text-red-500">
          <TriangleAlert className="h-4 w-4" />
          {stat._count.result}
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-x-1 text-gray-600 hover:text-gray-400">
          <CircleHelp className="h-4 w-4" />
          {stat._count.result}
        </div>
      );
  }
};

type Props = {
  projectId: string;
  stats: Stats;
};

export const ResultStats = ({ projectId, stats }: Props) => {
  return <div className="flex gap-x-3">{stats.map((o) => renderContent(o))}</div>;
};
