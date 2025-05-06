import ParticipationChart from "./charts/ParticipationChart";
import CourseAverageChart from "./charts/CourseAverageChart";
import StudentSubmissionChart from "./charts/StudentSubmissionChart";
import TopPendingActivitiesChart from "./charts/TopPendingActivitiesChart";
import LowPerformanceChart from "./charts/LowPerformanceChart";

export default function StatsOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ParticipationChart />
        <CourseAverageChart />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StudentSubmissionChart />
        <LowPerformanceChart />
      </div>
      
      <div className="grid grid-cols-1">
        <TopPendingActivitiesChart />
      </div>
    </div>
  );
}