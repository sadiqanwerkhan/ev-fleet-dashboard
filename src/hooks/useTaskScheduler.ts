import { useCallback, useRef, useEffect } from 'react';

interface TaskSchedulerOptions {
  maxTaskTime?: number;
  priority?: 'high' | 'normal' | 'low';
}

/**
 * Hook for scheduling tasks to improve INP by breaking up long tasks
 */
export const useTaskScheduler = (options: TaskSchedulerOptions = {}) => {
  const { maxTaskTime = 5, priority = 'normal' } = options;
  const taskQueueRef = useRef<Array<() => void>>([]);
  const isProcessingRef = useRef(false);

  const processTasks = useCallback(() => {
    if (isProcessingRef.current || taskQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    const startTime = performance.now();

    while (taskQueueRef.current.length > 0 && (performance.now() - startTime < maxTaskTime)) {
      const task = taskQueueRef.current.shift();
      if (task) {
        try {
          task();
        } catch (error) {
          // Task execution failed silently
        }
      }
    }

    isProcessingRef.current = false;

    // Schedule next batch if there are more tasks
    if (taskQueueRef.current.length > 0) {
      const scheduleNext = () => {
        processTasks();
      };

      if (priority === 'high') {
        // Use setTimeout for high priority tasks
        setTimeout(scheduleNext, 0);
      } else if ('scheduler' in window) {
        const scheduler = (window as Window & { scheduler?: { postTask?: (fn: () => void, options: { priority: string }) => void } }).scheduler;
        if (scheduler?.postTask) {
          scheduler.postTask(scheduleNext, { 
            priority: priority === 'low' ? 'background' : 'user-visible' 
          });
        } else {
          setTimeout(scheduleNext, priority === 'low' ? 16 : 0);
        }
      } else if ('requestIdleCallback' in window && priority === 'low') {
        // Use requestIdleCallback for low priority tasks
        requestIdleCallback(scheduleNext);
      } else {
        // Fallback to setTimeout
        setTimeout(scheduleNext, priority === 'low' ? 16 : 0);
      }
    }
  }, [maxTaskTime, priority]);

  const scheduleTask = useCallback((task: () => void) => {
    taskQueueRef.current.push(task);
    
    if (!isProcessingRef.current) {
      processTasks();
    }
  }, [processTasks]);

  const scheduleChunkedTask = useCallback(<T>(
    items: T[],
    processor: (item: T, index: number) => void,
    chunkSize: number = 10,
    onComplete?: () => void
  ) => {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }

    chunks.forEach((chunk, chunkIndex) => {
      scheduleTask(() => {
        chunk.forEach((item, itemIndex) => {
          processor(item, chunkIndex * chunkSize + itemIndex);
        });
        
        // Call onComplete after the last chunk
        if (chunkIndex === chunks.length - 1 && onComplete) {
          onComplete();
        }
      });
    });
  }, [scheduleTask]);

  const clearTasks = useCallback(() => {
    taskQueueRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTasks();
    };
  }, [clearTasks]);

  return {
    scheduleTask,
    scheduleChunkedTask,
    clearTasks,
    hasPendingTasks: () => taskQueueRef.current.length > 0,
  };
};

export default useTaskScheduler;
