import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchActionCenter, updateTaskStatus } from "../api/actionCenter";
import type { ActionCenter, TaskStatus } from "../types";
import { StudentProfileCard } from "../components/StudentProfileCard";
import { TaskList } from "../components/TaskList";
import { MessagesSummary } from "../components/MessagesSummary";
import { ErrorState, LoadingState } from "../components/StatusStates";

export function StudentActionCenter({ studentId }: { studentId: string }) {
  const queryClient = useQueryClient();
  const queryKey = ["actionCenter", studentId] as const;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchActionCenter(studentId),
  });

  const mutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(taskId, status),
    // Optimistically reflect the new status so the UI feels instant.
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ActionCenter>(queryKey);
      if (previous) {
        queryClient.setQueryData<ActionCenter>(queryKey, {
          ...previous,
          tasks: previous.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t,
          ),
        });
      }
      return { previous };
    },
    // Roll back if the server rejects the change.
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    // Refetch so derived fields (urgency, summary) reflect the server truth.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <StudentProfileCard
        student={data.student}
        urgency={data.urgency}
        taskSummary={data.taskSummary}
        unreadMessagesCount={data.unreadMessagesCount}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            Tasks
            <span className="ml-2 text-sm font-normal text-slate-400">
              {data.taskSummary.open} open
            </span>
          </h2>
          <TaskList
            tasks={data.tasks}
            onStatusChange={(taskId, status) =>
              mutation.mutate({ taskId, status })
            }
            updatingTaskId={mutation.isPending ? mutation.variables?.taskId : null}
          />
        </section>

        <div className="min-w-0 lg:col-span-1">
          <MessagesSummary
            messages={data.messages}
            unreadCount={data.unreadMessagesCount}
          />
        </div>
      </div>
    </div>
  );
}
