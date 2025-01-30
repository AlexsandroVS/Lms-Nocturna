/* eslint-disable react/prop-types */


function ProgressBar({ progress, color }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div 
        className="h-3 rounded-full transition-all duration-500" 
        style={{ 
          width: `${progress}%`,
          backgroundColor: color
        }}
      />
    </div>
  )
}

export default ProgressBar