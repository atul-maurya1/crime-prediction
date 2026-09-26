import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {Icon && <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {trend && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.value}
            </span>
            {' '}
            <span className="text-gray-500">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
