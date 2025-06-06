import { Dispatch, SetStateAction, useState } from 'react';
import { Row, VisibilityState } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Modal, Table, useTable } from '@repo/ui';

import { useUserSessions } from './use-users';

type ListSessionsProps = {
  isListSessionsOpen: boolean;
  setIsListSessionsOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
};

export default function ListSessions({ isListSessionsOpen, setIsListSessionsOpen, userId }: ListSessionsProps) {
  const { data, loading, error, mutate } = useUserSessions(userId);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isRevokingSession, setIsRevokingSession] = useState<string | null>(null);
  const [isRevokingAllSessions, setIsRevokingAllSessions] = useState(false);

  const revokeSession = async (sessionToken: string) => {
    setIsRevokingSession(sessionToken);
    try {
      const res = await fetch(`/api/auth/admin/revoke-user-session`, {
        method: 'POST',
        body: JSON.stringify({ sessionToken }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        mutate();
        toast.success('Session revoked');
      } else {
        toast.error('Failed to revoke session');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to revoke session');
    } finally {
      setIsRevokingSession(null);
    }
  };

  const revokeAllSessions = async () => {
    setIsRevokingAllSessions(true);
    try {
      const res = await fetch(`/api/auth/admin/revoke-user-sessions`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        mutate();
        toast.success('All sessions revoked');
      } else {
        toast.error('Failed to revoke all sessions');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to revoke all sessions');
    } finally {
      setIsRevokingAllSessions(false);
    }
  };

  const { table, ...tableProps } = useTable({
    data: data?.sessions || [],
    columns: [
      {
        id: 'ipAddress',
        header: 'IP Address',
        maxSize: 100,
        cell: ({ row }: { row: any }) => {
          return <div>{row.original.ipAddress}</div>;
        }
      },
      {
        id: 'userAgent',
        header: 'User Agent',
        maxSize: 200,
        cell: ({ row }: { row: any }) => {
          return <div>{row.original.userAgent}</div>;
        }
      },
      {
        id: 'createdAt',
        header: 'Created At',
        cell: ({ row }: { row: any }) => {
          return <div>{formatDate(row.original.createdAt, 'MM/dd/yyyy hh:mm a')}</div>;
        }
      },
      {
        id: 'expiresAt',
        header: 'Expires At',
        cell: ({ row }: { row: any }) => {
          return <div>{formatDate(row.original.expiresAt, 'MM/dd/yyyy hh:mm a')}</div>;
        }
      },
      {
        id: 'actions',
        minSize: 150,
        cell: ({ row }: { row: Row<any> }) => (
          <Button
            onClick={() => revokeSession(row.original.token)}
            variant="danger-outline"
            className="w-full"
            text="Revoke"
            loading={isRevokingSession === row.original.token}
          />
        )
      }
    ],
    columnVisibility: columnVisibility,
    loading: loading,
    error: error?.message,
    onColumnVisibilityChange: (visibility) => {
      setColumnVisibility(visibility);
    }
  });

  return (
    <Modal showModal={isListSessionsOpen} setShowModal={setIsListSessionsOpen} className="min-w-xl w-max max-w-none">
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-base font-medium">Sessions</h1>
        <div className="w-full">
          <Table {...tableProps} table={table} emptyStateClassName="h-24" emptyState="No sessions found" loadingClassName="h-24" />
          {data?.sessions?.length > 0 && !loading && (
            <div className="flex w-full justify-start pt-4">
              <Button
                onClick={revokeAllSessions}
                variant="secondary"
                className="w-fit text-red-600"
                text="Revoke All Sessions"
                loading={isRevokingAllSessions}
              />
            </div>
          )}
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 flex size-7 cursor-pointer items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 hover:text-gray-700"
          onClick={() => setIsListSessionsOpen(false)}
        >
          <X className="size-4 shrink-0 text-gray-600" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </Modal>
  );
}
