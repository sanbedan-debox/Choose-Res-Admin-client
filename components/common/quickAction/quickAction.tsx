import React from "react";

type QuickActionsProps = {
  actions: { name: string; link: string; onClick: () => void }[];
};

const QuickActionsDashboard: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="bg-primary bg-opacity-5 shadow-lg rounded-lg p-4 h-64 overflow-y-auto scrollbar-hide">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <ul>
        {actions.map((action, index) => (
          <li key={index} className="mb-2">
            <a
              href="#"
              onClick={action.onClick}
              className="text-primary hover:underline"
            >
              {action.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickActionsDashboard;
