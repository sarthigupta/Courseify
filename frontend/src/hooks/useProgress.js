import { useState, useCallback } from "react";
import { progressAPI } from "@/api/services";

export function useProgress(courseId) {
  const [saving, setSaving] = useState(false);

  const markComplete = useCallback(
    async (lessonId) => {
      setSaving(true);
      try {
        await progressAPI.updateProgress({
          courseId,
          lessonId,
          completed: true,
          lastWatchedTimestamp: 0,
        });
        return true;
      } catch (err) {
        console.error("Failed to mark complete:", err);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [courseId]
  );

  const saveTimestamp = useCallback(
    async (lessonId, timestamp) => {
      try {
        await progressAPI.updateProgress({
          courseId,
          lessonId,
          completed: false,
          lastWatchedTimestamp: Math.floor(timestamp),
        });
      } catch (err) {
        console.error("Failed to save timestamp:", err);
      }
    },
    [courseId]
  );

  return { markComplete, saveTimestamp, saving };
}
