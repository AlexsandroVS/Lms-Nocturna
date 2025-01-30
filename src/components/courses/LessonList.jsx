
// eslint-disable-next-line react/prop-types
const LessonList = ({ lessons }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Lecciones</h2>
      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{index + 1}.</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-500">{lesson.duration}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              {lesson.completed ? 'Repasar' : 'Comenzar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonList;