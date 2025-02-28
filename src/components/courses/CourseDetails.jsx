/* eslint-disable react/prop-types */
import CourseHeader from './CourseHeader';
import LessonList from './LessonList';

const CourseDetails = ({ course }) => {
  const { title, description, progress, color, lessons } = course;
  
  return (
    <div className="container mx-auto p-8">
      <CourseHeader
        title={title}
        description={description}
        progress={progress}
        color={color}
      />
      <LessonList lessons={lessons} />
    </div>
  );
};

export default CourseDetails;