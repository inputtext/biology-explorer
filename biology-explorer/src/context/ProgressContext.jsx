import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProgressContext = createContext(null);

const STORAGE_KEY = "biology-explorer-progress";

const defaultProgress = {
  modules: {},
};

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return defaultProgress;
    }

    const parsed = JSON.parse(stored);

    return {
      modules: parsed.modules || {},
    };
  } catch (error) {
    console.warn("Biology Explorer: could not load saved progress.", error);

    return defaultProgress;
  }
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn("Biology Explorer: could not save progress.", error);
    }
  }, [progress]);

  const startModule = (moduleId) => {
    setProgress((previous) => {
      const existing = previous.modules[moduleId];

      if (existing) {
        return previous;
      }

      return {
        ...previous,
        modules: {
          ...previous.modules,
          [moduleId]: {
            status: "in-progress",
            progress: 0,
            startedAt: new Date().toISOString(),
            completedAt: null,
          },
        },
      };
    });
  };

  const updateModuleProgress = (moduleId, percentage) => {
    const progressValue = Math.min(100, Math.max(0, percentage));

    setProgress((previous) => {
      const existing = previous.modules[moduleId] || {
        startedAt: new Date().toISOString(),
      };

      return {
        ...previous,
        modules: {
          ...previous.modules,
          [moduleId]: {
            ...existing,
            status: progressValue >= 100 ? "completed" : "in-progress",
            progress: progressValue,
            completedAt:
              progressValue >= 100
                ? existing.completedAt || new Date().toISOString()
                : null,
          },
        },
      };
    });
  };

  const completeModule = (moduleId) => {
    updateModuleProgress(moduleId, 100);
  };

  const resetModuleProgress = (moduleId) => {
    setProgress((previous) => {
      const nextModules = {
        ...previous.modules,
      };

      delete nextModules[moduleId];

      return {
        ...previous,
        modules: nextModules,
      };
    });
  };

  const getModuleProgress = (moduleId) => {
    return (
      progress.modules[moduleId] || {
        status: "not-started",
        progress: 0,
        startedAt: null,
        completedAt: null,
      }
    );
  };

  const value = useMemo(
    () => ({
      progress,
      startModule,
      updateModuleProgress,
      completeModule,
      resetModuleProgress,
      getModuleProgress,
    }),
    [progress],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }

  return context;
}
