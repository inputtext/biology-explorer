import { useProgress } from '../context/ProgressContext';

export default function useModuleProgress(moduleId) {
  const {
    startModule,
    updateModuleProgress,
    completeModule,
    getModuleProgress,
  } = useProgress();

  const current = getModuleProgress(moduleId);

  const start = () => {
    startModule(moduleId);
  };

  const update = (percentage) => {
    startModule(moduleId);
    updateModuleProgress(moduleId, percentage);
  };

  const complete = () => {
    completeModule(moduleId);
  };

  return {
    progress: current.progress,
    status: current.status,
    start,
    update,
    complete,
  };
}
