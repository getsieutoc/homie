'use client';

import {
  CircleHelp,
  CircleCheckBig,
  TriangleAlert,
  OctagonAlert,
  Webhook,
} from 'lucide-react';
import { type Stats } from '@/types';

const renderContent = (stat: Stats[number]) => {
  switch (stat.result) {
    case 'clean':
      return (
        <div
          key={stat.result}
          className="flex items-center gap-x-1 font-bold text-green-700 hover:text-green-500"
        >
          <CircleCheckBig className="h-4 w-4" />
          {stat._count.result}
        </div>
      );
    case 'phishing':
      return (
        <div
          key={stat.result}
          className="flex items-center gap-x-1 font-bold text-red-700 hover:text-red-500"
        >
          <Webhook className="h-4 w-4" />
          {stat._count.result}
        </div>
      );
    case 'malicious':
      return (
        <div
          key={stat.result}
          className="flex items-center gap-x-1 font-bold text-red-700 hover:text-red-500"
        >
          <OctagonAlert className="h-4 w-4" />
          {stat._count.result}
        </div>
      );
    case 'suspicious':
      return (
        <div
          key={stat.result}
          className="flex items-center gap-x-1 font-bold text-red-700 hover:text-red-500"
        >
          <TriangleAlert className="h-4 w-4" />
          {stat._count.result}
        </div>
      );
    default:
      return (
        <div
          key={stat.result}
          className="flex items-center gap-x-1 font-bold text-gray-600 hover:text-gray-400"
        >
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

export const ResultStats = ({ stats }: Props) => {
  return (
    <div className="flex gap-x-3">
      {stats
        .sort((a, b) => {
          if (a.result === 'unrated') return 1;
          if (b.result === 'unrated') return -1;
          if (a.result === 'clean') return 1;
          if (b.result === 'clean') return -1;
          return a.result.localeCompare(b.result);
        })
        .map((o) => renderContent(o))}
    </div>
  );
};
