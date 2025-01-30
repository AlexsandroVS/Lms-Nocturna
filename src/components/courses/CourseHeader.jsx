/* eslint-disable react/prop-types */

const CourseHeader = ({ title, description, progress, icon, color }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`p-4 rounded-lg ${color} text-white`}>
          <i className={`fas ${icon} text-3xl`}></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm mt-2 text-gray-600">{progress}% Completado</p>
    </div>
  );
};

export default CourseHeader;