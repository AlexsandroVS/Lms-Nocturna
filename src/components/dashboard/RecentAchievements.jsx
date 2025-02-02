/* eslint-disable react/prop-types */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faComments, faFire } from "@fortawesome/free-solid-svg-icons";

function RecentAchievements({ achievements }) {
  const icons = {
    brain: faBrain,
    comments: faComments,
    fire: faFire,
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="font-semibold mb-4 text-[#003049]">🏅 Reconocimientos</h2>
      <div className="flex flex-wrap gap-4">
        {achievements.map((achievement, index) => (
          <div key={index} className="text-center flex-1 min-w-[100px]">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: `${achievement.color}20` }}
            >
              <FontAwesomeIcon
                icon={icons[achievement.icon]}
                style={{ color: achievement.color }}
              />
            </div>
            <p className="text-xs mt-1 font-medium">{achievement.title}</p>
            <p className="text-[10px] text-gray-500">{achievement.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentAchievements;
